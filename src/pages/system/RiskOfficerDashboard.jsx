import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Table, List, Tag, Typography, Button, Modal, Form, Input, Select, DatePicker, Statistic, Space, Badge, message, Spin, Alert, notification } from 'antd';
import { DashboardOutlined, UserOutlined, TeamOutlined, FileTextOutlined, FundOutlined, BellOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { TextArea } = Input;

// 订单状态常量
const ORDER_STATUS = {
  PENDING_ADVISOR: 'pending_advisor',    // 待客户经理审批
  PENDING_RISK: 'pending_risk',         // 待风控审批
  PENDING_COMPLIANCE: 'pending_compliance', // 待合规审批
  APPROVED: 'approved',                 // 全部通过
  REJECTED: 'rejected'                  // 任一环节拒绝
};

const RiskOfficerDashboard = () => {
  // 用户状态
  const [user] = useState({ 
    username: '风控专员', 
    role: 'risk',
    department: 'risk'
  });
  
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMenuKey, setCurrentMenuKey] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isKycAssessmentModalVisible, setIsKycAssessmentModalVisible] = useState(false);
  const [selectedKycRequest, setSelectedKycRequest] = useState(null);
  const [kycForm] = Form.useForm();

  useEffect(() => {
    fetchData();
    
    // 设置定时器，每2分钟检查一次是否有客户需要KYC评估
    const kycCheckInterval = setInterval(() => {
      checkAndCreateKycRequests();
    }, 2 * 60 * 1000); // 2分钟间隔
    
    // 立即检查是否有需要KYC评估的客户
    checkAndCreateKycRequests();
    
    return () => {
      clearInterval(kycCheckInterval);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 从localStorage获取订单数据
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
      const storedKycRequests = JSON.parse(localStorage.getItem('kycRequests') || '[]');
      
      setOrders(storedOrders);
      setClients(storedClients);
      setKycRequests(storedKycRequests);

      // 生成通知
      const pendingRiskOrders = storedOrders.filter(order => order.status === ORDER_STATUS.PENDING_RISK);
      const pendingKycRequests = storedKycRequests.filter(req => req.status === 'pending');
      
      const notifications = [
        ...pendingRiskOrders.map(order => ({
          id: `order_${order.id}`,
          type: 'order_approval',
          clientName: order.clientName,
          message: `客户 ${order.clientName} 的订单需要风控审批`,
          time: order.createTime,
          read: false
        })),
        ...pendingKycRequests.map(req => ({
          id: `kyc_${req.id}`,
          type: 'kyc_assessment',
          clientName: req.clientName,
          message: `客户 ${req.clientName} 需要进行KYC风险评估`,
          time: req.requestTime,
          read: false
        }))
      ];

      setNotifications(notifications);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 检查并自动创建KYC评估请求
  const checkAndCreateKycRequests = () => {
    try {
      // 获取所有客户
      const allClients = JSON.parse(localStorage.getItem('clients') || '[]');
      // 获取现有的KYC请求
      const existingKycRequests = JSON.parse(localStorage.getItem('kycRequests') || '[]');
      
      // 获取当前时间
      const currentTime = moment();
      let newRequestsCreated = false;
      
      // 筛选需要KYC评估的客户（KYC时间已过期且没有待处理的评估请求）
      allClients.forEach(client => {
        // 检查客户KYC时间是否已过期
        if (client.nextKycTime && moment(client.nextKycTime).isBefore(currentTime)) {
          // 确保客户ID是数值类型，与客户列表中的ID格式一致
          const clientId = client.id;
          
          // 检查是否已经有该客户的待处理KYC请求
          const existingRequest = existingKycRequests.find(
            req => req.clientId === clientId && req.status === 'pending'
          );
          
          if (!existingRequest) {
            // 创建新的KYC评估请求
            const newKycRequest = {
              id: `KYC${Date.now()}-${clientId}`,
              clientId: clientId, // 确保ID类型一致
              clientName: client.name,
              currentRiskLevel: client.riskLevel,
              requestTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              status: 'pending',
              initiator: 'system',
              requestType: 'kyc_assessment',
              notes: '系统自动生成的KYC评估请求（KYC时间已到期）'
            };
            
            // 添加到请求列表
            existingKycRequests.push(newKycRequest);
            newRequestsCreated = true;
          }
        }
      });
      
      // 如果创建了新的评估请求，保存到localStorage并更新状态
      if (newRequestsCreated) {
        localStorage.setItem('kycRequests', JSON.stringify(existingKycRequests));
        setKycRequests(existingKycRequests);
        notification.info({
          message: '新的KYC评估请求',
          description: '系统已自动创建了需要评估的KYC请求',
          placement: 'topRight'
        });
      }
    } catch (error) {
      console.error('检查KYC请求时出错:', error);
    }
  };

  const menuItems = [
    { key: 'dashboard', label: '工作台', icon: <DashboardOutlined /> },
    { key: 'orders', label: '订单审批', icon: <FileTextOutlined /> },
    { key: 'kyc', label: 'KYC风险评估', icon: <UserOutlined /> }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" />
        </div>
      );
    }
    
    switch (currentMenuKey) {
      case 'dashboard':
        return renderDashboard();
      case 'orders':
        return renderOrders();
      case 'kyc':
        return renderKycAssessment();
      default:
        return <div>请从左侧菜单选择功能</div>;
    }
  };

  const renderDashboard = () => {
    // 获取待风控审批订单
    const pendingRiskOrders = orders.filter(o => o.status === ORDER_STATUS.PENDING_RISK);
    // 获取已风控审批的订单
    const approvedByRiskOrders = orders.filter(o => 
      o.status === ORDER_STATUS.PENDING_COMPLIANCE || 
      o.status === ORDER_STATUS.APPROVED
    );
    // 获取风控拒绝的订单
    const rejectedByRiskOrders = orders.filter(o => 
      o.status === ORDER_STATUS.REJECTED && 
      o.approvalHistory?.some(h => h.department === 'risk' && h.action === 'reject')
    );
    
    // 获取待处理KYC评估
    const pendingKycRequests = kycRequests.filter(k => k.status === 'pending');
    
    return (
      <div className="dashboard-content">
        <Title level={3}>风控工作台</Title>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="待审批订单"
                value={pendingRiskOrders.length}
                valueStyle={{ color: '#faad14' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已通过订单"
                value={approvedByRiskOrders.length}
                valueStyle={{ color: '#52c41a' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已拒绝订单"
                value={rejectedByRiskOrders.length}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待处理KYC评估"
                value={pendingKycRequests.length}
                valueStyle={{ color: '#1890ff' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>待风控审批订单</span>
                  {pendingRiskOrders.length > 0 && (
                    <Tag color="orange">{pendingRiskOrders.length}个待处理</Tag>
                  )}
                </div>
              }
            >
              <List
                dataSource={pendingRiskOrders.slice(0, 5)}
                renderItem={item => (
                  <List.Item actions={[
                    <Button size="small" onClick={() => viewOrder(item)}>查看</Button>,
                    <Button size="small" type="primary" onClick={() => handleApproveOrder(item.id)}>通过</Button>,
                    <Button size="small" danger onClick={() => handleRejectOrder(item.id)}>拒绝</Button>
                  ]}>
                    <List.Item.Meta
                      title={item.clientName}
                      description={`订单编号: ${item.id} | 金额: ¥${item.totalAmount.toLocaleString()}`}
                    />
                    <div>{moment(item.createTime).fromNow()}</div>
                  </List.Item>
                )}
                footer={
                  <div style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => setCurrentMenuKey('orders')}>查看全部订单</Button>
                  </div>
                }
                locale={{ emptyText: '暂无待审批订单' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>待处理KYC评估</span>
                  {pendingKycRequests.length > 0 && (
                    <Tag color="blue">{pendingKycRequests.length}个待处理</Tag>
                  )}
                </div>
              }
            >
              <List
                dataSource={pendingKycRequests.slice(0, 5)}
                renderItem={item => (
                  <List.Item actions={[
                    <Button size="small" type="primary" onClick={() => handleOpenKycAssessment(item)}>
                      评估
                    </Button>
                  ]}>
                    <List.Item.Meta
                      title={item.clientName}
                      description={`当前风险等级: ${item.currentRiskLevel} | 请求时间: ${item.requestTime}`}
                    />
                    <div>{moment(item.requestTime).fromNow()}</div>
                  </List.Item>
                )}
                footer={
                  <div style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => setCurrentMenuKey('kyc')}>查看全部KYC评估</Button>
                  </div>
                }
                locale={{ emptyText: '暂无待处理KYC评估' }}
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>最新消息</span>
              {notifications.length > 0 && (
                <Badge count={notifications.length} />
              )}
            </div>
          } 
          style={{ marginTop: '16px' }}
        >
          <List
            dataSource={notifications.slice(0, 5)}
            renderItem={item => (
              <List.Item>
                <Badge status={item.read ? 'default' : 'processing'} />
                <Space>
                  <Text>{item.message}</Text>
                  <Text type="secondary">{moment(item.time).fromNow()}</Text>
                </Space>
              </List.Item>
            )}
            locale={{ emptyText: '暂无新消息' }}
          />
        </Card>
      </div>
    );
  };

  const renderOrders = () => {
    // 获取最新的订单数据
    const latestOrders = orders;
    
    return (
      <div className="orders-content">
        <Title level={3}>订单审批</Title>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={fetchData}>
            刷新订单数据
          </Button>
        </div>
        <Alert
          message="订单风控审批说明"
          description={
            <div>
              <p>当前状态定义: PENDING_RISK = '{ORDER_STATUS.PENDING_RISK}'</p>
              <p>待风控审批订单数: {latestOrders.filter(o => o.status === ORDER_STATUS.PENDING_RISK).length}</p>
              {latestOrders.length === 0 && <p>目前没有订单数据</p>}
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={[
            {
              title: '订单编号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '客户名称',
              dataIndex: 'clientName',
              key: 'clientName',
            },
            {
              title: '交易产品',
              key: 'products',
              render: (_, record) => (
                <List
                  dataSource={record.products}
                  renderItem={item => (
                    <List.Item>
                      <Space>
                        <Text strong>{item.name}</Text>
                        <Text type="secondary">({item.code})</Text>
                        <Text>数量: {item.quantity}股</Text>
                        <Text>单价: ¥{item.price.toFixed(2)}</Text>
                        <Text>金额: ¥{(item.quantity * item.price).toLocaleString()}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              )
            },
            {
              title: '订单金额',
              dataIndex: 'totalAmount',
              key: 'totalAmount',
              render: amount => `¥${amount.toLocaleString()}`
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: status => (
                <Tag color={
                  status === ORDER_STATUS.PENDING_ADVISOR ? 'orange' :
                  status === ORDER_STATUS.PENDING_RISK ? 'blue' :
                  status === ORDER_STATUS.PENDING_COMPLIANCE ? 'purple' :
                  status === ORDER_STATUS.APPROVED ? 'green' :
                  status === ORDER_STATUS.REJECTED ? 'red' : 'default'
                }>
                  {status === ORDER_STATUS.PENDING_ADVISOR ? '待客户经理审批' :
                   status === ORDER_STATUS.PENDING_RISK ? '待风控审批' :
                   status === ORDER_STATUS.PENDING_COMPLIANCE ? '待合规审批' :
                   status === ORDER_STATUS.APPROVED ? '已通过' :
                   status === ORDER_STATUS.REJECTED ? '已拒绝' : status}
                </Tag>
              )
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
                <Space>
                  <Button onClick={() => viewOrder(record)}>
                    查看详情
                  </Button>
                  {/* 风控审批按钮 */}
                  {record.status === ORDER_STATUS.PENDING_RISK && (
                    <>
                      <Button type="primary" onClick={() => handleApproveOrder(record.id)}>
                        通过
                      </Button>
                      <Button danger onClick={() => handleRejectOrder(record.id)}>
                        拒绝
                      </Button>
                    </>
                  )}
                </Space>
              )
            }
          ]}
          dataSource={latestOrders}
          rowKey="id"
        />
        {renderOrderDetailModal()}
      </div>
    );
  };

  const handleApproveOrder = (orderId) => {
    // 获取最新的订单数据
    const latestOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // 查找当前订单
    const currentOrder = latestOrders.find(order => order.id === orderId);
    if (!currentOrder) {
      message.error('订单不存在');
      return;
    }

    // 验证订单状态是否为待风控审批
    if (currentOrder.status !== ORDER_STATUS.PENDING_RISK) {
      message.error(`订单状态不正确，无法审批。当前状态: ${currentOrder.status}，期望状态: ${ORDER_STATUS.PENDING_RISK}`);
      return;
    }

    // 更新订单状态为待合规审批
    const updatedOrders = latestOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: ORDER_STATUS.PENDING_COMPLIANCE,
          approvalHistory: [
            ...(order.approvalHistory || []),
            {
              approver: user.username,
              department: user.department,
              action: 'approve',
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
          ]
        };
      }
      return order;
    });

    // 保存到localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    message.success('订单已风控审批通过，等待合规审批');
    
    // 刷新数据
    fetchData();
  };

  const handleRejectOrder = (orderId) => {
    // 获取最新的订单数据
    const latestOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // 查找当前订单
    const currentOrder = latestOrders.find(order => order.id === orderId);
    if (!currentOrder) {
      message.error('订单不存在');
      return;
    }

    // 验证订单状态是否为待风控审批
    if (currentOrder.status !== ORDER_STATUS.PENDING_RISK) {
      message.error(`订单状态不正确，无法拒绝。当前状态: ${currentOrder.status}，期望状态: ${ORDER_STATUS.PENDING_RISK}`);
      return;
    }

    // 更新订单状态为已拒绝
    const updatedOrders = latestOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: ORDER_STATUS.REJECTED,
          approvalHistory: [
            ...(order.approvalHistory || []),
            {
              approver: user.username,
              department: user.department,
              action: 'reject',
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            }
          ]
        };
      }
      return order;
    });

    // 保存到localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    message.success('订单已被风控拒绝');
    
    // 刷新数据
    fetchData();
  };

  const viewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailModalVisible(true);
  };

  const renderOrderDetailModal = () => (
    <Modal
      title="订单详情"
      open={isOrderDetailModalVisible}
      onCancel={() => {
        setIsOrderDetailModalVisible(false);
        setSelectedOrder(null);
      }}
      width={800}
      footer={[
        <Button key="back" onClick={() => {
          setIsOrderDetailModalVisible(false);
          setSelectedOrder(null);
        }}>
          关闭
        </Button>,
        selectedOrder && selectedOrder.status === ORDER_STATUS.PENDING_RISK && (
          <>
            <Button key="reject" danger onClick={() => {
              handleRejectOrder(selectedOrder.id);
              setIsOrderDetailModalVisible(false);
              setSelectedOrder(null);
            }}>
              拒绝
            </Button>
            <Button key="approve" type="primary" onClick={() => {
              handleApproveOrder(selectedOrder.id);
              setIsOrderDetailModalVisible(false);
              setSelectedOrder(null);
            }}>
              通过
            </Button>
          </>
        )
      ]}
    >
      {selectedOrder && (
        <div>
          <Card title="订单信息" style={{ marginBottom: 16 }}>
            <Space direction="vertical">
              <Text>订单编号：{selectedOrder.id}</Text>
              <Text>客户名称：{selectedOrder.clientName}</Text>
              <Text>创建时间：{selectedOrder.createTime}</Text>
              <Text>订单状态：{
                selectedOrder.status === ORDER_STATUS.PENDING_ADVISOR ? '待客户经理审批' :
                selectedOrder.status === ORDER_STATUS.PENDING_RISK ? '待风控审批' :
                selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE ? '待合规审批' :
                selectedOrder.status === ORDER_STATUS.APPROVED ? '已通过' :
                selectedOrder.status === ORDER_STATUS.REJECTED ? '已拒绝' : selectedOrder.status
              }</Text>
            </Space>
          </Card>

          <Card title="订单进度" style={{ marginBottom: 16 }}>
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', width: '25%' }}>
                  <div style={{ margin: '0 auto', width: '30px', height: '30px', lineHeight: '30px', background: '#1890ff', color: 'white', borderRadius: '50%' }}>1</div>
                  <Text>下单</Text>
                  <br />
                  <Tag color="green">已完成</Tag>
                </div>
                <div style={{ textAlign: 'center', width: '25%' }}>
                  <div style={{ margin: '0 auto', width: '30px', height: '30px', lineHeight: '30px', 
                    background: selectedOrder.status === ORDER_STATUS.PENDING_ADVISOR || 
                              selectedOrder.status === ORDER_STATUS.PENDING_RISK || 
                              selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                              selectedOrder.status === ORDER_STATUS.APPROVED ? '#1890ff' : '#d9d9d9', 
                    color: 'white', borderRadius: '50%' }}>2</div>
                  <Text>客户经理审批</Text>
                  <br />
                  <Tag color={
                    selectedOrder.status === ORDER_STATUS.PENDING_ADVISOR ? 'processing' :
                    selectedOrder.status === ORDER_STATUS.PENDING_RISK || 
                    selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                    selectedOrder.status === ORDER_STATUS.APPROVED ? 'green' :
                    selectedOrder.status === ORDER_STATUS.REJECTED ? 'red' : 'default'
                  }>
                    {selectedOrder.status === ORDER_STATUS.PENDING_ADVISOR ? '处理中' :
                    selectedOrder.status === ORDER_STATUS.PENDING_RISK || 
                    selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                    selectedOrder.status === ORDER_STATUS.APPROVED ? '已通过' :
                    selectedOrder.status === ORDER_STATUS.REJECTED ? '已拒绝' : '等待中'}
                  </Tag>
                </div>
                <div style={{ textAlign: 'center', width: '25%' }}>
                  <div style={{ margin: '0 auto', width: '30px', height: '30px', lineHeight: '30px', 
                    background: selectedOrder.status === ORDER_STATUS.PENDING_RISK || 
                              selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                              selectedOrder.status === ORDER_STATUS.APPROVED ? '#1890ff' : '#d9d9d9', 
                    color: 'white', borderRadius: '50%' }}>3</div>
                  <Text>风控审批</Text>
                  <br />
                  <Tag color={
                    selectedOrder.status === ORDER_STATUS.PENDING_RISK ? 'processing' :
                    selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                    selectedOrder.status === ORDER_STATUS.APPROVED ? 'green' :
                    selectedOrder.status === ORDER_STATUS.REJECTED && selectedOrder.approvalHistory?.some(h => h.department === 'risk' && h.action === 'reject') ? 'red' : 'default'
                  }>
                    {selectedOrder.status === ORDER_STATUS.PENDING_RISK ? '处理中' :
                    selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                    selectedOrder.status === ORDER_STATUS.APPROVED ? '已通过' :
                    selectedOrder.status === ORDER_STATUS.REJECTED && selectedOrder.approvalHistory?.some(h => h.department === 'risk' && h.action === 'reject') ? '已拒绝' : '等待中'}
                  </Tag>
                </div>
                <div style={{ textAlign: 'center', width: '25%' }}>
                  <div style={{ margin: '0 auto', width: '30px', height: '30px', lineHeight: '30px', 
                    background: selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                              selectedOrder.status === ORDER_STATUS.APPROVED ? '#1890ff' : '#d9d9d9', 
                    color: 'white', borderRadius: '50%' }}>4</div>
                  <Text>合规审批</Text>
                  <br />
                  <Tag color={
                    selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE ? 'processing' :
                    selectedOrder.status === ORDER_STATUS.APPROVED ? 'green' :
                    selectedOrder.status === ORDER_STATUS.REJECTED && selectedOrder.approvalHistory?.some(h => h.department === 'compliance' && h.action === 'reject') ? 'red' : 'default'
                  }>
                    {selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE ? '处理中' :
                    selectedOrder.status === ORDER_STATUS.APPROVED ? '已通过' :
                    selectedOrder.status === ORDER_STATUS.REJECTED && selectedOrder.approvalHistory?.some(h => h.department === 'compliance' && h.action === 'reject') ? '已拒绝' : '等待中'}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>

          <Card title="交易产品" style={{ marginBottom: 16 }}>
            <List
              dataSource={selectedOrder.products}
              renderItem={item => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">({item.code})</Text>
                    </Space>
                    <Space>
                      <Text>数量: {item.quantity}股</Text>
                      <Text>单价: ¥{item.price.toFixed(2)}</Text>
                      <Text>金额: ¥{(item.quantity * item.price).toLocaleString()}</Text>
                    </Space>
                    <Space>
                      <Text type="success">预期收益: {item.expectedReturn}%</Text>
                      <Text type="secondary">风险等级: {item.riskLevel}</Text>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card title="审批历史">
            <List
              dataSource={selectedOrder.approvalHistory || []}
              renderItem={item => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>{item.approver}</Text>
                      <Text type="secondary">({item.department})</Text>
                      <Tag color={item.action === 'approve' ? 'green' : 'red'}>
                        {item.action === 'approve' ? '通过' : '拒绝'}
                      </Tag>
                    </Space>
                    <Text type="secondary">{item.time}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </div>
      )}
    </Modal>
  );

  // KYC评估界面
  const renderKycAssessment = () => {
    return (
      <div className="kyc-content">
        <Title level={3}>KYC风险评估</Title>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={fetchData}>
            刷新数据
          </Button>
        </div>
        <Alert
          message="KYC风险评估说明"
          description={
            <div>
              <p>KYC（了解您的客户）风险评估用于定期重新评估客户的风险等级</p>
              <p>待处理KYC评估数: {kycRequests.filter(k => k.status === 'pending').length}</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={[
            {
              title: '评估请求ID',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '客户名称',
              dataIndex: 'clientName',
              key: 'clientName',
            },
            {
              title: '当前风险等级',
              dataIndex: 'currentRiskLevel',
              key: 'currentRiskLevel',
              render: level => (
                <Tag color={
                  level === '高' ? 'red' :
                  level === '中等' ? 'orange' :
                  'green'
                }>
                  {level}
                </Tag>
              )
            },
            {
              title: '请求时间',
              dataIndex: 'requestTime',
              key: 'requestTime',
            },
            {
              title: '请求发起人',
              dataIndex: 'initiator',
              key: 'initiator',
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: status => (
                <Tag color={
                  status === 'pending' ? 'orange' :
                  status === 'processing' ? 'blue' :
                  status === 'completed' ? 'green' : 'default'
                }>
                  {status === 'pending' ? '待处理' :
                   status === 'processing' ? '处理中' :
                   status === 'completed' ? '已完成' : status}
                </Tag>
              )
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Space>
                  {record.status === 'pending' && (
                    <Button type="primary" onClick={() => handleOpenKycAssessment(record)}>
                      开始评估
                    </Button>
                  )}
                  {record.status === 'completed' && (
                    <Button onClick={() => viewKycResult(record)}>
                      查看结果
                    </Button>
                  )}
                </Space>
              )
            }
          ]}
          dataSource={kycRequests}
          rowKey="id"
        />
        {renderKycAssessmentModal()}
      </div>
    );
  };

  // 打开KYC评估模态框
  const handleOpenKycAssessment = (kycRequest) => {
    console.log("开始KYC评估", kycRequest);
    // 更新存储的请求对象
    setSelectedKycRequest(kycRequest);
    
    // 从localStorage获取最新的客户数据
    const allClients = JSON.parse(localStorage.getItem('clients') || '[]');
    
    // 不同的查找策略
    // 1. 通过客户ID查找
    let client = allClients.find(c => String(c.id) === String(kycRequest.clientId));
    console.log("通过ID查找客户结果:", client);
    
    // 2. 如果找不到，通过名称查找
    if (!client) {
      client = allClients.find(c => c.name === kycRequest.clientName);
      console.log("通过名称查找客户结果:", client);
      
      // 如果通过名称找到了，更新KYC请求中的clientId
      if (client) {
        console.log("通过名称找到客户，更新KYC请求中的clientId", kycRequest.clientId, "->", client.id);
        // 创建一个新的请求对象，更新clientId
        const updatedRequest = {...kycRequest, clientId: client.id};
        setSelectedKycRequest(updatedRequest);
        
        // 更新localStorage中的请求
        const allRequests = JSON.parse(localStorage.getItem('kycRequests') || '[]');
        const updatedRequests = allRequests.map(req => 
          req.id === kycRequest.id ? updatedRequest : req
        );
        localStorage.setItem('kycRequests', JSON.stringify(updatedRequests));
        setKycRequests(updatedRequests);
      }
    }
    
    // 3. 如果还找不到，创建一个临时客户
    if (!client) {
      console.warn("无法找到匹配的客户，创建临时客户数据:", {
        "请求客户ID": kycRequest.clientId,
        "请求客户名称": kycRequest.clientName,
        "所有客户": allClients
      });
      
      // 创建临时客户
      const tempClient = {
        id: kycRequest.clientId || Date.now(),
        name: kycRequest.clientName || '未知客户',
        riskLevel: kycRequest.currentRiskLevel || '中等',
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        nextKycTime: moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
        kycHistory: []
      };
      
      console.log("创建临时客户:", tempClient);
      
      // 保存到localStorage并更新客户列表
      const updatedClients = [...allClients, tempClient];
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      setClients(updatedClients);
      
      client = tempClient;
      
      // 更新KYC请求中的clientId和clientName
      const updatedRequest = {
        ...kycRequest,
        clientId: tempClient.id,
        clientName: tempClient.name,
        currentRiskLevel: tempClient.riskLevel
      };
      
      setSelectedKycRequest(updatedRequest);
      
      // 更新localStorage中的请求
      const allRequests = JSON.parse(localStorage.getItem('kycRequests') || '[]');
      const updatedRequests = allRequests.map(req => 
        req.id === kycRequest.id ? updatedRequest : req
      );
      localStorage.setItem('kycRequests', JSON.stringify(updatedRequests));
      setKycRequests(updatedRequests);
      
      message.warning('找不到匹配的客户记录，已创建临时客户数据');
    }
    
    // 设置表单值
    kycForm.setFieldsValue({
      clientName: client.name,
      currentRiskLevel: client.riskLevel,
      newRiskLevel: client.riskLevel,
      assessmentNotes: '',
      nextKycTime: moment().add(30, 'days')
    });
    
    // 显示模态框
    setIsKycAssessmentModalVisible(true);
  };

  // 提交KYC评估结果
  const handleSubmitKycAssessment = () => {
    kycForm.validateFields().then(values => {
      try {
        if (!selectedKycRequest) {
          message.error('评估请求数据丢失');
          return;
        }
        
        console.log("提交KYC评估:", selectedKycRequest, values);
        
        // 查找并更新客户信息
        const allClients = JSON.parse(localStorage.getItem('clients') || '[]');
        
        // 尝试多种方式查找客户
        let client = null;
        let clientIndex = -1;
        
        // 1. 先尝试通过ID精确匹配
        clientIndex = allClients.findIndex(c => String(c.id) === String(selectedKycRequest.clientId));
        console.log("通过ID查找客户结果:", clientIndex, selectedKycRequest.clientId);
        
        // 2. 如果找不到，尝试通过名称查找
        if (clientIndex === -1) {
          clientIndex = allClients.findIndex(c => c.name === values.clientName);
          console.log("通过名称查找客户结果:", clientIndex, values.clientName);
        }
        
        // 3. 如果还找不到，创建新客户
        if (clientIndex === -1) {
          message.warning('未找到匹配的客户记录，将创建新客户');
          const newClient = {
            id: selectedKycRequest.clientId || Date.now(),
            name: values.clientName,
            riskLevel: values.currentRiskLevel,
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            nextKycTime: values.nextKycTime.format('YYYY-MM-DD HH:mm:ss'),
            kycHistory: []
          };
          
          allClients.push(newClient);
          clientIndex = allClients.length - 1;
          console.log("创建了新客户:", newClient);
        }
        
        client = allClients[clientIndex];
        console.log("处理客户:", client);
        
        const oldRiskLevel = client.riskLevel;
        const newRiskLevel = values.newRiskLevel;
        const nextKycTime = values.nextKycTime.format('YYYY-MM-DD HH:mm:ss');
        
        // 创建KYC评估记录
        const kycRecord = {
          evaluator: user.username,
          oldRiskLevel,
          newRiskLevel,
          evaluationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          notes: values.assessmentNotes
        };
        
        // 更新客户风险等级和下次KYC时间
        allClients[clientIndex] = {
          ...client,
          riskLevel: newRiskLevel,
          nextKycTime,
          kycHistory: [...(client.kycHistory || []), kycRecord]
        };
        
        // 更新KYC请求状态
        const allKycRequests = JSON.parse(localStorage.getItem('kycRequests') || '[]');
        const updatedKycRequests = allKycRequests.map(req => {
          if (req.id === selectedKycRequest.id) {
            return {
              ...req,
              status: 'completed',
              completionTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              evaluator: user.username,
              result: {
                oldRiskLevel,
                newRiskLevel,
                notes: values.assessmentNotes,
                nextKycTime
              }
            };
          }
          return req;
        });
        
        // 保存更新到localStorage
        localStorage.setItem('clients', JSON.stringify(allClients));
        localStorage.setItem('kycRequests', JSON.stringify(updatedKycRequests));
        
        // 更新状态
        setClients(allClients);
        setKycRequests(updatedKycRequests);
        
        // 关闭模态框并显示成功消息
        setIsKycAssessmentModalVisible(false);
        setSelectedKycRequest(null);
        message.success(`客户${client.name}的风险评估已完成`);
        
        // 刷新数据
        fetchData();
      } catch (error) {
        console.error("KYC评估提交出错:", error);
        message.error(`提交评估失败: ${error.message || "未知错误"}`);
      }
    }).catch(error => {
      console.error("表单验证失败:", error);
      message.error('表单验证失败，请检查必填项');
    });
  };

  // KYC评估模态框
  const renderKycAssessmentModal = () => (
    <Modal
      title="KYC风险评估"
      open={isKycAssessmentModalVisible}
      onOk={handleSubmitKycAssessment}
      onCancel={() => {
        setIsKycAssessmentModalVisible(false);
        setSelectedKycRequest(null);
      }}
      width={600}
    >
      <Form form={kycForm} layout="vertical">
        <Form.Item
          name="clientName"
          label="客户姓名"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="currentRiskLevel"
          label="当前风险等级"
        >
          <Select disabled>
            <Option value="低">低</Option>
            <Option value="中等">中等</Option>
            <Option value="高">高</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="newRiskLevel"
          label="评估后风险等级"
          rules={[{ required: true, message: '请选择新的风险等级' }]}
        >
          <Select>
            <Option value="低">低</Option>
            <Option value="中等">中等</Option>
            <Option value="高">高</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="assessmentNotes"
          label="评估说明"
          rules={[{ required: true, message: '请输入评估说明' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="nextKycTime"
          label="下次KYC评估时间"
          rules={[{ required: true, message: '请选择下次KYC评估时间' }]}
        >
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss" 
            placeholder="选择日期时间"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  // 查看KYC评估结果
  const viewKycResult = (kycRequest) => {
    if (kycRequest.result) {
      Modal.info({
        title: 'KYC评估结果',
        content: (
          <div>
            <p><strong>客户姓名：</strong> {kycRequest.clientName}</p>
            <p><strong>评估人员：</strong> {kycRequest.evaluator}</p>
            <p><strong>评估时间：</strong> {kycRequest.completionTime}</p>
            <p><strong>原风险等级：</strong> {kycRequest.result.oldRiskLevel}</p>
            <p><strong>新风险等级：</strong> {kycRequest.result.newRiskLevel}</p>
            <p><strong>下次评估时间：</strong> {kycRequest.result.nextKycTime}</p>
            <p><strong>评估说明：</strong> {kycRequest.result.notes}</p>
          </div>
        ),
        width: 600
      });
    } else {
      message.error('评估结果数据不完整');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text strong style={{ color: '#fff' }}>风控工作台</Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentMenuKey]}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
          onClick={e => setCurrentMenuKey(e.key)}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Header style={{ background: '#fff', padding: 0, paddingLeft: 16, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {menuItems.find(item => item.key === currentMenuKey)?.label}
          </Typography.Title>
          <div>
            <span style={{ marginRight: 12 }}>欢迎，{user.username}</span>
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: '#fff',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default RiskOfficerDashboard; 