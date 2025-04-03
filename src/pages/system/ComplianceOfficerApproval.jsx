import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Typography, Row, Col, Divider, notification } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { mockTransactions, mockClients, mockProducts, mockKycRecords } from '../../mock/mockData';
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Storage keys
const STORAGE_KEYS = {
  COMPLIANCE_TRANSACTIONS: 'compliance_pending_transactions',
  ALL_TRANSACTIONS: 'all_transactions',
  CLIENTS: 'client_data',
  PRODUCTS: 'product_data',
  KYC_RECORDS: 'kyc_records'
};

const ComplianceOfficerApproval = () => {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [kycRecords, setKycRecords] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approvalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 从localStorage获取持久化数据，如果没有则从模拟数据获取
    const storedTransactions = getLocalStorageItem(STORAGE_KEYS.COMPLIANCE_TRANSACTIONS);
    const storedClients = getLocalStorageItem(STORAGE_KEYS.CLIENTS);
    const storedProducts = getLocalStorageItem(STORAGE_KEYS.PRODUCTS);
    const storedKycRecords = getLocalStorageItem(STORAGE_KEYS.KYC_RECORDS);
    
    if (storedTransactions) {
      setTransactions(storedTransactions);
    } else {
      // 获取所有需要合规审批的交易（风控已批准，但合规未批准的）
      const pendingTransactions = mockTransactions.filter(
        trans => trans.riskApprovalStatus === '已批准' && 
                trans.complianceApprovalStatus === '待审批'
      );
      setTransactions(pendingTransactions);
      // 存储到localStorage
      setLocalStorageItem(STORAGE_KEYS.COMPLIANCE_TRANSACTIONS, pendingTransactions);
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
    
    if (storedKycRecords) {
      setKycRecords(storedKycRecords);
    } else {
      setKycRecords(mockKycRecords);
      setLocalStorageItem(STORAGE_KEYS.KYC_RECORDS, mockKycRecords);
    }
    
    // 确保全部交易数据已存储
    if (!getLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS)) {
      setLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS, mockTransactions);
    }
  }, []);

  // 更新合规待处理交易状态
  const updateComplianceTransactions = (newTransactions) => {
    setTransactions(newTransactions);
    setLocalStorageItem(STORAGE_KEYS.COMPLIANCE_TRANSACTIONS, newTransactions);
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
        complianceApprovalStatus: values.decision === 'approve' ? '已批准' : '已拒绝',
        complianceApprovalTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: values.decision === 'approve' ? '已完成' : '已拒绝'
      };
      
      // 更新本地和localStorage状态
      updateComplianceTransactions(updatedTransactions);
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

  // 获取客户KYC记录
  const getClientKycRecords = (clientId) => {
    return kycRecords.filter(record => record.clientId === clientId);
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
      title: '风控审批',
      dataIndex: 'riskApprovalStatus',
      key: 'riskApprovalStatus',
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
      <Title level={2}>合规交易审批</Title>
      
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
        title="合规审批"
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
                  <Text strong>风控审批：</Text> 
                  <Tag color="green">{currentTransaction.riskApprovalStatus}</Tag>
                </Col>
              </Row>
            </div>
            
            <Divider>客户KYC信息</Divider>
            
            {(() => {
              const client = getClientInfo(currentTransaction.clientId);
              const kycRecords = getClientKycRecords(currentTransaction.clientId);
              const latestKyc = kycRecords.length > 0 ? 
                kycRecords.sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))[0] : 
                null;
              
              // 检查KYC是否过期
              const isKycExpired = latestKyc ? 
                moment(latestKyc.nextAssessmentDate).isBefore(moment()) : 
                true;
              
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
                      <Text strong>最近KYC评估：</Text> 
                      {latestKyc ? latestKyc.assessmentDate : '无记录'}
                    </Col>
                    <Col span={8}>
                      <Text strong>KYC状态：</Text> 
                      <Tag color={isKycExpired ? 'red' : 'green'}>
                        {isKycExpired ? 'KYC已过期' : 'KYC有效'}
                      </Tag>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={12}>
                      <Text strong>下次评估日期：</Text> 
                      {latestKyc ? latestKyc.nextAssessmentDate : '无记录'}
                    </Col>
                    <Col span={12}>
                      <Text strong>评估人员：</Text> 
                      {latestKyc ? latestKyc.assessor : '无记录'}
                    </Col>
                  </Row>
                  {latestKyc && (
                    <Row style={{ marginTop: '10px' }}>
                      <Col span={24}>
                        <Text strong>评估备注：</Text>
                        <Paragraph>
                          {latestKyc.remarks}
                        </Paragraph>
                      </Col>
                    </Row>
                  )}
                  {isKycExpired && (
                    <Row style={{ marginTop: '10px' }}>
                      <Col span={24}>
                        <div style={{ color: 'red' }}>
                          警告：客户KYC已过期，根据监管要求，应在完成新的KYC评估后再进行交易。
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card>
              );
            })()}
            
            <Divider>合规检查</Divider>
            
            <Card style={{ marginBottom: '20px' }}>
              <Row>
                <Col span={12}>
                  <Text strong>反洗钱检查：</Text> 
                  <Tag color="green">已通过</Tag>
                </Col>
                <Col span={12}>
                  <Text strong>大额交易检查：</Text> 
                  <Tag color={currentTransaction.amount > 500000 ? 'orange' : 'green'}>
                    {currentTransaction.amount > 500000 ? '需额外审核' : '已通过'}
                  </Tag>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Text strong>客户身份验证：</Text> 
                  <Tag color="green">已通过</Tag>
                </Col>
                <Col span={12}>
                  <Text strong>交易限制检查：</Text> 
                  <Tag color="green">无限制</Tag>
                </Col>
              </Row>
              {currentTransaction.amount > 500000 && (
                <Row style={{ marginTop: '10px' }}>
                  <Col span={24}>
                    <div style={{ color: 'orange' }}>
                      注意：此为大额交易，请确认资金来源合法，并已完成必要的额外审核步骤。
                    </div>
                  </Col>
                </Row>
              )}
              {(() => {
                const client = getClientInfo(currentTransaction.clientId);
                const kycRecords = getClientKycRecords(currentTransaction.clientId);
                const latestKyc = kycRecords.length > 0 ? 
                  kycRecords.sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))[0] : 
                  null;
                const isKycExpired = latestKyc ? 
                  moment(latestKyc.nextAssessmentDate).isBefore(moment()) : 
                  true;
                
                if (isKycExpired) {
                  return (
                    <Row style={{ marginTop: '10px' }}>
                      <Col span={24}>
                        <div style={{ color: 'red' }}>
                          合规风险：客户KYC已过期，可能违反监管要求，建议拒绝交易并要求客户更新KYC。
                        </div>
                      </Col>
                    </Row>
                  );
                }
                return null;
              })()}
            </Card>
            
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

export default ComplianceOfficerApproval; 