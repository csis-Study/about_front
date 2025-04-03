import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Typography, Row, Col, Timeline, Steps } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { mockTransactions } from '../../mock/mockData';
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';

const { Title, Text } = Typography;
const { Step } = Steps;

// Storage keys
const STORAGE_KEYS = {
  CLIENT_TRANSACTIONS: 'client_transactions',
  ALL_TRANSACTIONS: 'all_transactions'
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // 模拟客户数据
  const clientData = {
    id: 1,
    name: '张三'
  };

  useEffect(() => {
    // 从localStorage获取持久化数据，如果没有则从模拟数据获取
    const storageKey = `client_transactions_${clientData.id}`;
    const storedTransactions = getLocalStorageItem(storageKey);
    
    if (storedTransactions) {
      setTransactions(storedTransactions);
    } else {
      // 从模拟数据获取当前客户的交易
      const clientTransactions = mockTransactions.filter(trans => trans.clientId === clientData.id);
      setTransactions(clientTransactions);
      // 存储到localStorage
      setLocalStorageItem(storageKey, clientTransactions);
    }
    
    // 确保所有交易都已存储
    if (!getLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS)) {
      setLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS, mockTransactions);
    }
  }, []);

  const viewTransactionDetails = (record) => {
    // 确保我们有最新的交易数据
    const allTransactions = getLocalStorageItem(STORAGE_KEYS.ALL_TRANSACTIONS) || [];
    const updatedTransaction = allTransactions.find(t => t.tradeId === record.tradeId) || record;
    
    setCurrentTransaction(updatedTransaction);
    setIsDetailModalVisible(true);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case '已完成':
        return <Tag color="green" icon={<CheckCircleOutlined />}>已完成</Tag>;
      case '已拒绝':
        return <Tag color="red" icon={<CloseCircleOutlined />}>已拒绝</Tag>;
      case '审批中':
        return <Tag color="blue" icon={<ClockCircleOutlined />}>审批中</Tag>;
      case '处理中':
        return <Tag color="gold" icon={<ExclamationCircleOutlined />}>处理中</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getApprovalStatus = (approvalStatus) => {
    if (!approvalStatus) return null;
    
    switch (approvalStatus) {
      case '已批准':
        return <Tag color="green">已批准</Tag>;
      case '已拒绝':
        return <Tag color="red">已拒绝</Tag>;
      case '待审批':
        return <Tag color="blue">待审批</Tag>;
      default:
        return <Tag color="default">{approvalStatus}</Tag>;
    }
  };

  const getCurrentStep = (transaction) => {
    if (transaction.status === '已完成') {
      return 3; // 所有步骤都完成
    } else if (transaction.status === '已拒绝') {
      return -1; // 特殊状态
    } else if (transaction.complianceApprovalStatus === '已批准') {
      return 2; // 合规已批准，等待执行
    } else if (transaction.riskApprovalStatus === '已批准') {
      return 1; // 风控已批准，等待合规
    } else if (transaction.managerApprovalStatus === '已批准') {
      return 0; // 经理已批准，等待风控
    } else {
      return -1; // 未开始或异常状态
    }
  };

  const columns = [
    {
      title: '交易编号',
      dataIndex: 'tradeId',
      key: 'tradeId',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => getStatusTag(text),
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
          type="link" 
          onClick={() => viewTransactionDetails(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>交易记录</Title>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={transactions} 
          rowKey="tradeId"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* 交易详情模态框 */}
      <Modal
        title="交易详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
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
                  <Text strong>产品名称：</Text> {currentTransaction.productName}
                </Col>
                <Col span={8}>
                  <Text strong>产品类型：</Text> {currentTransaction.productType}
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={8}>
                  <Text strong>交易类型：</Text> {currentTransaction.type}
                </Col>
                <Col span={8}>
                  <Text strong>金额：</Text> ¥{currentTransaction.amount.toLocaleString()}
                </Col>
                <Col span={8}>
                  <Text strong>状态：</Text> {getStatusTag(currentTransaction.status)}
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Text strong>创建时间：</Text> {currentTransaction.createTime}
                </Col>
                <Col span={12}>
                  <Text strong>更新时间：</Text> {currentTransaction.updateTime}
                </Col>
              </Row>
            </div>

            <Card title="审批流程" style={{ marginTop: '20px' }}>
              {currentTransaction.status === '已拒绝' ? (
                <div style={{ textAlign: 'center', color: '#f5222d', marginBottom: '20px' }}>
                  <CloseCircleOutlined style={{ fontSize: '24px' }} />
                  <p style={{ marginTop: '8px' }}>交易审批被拒绝</p>
                </div>
              ) : (
                <Steps 
                  current={getCurrentStep(currentTransaction)}
                  status={currentTransaction.status === '已拒绝' ? 'error' : 'process'}
                >
                  <Step 
                    title="客户经理审批" 
                    description={
                      <div>
                        <div>状态: {getApprovalStatus(currentTransaction.managerApprovalStatus)}</div>
                        {currentTransaction.managerApprovalTime && (
                          <div>时间: {currentTransaction.managerApprovalTime}</div>
                        )}
                      </div>
                    }
                  />
                  <Step 
                    title="风控审批" 
                    description={
                      <div>
                        <div>状态: {getApprovalStatus(currentTransaction.riskApprovalStatus)}</div>
                        {currentTransaction.riskApprovalTime && (
                          <div>时间: {currentTransaction.riskApprovalTime}</div>
                        )}
                      </div>
                    }
                  />
                  <Step 
                    title="合规审批" 
                    description={
                      <div>
                        <div>状态: {getApprovalStatus(currentTransaction.complianceApprovalStatus)}</div>
                        {currentTransaction.complianceApprovalTime && (
                          <div>时间: {currentTransaction.complianceApprovalTime}</div>
                        )}
                      </div>
                    }
                  />
                  <Step 
                    title="交易执行" 
                    description={
                      currentTransaction.status === '已完成' ? (
                        <div>
                          <div>状态: <Tag color="green">已完成</Tag></div>
                          <div>时间: {currentTransaction.updateTime}</div>
                        </div>
                      ) : (
                        <div>
                          <div>状态: <Tag color="blue">等待执行</Tag></div>
                        </div>
                      )
                    }
                  />
                </Steps>
              )}
            </Card>

            <Timeline style={{ marginTop: '20px' }}>
              <Timeline.Item>
                <p><Text strong>交易创建</Text> - {currentTransaction.createTime}</p>
                <p>客户发起{currentTransaction.type}交易，金额: ¥{currentTransaction.amount.toLocaleString()}</p>
              </Timeline.Item>
              
              {currentTransaction.managerApprovalTime && (
                <Timeline.Item color={currentTransaction.managerApprovalStatus === '已批准' ? 'green' : 'red'}>
                  <p><Text strong>客户经理{currentTransaction.managerApprovalStatus}</Text> - {currentTransaction.managerApprovalTime}</p>
                </Timeline.Item>
              )}
              
              {currentTransaction.riskApprovalTime && (
                <Timeline.Item color={currentTransaction.riskApprovalStatus === '已批准' ? 'green' : 'red'}>
                  <p><Text strong>风控人员{currentTransaction.riskApprovalStatus}</Text> - {currentTransaction.riskApprovalTime}</p>
                </Timeline.Item>
              )}
              
              {currentTransaction.complianceApprovalTime && (
                <Timeline.Item color={currentTransaction.complianceApprovalStatus === '已批准' ? 'green' : 'red'}>
                  <p><Text strong>合规人员{currentTransaction.complianceApprovalStatus}</Text> - {currentTransaction.complianceApprovalTime}</p>
                </Timeline.Item>
              )}
              
              {currentTransaction.status === '已完成' && (
                <Timeline.Item color="green">
                  <p><Text strong>交易执行完成</Text> - {currentTransaction.updateTime}</p>
                </Timeline.Item>
              )}
            </Timeline>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TransactionList; 