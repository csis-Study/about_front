import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Typography, Row, Col, Divider, notification } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { mockTransactions, mockClients, mockProducts } from '../../mock/mockData';
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Storage keys
const STORAGE_KEYS = {
  RISK_TRANSACTIONS: 'risk_pending_transactions',
  ALL_TRANSACTIONS: 'all_transactions',
  CLIENTS: 'client_data',
  PRODUCTS: 'product_data'
};

const RiskOfficerApproval = () => {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approvalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 从localStorage获取持久化数据，如果没有则从模拟数据获取
    const storedTransactions = getLocalStorageItem(STORAGE_KEYS.RISK_TRANSACTIONS);
    const storedClients = getLocalStorageItem(STORAGE_KEYS.CLIENTS);
    const storedProducts = getLocalStorageItem(STORAGE_KEYS.PRODUCTS);
    
    if (storedTransactions) {
      setTransactions(storedTransactions);
    } else {
      // 获取所有需要风控审批的交易（客户经理已批准，但风控未批准的）
      const pendingTransactions = mockTransactions.filter(
        trans => trans.managerApprovalStatus === '已批准' && 
                trans.riskApprovalStatus === '待审批'
      );
      setTransactions(pendingTransactions);
      // 存储到localStorage
      setLocalStorageItem(STORAGE_KEYS.RISK_TRANSACTIONS, pendingTransactions);
    }
    
    if (storedClients) {
      setClients(storedClients);
    } else {
      setClients(mockClients);
      setLocalStorageItem(STORAGE_KEYS.CLIENTS, mockClients);
    }
    
    if (storedProducts) {
      setProducts(storedProducts);
    } else {
      const allProducts = {
        ...mockProducts
      };
      setProducts(allProducts);
      setLocalStorageItem(STORAGE_KEYS.PRODUCTS, allProducts);
    }
    
    // 确保全部交易数据已存储
    if (!getLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS)) {
      setLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS, mockTransactions);
    }
  }, []);

  // 更新风控待处理交易状态
  const updateRiskTransactions = (newTransactions) => {
    setTransactions(newTransactions);
    setLocalStorageItem(STORAGE_KEYS.RISK_TRANSACTIONS, newTransactions);
  };

  // 更新全部交易状态，确保其他页面数据一致性
  const updateAllTransactions = (updatedTransaction) => {
    const allTransactions = getLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS) || [];
    const newAllTransactions = allTransactions.map(trans => {
      if (trans.tradeId === updatedTransaction.tradeId) {
        return updatedTransaction;
      }
      return trans;
    });
    setLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS, newAllTransactions);
    
    // 更新客户交易列表
    const clientTransactions = getLocalStorageItem(`client_transactions_${updatedTransaction.clientId}`) || [];
    if (clientTransactions.length > 0) {
      const newClientTransactions = clientTransactions.map(trans => {
        if (trans.tradeId === updatedTransaction.tradeId) {
          return updatedTransaction;
        }
        return trans;
      });
      setLocalStorageItem(`client_transactions_${updatedTransaction.clientId}`, newClientTransactions);
    }
  };

  const handleApprove = (record) => {
    setCurrentTransaction(record);
    setIsModalVisible(true);
    approvalForm.resetFields();
    // 设置表单初始值
    approvalForm.setFieldsValue({
      decision: 'approve',
      remarks: ''
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await approvalForm.validateFields();
      setLoading(true);
      
      // 移除当前交易
      const updatedTransactions = transactions.filter(
        trans => trans.tradeId !== currentTransaction.tradeId
      );
      
      // 更新交易状态
      const updatedTransaction = {
        ...currentTransaction,
        riskApprovalStatus: values.decision === 'approve' ? '已批准' : '已拒绝',
        riskApprovalTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: values.decision === 'approve' ? '审批中' : '已拒绝'
      };
      
      // 更新本地和localStorage状态
      updateRiskTransactions(updatedTransactions);
      updateAllTransactions(updatedTransaction);
      
      setIsModalVisible(false);
      setLoading(false);
      
      // 显示成功通知
      notification.success({
        message: values.decision === 'approve' ? '交易已批准' : '交易已拒绝',
        description: `交易 ${currentTransaction.tradeId} 已${values.decision === 'approve' ? '批准' : '拒绝'}。`,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 获取客户信息
  const getClientInfo = (clientId) => {
    const client = clients.find(client => client.id === clientId) || {};
    return client;
  };

  // 获取产品信息
  const getProductInfo = (productId, productType) => {
    if (!products) return {};
    
    if (productType === '基金') {
      return products.funds?.find(fund => fund.id === productId) || {};
    } else if (productType === '股票') {
      return products.stocks?.find(stock => stock.id === productId) || {};
    } else if (productType === '理财产品') {
      return products.financialProducts?.find(product => product.id === productId) || {};
    }
    return {};
  };

  const columns = [
    {
      title: '交易编号',
      dataIndex: 'tradeId',
      key: 'tradeId',
    },
    {
      title: '客户姓名',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      key: 'productType',
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `¥${text.toLocaleString()}`,
    },
    {
      title: '客户经理审批',
      dataIndex: 'managerApprovalStatus',
      key: 'managerApprovalStatus',
      render: (text) => (
        <Tag color={text === '已批准' ? 'green' : 'blue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => handleApprove(record)}
        >
          审批
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>风控交易审批</Title>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={transactions} 
          rowKey="tradeId"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: '当前没有需要审批的交易' }}
        />
      </Card>

      {/* 审批模态框 */}
      <Modal
        title="风控审批"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
        confirmLoading={loading}
        width={700}
      >
        {currentTransaction && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Row>
                <Col span={8}>
                  <Text strong>交易编号：</Text> {currentTransaction.tradeId}
                </Col>
                <Col span={8}>
                  <Text strong>客户姓名：</Text> {currentTransaction.clientName}
                </Col>
                <Col span={8}>
                  <Text strong>创建时间：</Text> {currentTransaction.createTime}
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={8}>
                  <Text strong>产品名称：</Text> {currentTransaction.productName}
                </Col>
                <Col span={8}>
                  <Text strong>产品类型：</Text> {currentTransaction.productType}
                </Col>
                <Col span={8}>
                  <Text strong>交易类型：</Text> {currentTransaction.type}
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={8}>
                  <Text strong>交易金额：</Text> ¥{currentTransaction.amount.toLocaleString()}
                </Col>
                <Col span={8}>
                  <Text strong>客户经理审批：</Text> 
                  <Tag color="green">{currentTransaction.managerApprovalStatus}</Tag>
                </Col>
                <Col span={8}>
                  <Text strong>客户经理审批时间：</Text> {currentTransaction.managerApprovalTime}
                </Col>
              </Row>
            </div>
            
            <Divider>客户风险评估</Divider>
            
            {(() => {
              const client = getClientInfo(currentTransaction.clientId);
              const product = getProductInfo(currentTransaction.productId, currentTransaction.productType);
              
              // 风险等级映射
              const clientRiskMapping = {
                '保守型': '低',
                '稳健型': '中',
                '进取型': '高'
              };
              
              // 客户风险等级
              const clientRiskLevel = clientRiskMapping[client.riskLevel] || '未知';
              
              // 产品风险等级
              const productRiskLevel = product.riskLevel || '未知';
              
              // 风险匹配评估
              let riskMatch = '适合';
              let riskMatchColor = 'green';
              
              if (client.riskLevel === '保守型' && productRiskLevel === '高') {
                riskMatch = '不适合 - 产品风险高于客户承受能力';
                riskMatchColor = 'red';
              } else if (client.riskLevel === '稳健型' && productRiskLevel === '高') {
                riskMatch = '谨慎 - 产品风险接近客户承受上限';
                riskMatchColor = 'orange';
              }
              
              return (
                <Card style={{ marginBottom: '20px' }}>
                  <Row>
                    <Col span={8}>
                      <Text strong>客户风险等级：</Text> 
                      <Tag color={
                        client.riskLevel === '进取型' ? 'red' : 
                        client.riskLevel === '稳健型' ? 'blue' : 
                        'green'
                      }>
                        {client.riskLevel || '未知'}
                      </Tag>
                    </Col>
                    <Col span={8}>
                      <Text strong>产品风险等级：</Text> 
                      <Tag color={
                        productRiskLevel === '高' ? 'red' : 
                        productRiskLevel === '中' ? 'blue' : 
                        'green'
                      }>
                        {productRiskLevel}
                      </Tag>
                    </Col>
                    <Col span={8}>
                      <Text strong>风险匹配：</Text> 
                      <Tag color={riskMatchColor}>{riskMatch}</Tag>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={12}>
                      <Text strong>客户总资产：</Text> ¥{client.totalAssets?.toLocaleString() || '未知'}
                    </Col>
                    <Col span={12}>
                      <Text strong>本次交易占比：</Text> 
                      {client.totalAssets ? `${((currentTransaction.amount / client.totalAssets) * 100).toFixed(2)}%` : '未知'}
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={24}>
                      <Text strong>风险分析：</Text>
                      <Paragraph>
                        {client.totalAssets && (currentTransaction.amount / client.totalAssets) > 0.3 ? 
                          '警告：本次交易金额占客户总资产比例较高，存在集中度风险。' : 
                          '本次交易金额在客户总资产中占比合理，集中度风险较低。'
                        }
                        {riskMatch !== '适合' && <div style={{ color: 'red', marginTop: '5px' }}>{riskMatch}</div>}
                      </Paragraph>
                    </Col>
                  </Row>
                </Card>
              );
            })()}
            
            <Form
              form={approvalForm}
              layout="vertical"
            >
              <Form.Item
                name="decision"
                label="审批决定"
                rules={[{ required: true, message: '请选择审批决定' }]}
              >
                <Select>
                  <Option value="approve">批准</Option>
                  <Option value="reject">拒绝</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="remarks"
                label="审批备注"
              >
                <TextArea 
                  rows={4} 
                  placeholder="请输入审批备注（可选）..."
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default RiskOfficerApproval; 