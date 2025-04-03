import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Table, List, Tag, Typography, Button, Modal, Form, Input, Select, DatePicker, Statistic, Space, Badge, message, Spin, Alert } from 'antd';
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

const ComplianceOfficerDashboard = () => {
  // 用户状态
  const [user] = useState({ 
    username: '合规专员', 
    role: 'compliance',
    department: 'compliance'
  });
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMenuKey, setCurrentMenuKey] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchData();
    
    // 设置定时器，定期刷新数据
    const timer = setInterval(() => {
      fetchData();
    }, 5000); // 每5秒刷新一次数据
    
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 从localStorage获取订单数据
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(storedOrders);

      // 生成通知
      const pendingComplianceOrders = storedOrders.filter(order => order.status === ORDER_STATUS.PENDING_COMPLIANCE);
      
      const notifications = [
        ...pendingComplianceOrders.map(order => ({
          id: `order_${order.id}`,
          type: 'order_approval',
          clientName: order.clientName,
          message: `客户 ${order.clientName} 的订单需要合规审批`,
          time: order.createTime,
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

  const menuItems = [
    { key: 'dashboard', label: '工作台', icon: <DashboardOutlined /> },
    { key: 'orders', label: '订单审批', icon: <FileTextOutlined /> }
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
      default:
        return <div>请从左侧菜单选择功能</div>;
    }
  };

  const renderDashboard = () => {
    // 获取待合规审批订单
    const pendingComplianceOrders = orders.filter(o => o.status === ORDER_STATUS.PENDING_COMPLIANCE);
    // 获取已合规通过的订单
    const approvedOrders = orders.filter(o => o.status === ORDER_STATUS.APPROVED);
    // 获取合规拒绝的订单
    const rejectedByComplianceOrders = orders.filter(o => 
      o.status === ORDER_STATUS.REJECTED && 
      o.approvalHistory?.some(h => h.department === 'compliance' && h.action === 'reject')
    );
    
    return (
      <div className="dashboard-content">
        <Title level={3}>合规工作台</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="待审批订单"
                value={pendingComplianceOrders.length}
                valueStyle={{ color: '#faad14' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="已通过订单"
                value={approvedOrders.length}
                valueStyle={{ color: '#52c41a' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="已拒绝订单"
                value={rejectedByComplianceOrders.length}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={24}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>待合规审批订单</span>
                  {pendingComplianceOrders.length > 0 && (
                    <Tag color="orange">{pendingComplianceOrders.length}个待处理</Tag>
                  )}
                </div>
              }
            >
              <List
                dataSource={pendingComplianceOrders.slice(0, 5)}
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
          message="订单合规审批说明"
          description={
            <div>
              <p>当前状态定义: PENDING_COMPLIANCE = '{ORDER_STATUS.PENDING_COMPLIANCE}'</p>
              <p>待合规审批订单数: {latestOrders.filter(o => o.status === ORDER_STATUS.PENDING_COMPLIANCE).length}</p>
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
                  {/* 合规审批按钮 */}
                  {record.status === ORDER_STATUS.PENDING_COMPLIANCE && (
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

    // 验证订单状态是否为待合规审批
    if (currentOrder.status !== ORDER_STATUS.PENDING_COMPLIANCE) {
      message.error(`订单状态不正确，无法审批。当前状态: ${currentOrder.status}，期望状态: ${ORDER_STATUS.PENDING_COMPLIANCE}`);
      return;
    }

    // 更新订单状态为已通过
    const updatedOrders = latestOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: ORDER_STATUS.APPROVED,
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
    message.success('订单已合规审批通过，流程已完成');
    
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

    // 验证订单状态是否为待合规审批
    if (currentOrder.status !== ORDER_STATUS.PENDING_COMPLIANCE) {
      message.error(`订单状态不正确，无法拒绝。当前状态: ${currentOrder.status}，期望状态: ${ORDER_STATUS.PENDING_COMPLIANCE}`);
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
    message.success('订单已被合规拒绝');
    
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
        selectedOrder && selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE && (
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text strong style={{ color: '#fff' }}>合规工作台</Text>
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
            <Button 
              onClick={() => {
                // 创建一个测试待合规审批订单
                const latestOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                const newOrder = {
                  id: `ORDER${Date.now()}`,
                  clientId: 'CL002',
                  clientName: '测试客户',
                  products: [
                    {
                      id: 'P002',
                      code: 'P002',
                      name: '合规测试产品',
                      price: 1500,
                      quantity: 8,
                      riskLevel: '低风险',
                      expectedReturn: 5.2
                    }
                  ],
                  totalAmount: 12000,
                  status: ORDER_STATUS.PENDING_COMPLIANCE,
                  createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                  approvalHistory: [
                    {
                      approver: '客户经理',
                      department: 'advisor',
                      action: 'approve',
                      time: moment().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss')
                    },
                    {
                      approver: '风控专员',
                      department: 'risk',
                      action: 'approve',
                      time: moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
                    }
                  ]
                };
                
                localStorage.setItem('orders', JSON.stringify([...latestOrders, newOrder]));
                message.success('已创建测试待合规审批订单');
                fetchData();
              }}
              style={{ marginRight: 8 }}
            >
              创建测试待合规审批订单
            </Button>
            <Button type="primary" onClick={fetchData}>刷新数据</Button>
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

export default ComplianceOfficerDashboard; 