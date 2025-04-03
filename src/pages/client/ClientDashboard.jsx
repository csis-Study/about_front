import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Table, List, Tag, Typography, Button, Modal, Statistic, Space, Badge, message, Form, Input, Select, Timeline, Empty, Alert } from 'antd';
import { DashboardOutlined, FundOutlined, FileTextOutlined, BellOutlined, SettingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const ClientDashboard = () => {
  // 状态管理
  const [user, setUser] = useState(() => {
    // 从localStorage获取用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return { 
      username: userInfo.username || '张三', 
      role: userInfo.role || 'client',
      id: userInfo.id || 1,
      riskLevel: '中等',
      totalAssets: 500000
    };
  });
  const [currentMenuKey, setCurrentMenuKey] = useState('dashboard');
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isRecommendDetailModalVisible, setIsRecommendDetailModalVisible] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [requestForm] = Form.useForm();
  const [orders, setOrders] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [settingsForm] = Form.useForm();
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 添加订单状态常量
  const ORDER_STATUS = {
    PENDING_ADVISOR: 'pending_advisor',    // 待客户经理审批
    PENDING_RISK: 'pending_risk',         // 待风控审批
    PENDING_COMPLIANCE: 'pending_compliance', // 待合规审批
    APPROVED: 'approved',                 // 全部通过
    REJECTED: 'rejected'                  // 任一环节拒绝
  };

  useEffect(() => {
    // 首次加载数据
    fetchData();
    
    // 设置定期刷新数据的定时器
    const refreshTimer = setInterval(() => {
      fetchData();
    }, 10000); // 每10秒刷新一次以便及时获取KYC更新
    
    // 组件卸载时清除定时器
    return () => clearInterval(refreshTimer);
  }, []);

  const fetchData = async () => {
    try {
      console.log("正在获取客户数据...");
      // 从localStorage获取最新的用户信息
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      console.log("用户信息:", userInfo);
      
      // 更新客户名称，优先使用localStorage中的数据
      const currentUsername = userInfo.username || user.username;
      const currentUserId = userInfo.id || user.id;
      
      console.log(`当前用户: ${currentUsername}, ID: ${currentUserId}`);
      
      // 获取最新客户数据以获取KYC信息
      const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
      console.log("所有客户数据:", storedClients);
      
      // 尝试多种方式查找客户：先通过ID，再通过名称
      let currentClient = storedClients.find(c => String(c.id) === String(currentUserId));
      if (!currentClient) {
        currentClient = storedClients.find(c => c.name === currentUsername);
        console.log("通过名称找到客户:", currentClient);
      } else {
        console.log("通过ID找到客户:", currentClient);
      }
      
      if (currentClient) {
        // 更新用户数据，包括KYC信息
        console.log("更新用户KYC信息:", {
          riskLevel: currentClient.riskLevel,
          nextKycTime: currentClient.nextKycTime,
          kycHistory: currentClient.kycHistory || []
        });
        
        setUser(prevUser => ({
          ...prevUser,
          riskLevel: currentClient.riskLevel,
          nextKycTime: currentClient.nextKycTime,
          kycHistory: currentClient.kycHistory || []
        }));
      } else {
        console.warn(`未找到匹配客户数据: ${currentUsername} (ID: ${currentUserId})`);
      }
      
      // 从localStorage获取推荐数据
      const storedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
      console.log("所有推荐:", storedRecommendations);
      // 只显示当前客户的推荐
      const clientRecommendations = storedRecommendations.filter(rec => rec.clientName === currentUsername);
      console.log("客户推荐:", clientRecommendations);
      
      // 从localStorage获取订单数据
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      console.log("所有订单:", storedOrders);
      // 只显示当前客户的订单
      const clientOrders = storedOrders.filter(order => order.clientName === currentUsername);
      console.log("客户订单:", clientOrders);
      
      // 检查是否有订单状态变更
      if (orders.length > 0) {
        clientOrders.forEach(newOrder => {
          const oldOrder = orders.find(o => o.id === newOrder.id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            // 订单状态已变更，显示通知
            message.info(`订单 ${newOrder.id} 状态已变更为: ${
              newOrder.status === ORDER_STATUS.PENDING_ADVISOR ? '待客户经理审批' :
              newOrder.status === ORDER_STATUS.PENDING_RISK ? '待风控审批' :
              newOrder.status === ORDER_STATUS.PENDING_COMPLIANCE ? '待合规审批' :
              newOrder.status === ORDER_STATUS.APPROVED ? '已通过' :
              newOrder.status === ORDER_STATUS.REJECTED ? '已拒绝' : newOrder.status
            }`);
          }
        });
      }
      
      // 生成投资组合数据 - 只考虑已通过的订单
      const portfolioOrders = clientOrders.filter(order => order.status === ORDER_STATUS.APPROVED);
      let portfolioItems = [];
      
      portfolioOrders.forEach(order => {
        order.products.forEach(product => {
          // 查找产品是否已在投资组合中
          const existingProduct = portfolioItems.find(item => item.code === product.code);
          if (existingProduct) {
            // 如果已存在，增加数量和金额
            existingProduct.quantity += product.quantity;
            existingProduct.totalAmount += product.quantity * product.price;
          } else {
            // 如果不存在，添加新产品
            portfolioItems.push({
              ...product,
              totalAmount: product.quantity * product.price,
              purchaseDate: order.createTime
            });
          }
        });
      });
      
      setPortfolio(portfolioItems);
      setOrders(clientOrders);
      setRecommendations(clientRecommendations);

      // 生成通知
      const unreadRecommendations = clientRecommendations.filter(rec => rec.status === 'pending');
      const pendingOrders = clientOrders.filter(order => 
        order.status === ORDER_STATUS.PENDING_ADVISOR || 
        order.status === ORDER_STATUS.PENDING_RISK || 
        order.status === ORDER_STATUS.PENDING_COMPLIANCE
      );
      const approvedOrders = clientOrders.filter(order => order.status === ORDER_STATUS.APPROVED);
      
      const notifications = [
        ...unreadRecommendations.map(rec => ({
          id: `rec_${rec.id}`,
          type: 'recommendation',
          message: '您有一个新的投资推荐方案待确认',
          time: rec.createTime,
          read: false
        })),
        ...pendingOrders.map(order => ({
          id: `order_${order.id}`,
          type: 'order',
          message: `您的订单 ${order.id} 正在审批中，当前状态: ${
            order.status === ORDER_STATUS.PENDING_ADVISOR ? '待客户经理审批' :
            order.status === ORDER_STATUS.PENDING_RISK ? '待风控审批' :
            order.status === ORDER_STATUS.PENDING_COMPLIANCE ? '待合规审批' : '处理中'
          }`,
          time: order.approvalHistory?.length > 0 
            ? order.approvalHistory[order.approvalHistory.length - 1].time 
            : order.createTime,
          read: false
        })),
        ...approvedOrders.map(order => ({
          id: `approved_${order.id}`,
          type: 'order_approved',
          message: `您的订单 ${order.id} 已审批通过，可以执行`,
          time: order.approvalHistory?.length > 0 
            ? order.approvalHistory[order.approvalHistory.length - 1].time 
            : order.createTime,
          read: false
        }))
      ];

      setNotifications(notifications);
      
      // 如果找到KYC相关更新，显示通知
      if (currentClient && currentClient.kycHistory && currentClient.kycHistory.length > 0) {
        const latestKyc = currentClient.kycHistory[currentClient.kycHistory.length - 1];
        const kycTime = moment(latestKyc.evaluationTime);
        
        // 如果是最近1小时内的KYC更新，显示通知
        if (kycTime.isAfter(moment().subtract(1, 'hour'))) {
          message.info(`您的KYC风险评级已更新: ${latestKyc.oldRiskLevel} → ${latestKyc.newRiskLevel}`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('获取数据时出错: ' + error.message);
    }
  };

  const menuItems = [
    { key: 'dashboard', label: '工作台', icon: <DashboardOutlined /> },
    { key: 'portfolio', label: '投资组合', icon: <FundOutlined /> },
    { key: 'recommendations', label: '投资推荐', icon: <FundOutlined /> },
    { key: 'orders', label: '交易记录', icon: <FileTextOutlined /> },
    { key: 'settings', label: '账户设置', icon: <SettingOutlined /> }
  ];

  const handleConfirmRecommendation = (recommendation) => {
    // 从localStorage获取最新的用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const currentUsername = userInfo.username || user.username;
    
    // 更新推荐状态为已接受
    const allRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    const updatedRecommendations = allRecommendations.map(rec => 
      rec.id === recommendation.id ? { ...rec, status: 'accepted' } : rec
    );
    localStorage.setItem('recommendations', JSON.stringify(updatedRecommendations));
    setRecommendations(updatedRecommendations.filter(rec => rec.clientName === currentUsername));

    // 创建新订单
    const newOrder = {
      id: `ORDER${Date.now()}`,
      clientId: userInfo.id || user.id,
      clientName: currentUsername,
      products: recommendation.products,
      totalAmount: recommendation.totalAmount,
      status: ORDER_STATUS.PENDING_ADVISOR,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      approvalHistory: []
    };

    // 保存订单
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    setOrders([...orders, newOrder]);

    message.success('已接受推荐并创建订单');
    setIsRecommendDetailModalVisible(false);
  };

  const handleRejectRecommendation = (recommendationId) => {
    // 从localStorage获取所有推荐
    const allRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    // 更新推荐状态
    const updatedRecommendations = allRecommendations.map(rec => 
      rec.id === recommendationId ? { ...rec, status: 'rejected' } : rec
    );
    // 保存到localStorage
    localStorage.setItem('recommendations', JSON.stringify(updatedRecommendations));
    // 更新状态
    setRecommendations(updatedRecommendations.filter(rec => rec.clientName === user.username));
    message.success('已拒绝投资推荐方案');
  };

  const viewRecommendation = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsRecommendDetailModalVisible(true);
  };

  const handleRequestRecommendation = () => {
    setIsRequestModalVisible(true);
  };

  const handleRequestModalOk = () => {
    requestForm.validateFields().then(values => {
      const { investmentAmount, investmentPeriod, notes } = values;
      
      // 从localStorage获取最新的用户信息
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const currentUsername = userInfo.username || user.username;
      
      // 创建新的推荐请求
      const newRequest = {
        id: Date.now(),
        clientId: userInfo.id || user.id,
        clientName: currentUsername,
        riskLevel: user.riskLevel,
        investmentAmount,
        investmentPeriod,
        status: 'pending',
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        notes: notes || ''
      };

      // 保存请求
      const existingRequests = JSON.parse(localStorage.getItem('recommendationRequests') || '[]');
      localStorage.setItem('recommendationRequests', JSON.stringify([...existingRequests, newRequest]));

      // 重置表单并关闭模态框
      requestForm.resetFields();
      setIsRequestModalVisible(false);
      message.success('投资推荐请求已发送');
    });
  };

  const viewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailModalVisible(true);
  };

  // 渲染KYC信息组件
  const renderKycInfo = () => {
    return (
      <Card 
        title={
          <Space>
            <span>KYC风险评估信息</span>
            <Tag color={
              user.riskLevel === '高' ? 'red' :
              user.riskLevel === '中等' ? 'orange' :
              'green'
            }>
              {user.riskLevel || '未评级'}
            </Tag>
          </Space>
        } 
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            {user.nextKycTime && moment(user.nextKycTime).isBefore(moment()) ? (
              <Alert
                message="KYC评估已过期"
                description="您的KYC风险评估已过期，风控部门将很快联系您进行更新评估。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            ) : user.nextKycTime ? (
              <Alert
                message="KYC评估信息"
                description={`下次评估时间: ${user.nextKycTime}（距离下次评估还有 ${Math.ceil(moment(user.nextKycTime).diff(moment(), 'days'))} 天）`}
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            ) : (
              <Alert
                message="尚未设置KYC评估时间"
                description="请联系您的客户经理设置KYC评估时间。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
          </Col>
          
          {user.kycHistory && user.kycHistory.length > 0 && (
            <Col span={24}>
              <Title level={5}>最近评估记录</Title>
              <List
                dataSource={[user.kycHistory[user.kycHistory.length - 1]]}
                renderItem={record => (
                  <List.Item>
                    <List.Item.Meta
                      title={<span>评估时间: {record.evaluationTime}</span>}
                      description={
                        <>
                          <p><strong>评估人员：</strong> {record.evaluator}</p>
                          <p>
                            <strong>风险等级变更：</strong> 
                            <Tag color={
                              record.oldRiskLevel === '高' ? 'red' :
                              record.oldRiskLevel === '中等' ? 'orange' :
                              'green'
                            } style={{ margin: '0 4px' }}>
                              {record.oldRiskLevel}
                            </Tag>
                            <ArrowRightOutlined />
                            <Tag color={
                              record.newRiskLevel === '高' ? 'red' :
                              record.newRiskLevel === '中等' ? 'orange' :
                              'green'
                            } style={{ margin: '0 4px' }}>
                              {record.newRiskLevel}
                            </Tag>
                          </p>
                          <p><strong>评估说明：</strong> {record.notes}</p>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
              {user.kycHistory.length > 1 && (
                <Button 
                  type="link" 
                  onClick={() => setCurrentMenuKey('settings')}
                  style={{ padding: 0 }}
                >
                  查看全部评估历史
                </Button>
              )}
            </Col>
          )}
        </Row>
      </Card>
    );
  };

  const renderDashboard = () => {
    // 汇总数据
    const pendingRecommendations = recommendations.filter(r => r.status === 'pending');
    const approvedOrders = orders.filter(o => o.status === ORDER_STATUS.APPROVED);
    const pendingOrders = orders.filter(o => 
      o.status === ORDER_STATUS.PENDING_ADVISOR || 
      o.status === ORDER_STATUS.PENDING_RISK || 
      o.status === ORDER_STATUS.PENDING_COMPLIANCE
    );
    
    return (
      <div className="dashboard-content">
        <Title level={3}>工作台</Title>
        
        {/* KYC信息卡片 */}
        {renderKycInfo()}
        
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总资产"
                value={user.totalAssets}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待确认推荐"
                value={pendingRecommendations.length}
                valueStyle={{ color: '#1890ff' }}
                prefix={<FundOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="审批中订单"
                value={pendingOrders.length}
                valueStyle={{ color: '#faad14' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已通过订单"
                value={approvedOrders.length}
                valueStyle={{ color: '#52c41a' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>待处理推荐</span>
                  {pendingRecommendations.length > 0 && (
                    <Tag color="blue">{pendingRecommendations.length}个待确认</Tag>
                  )}
                </div>
              }
            >
              <List
                dataSource={pendingRecommendations.slice(0, 3)}
                renderItem={item => (
                  <List.Item actions={[
                    <Button size="small" type="primary" onClick={() => handleConfirmRecommendation(item)}>
                      确认
                    </Button>,
                    <Button size="small" danger onClick={() => handleRejectRecommendation(item.id)}>
                      拒绝
                    </Button>
                  ]}>
                    <List.Item.Meta
                      title={`推荐方案 ${moment(item.createTime).format('MM-DD HH:mm')}`}
                      description={`总金额: ¥${item.totalAmount.toLocaleString()} | ${item.products.length}个产品`}
                    />
                    <div>{moment(item.createTime).fromNow()}</div>
                  </List.Item>
                )}
                footer={
                  <div style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => setCurrentMenuKey('recommendations')}>查看全部</Button>
                  </div>
                }
                locale={{ emptyText: '暂无待确认推荐' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>最新订单</span>
                  {pendingOrders.length > 0 && (
                    <Tag color="orange">{pendingOrders.length}个处理中</Tag>
                  )}
                </div>
              }
            >
              <List
                dataSource={orders.slice(0, 3)}
                renderItem={item => (
                  <List.Item actions={[
                    <Button size="small" type="primary" onClick={() => viewOrder(item)}>
                      查看详情
                    </Button>
                  ]}>
                    <List.Item.Meta
                      title={item.id}
                      description={
                        <>
                          <div>金额: ¥{item.totalAmount.toLocaleString()}</div>
                          <div>状态: 
                            <Tag color={
                              item.status === ORDER_STATUS.PENDING_ADVISOR ? 'orange' :
                              item.status === ORDER_STATUS.PENDING_RISK ? 'blue' :
                              item.status === ORDER_STATUS.PENDING_COMPLIANCE ? 'purple' :
                              item.status === ORDER_STATUS.APPROVED ? 'green' :
                              item.status === ORDER_STATUS.REJECTED ? 'red' : 'default'
                            } style={{ marginLeft: 4 }}>
                              {item.status === ORDER_STATUS.PENDING_ADVISOR ? '待客户经理审批' :
                               item.status === ORDER_STATUS.PENDING_RISK ? '待风控审批' :
                               item.status === ORDER_STATUS.PENDING_COMPLIANCE ? '待合规审批' :
                               item.status === ORDER_STATUS.APPROVED ? '已通过' :
                               item.status === ORDER_STATUS.REJECTED ? '已拒绝' : item.status}
                            </Tag>
                          </div>
                        </>
                      }
                    />
                    <div>{moment(item.createTime).fromNow()}</div>
                  </List.Item>
                )}
                footer={
                  <div style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => setCurrentMenuKey('orders')}>查看全部</Button>
                  </div>
                }
                locale={{ emptyText: '暂无订单' }}
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>最新消息</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge count={notifications.filter(n => !n.read).length} />
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

  const renderRecommendationDetailModal = () => (
    <Modal
      title="推荐方案详情"
      open={isRecommendDetailModalVisible}
      onCancel={() => {
        setIsRecommendDetailModalVisible(false);
        setSelectedRecommendation(null);
      }}
      width={800}
      footer={[
        <Button key="back" onClick={() => {
          setIsRecommendDetailModalVisible(false);
          setSelectedRecommendation(null);
        }}>
          关闭
        </Button>
      ]}
    >
      {selectedRecommendation && (
        <div>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Space direction="vertical">
              <Text>客户经理：{selectedRecommendation.advisorName}</Text>
              <Text>推荐时间：{selectedRecommendation.createTime}</Text>
              <Text>投资期限：{
                {
                  short: '短期（1-3个月）',
                  medium: '中期（3-12个月）',
                  long: '长期（1年以上）'
                }[selectedRecommendation.investmentPeriod]
              }</Text>
            </Space>
          </Card>

          <Card title="推荐产品组合" style={{ marginBottom: 16 }}>
            <List
              dataSource={selectedRecommendation.products || []}
              renderItem={item => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">({item.code})</Text>
                    </Space>
                    <Space>
                      <Text>数量: {item.quantity || 0}股</Text>
                      <Text>单价: ¥{(item.price || 0).toFixed(2)}</Text>
                      <Text>金额: ¥{((item.quantity || 0) * (item.price || 0)).toLocaleString()}</Text>
                    </Space>
                    <Space>
                      <Text type="success">预期收益: {item.expectedReturn || 0}%</Text>
                      <Text type="secondary">风险等级: {item.riskLevel}</Text>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card title="投资分析">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>总投资金额：¥{(selectedRecommendation.totalAmount || 0).toLocaleString()}</Text>
              <Text>预期总收益：¥{((selectedRecommendation.totalAmount || 0) * 
                ((selectedRecommendation.products || []).reduce((sum, p) => sum + parseFloat(p.expectedReturn || 0), 0) / 
                (selectedRecommendation.products?.length || 1) / 100)).toLocaleString()}</Text>
              <Text>平均预期收益率：{((selectedRecommendation.products || []).reduce((sum, p) => sum + parseFloat(p.expectedReturn || 0), 0) / 
                (selectedRecommendation.products?.length || 1)).toFixed(1)}%</Text>
            </Space>
          </Card>
        </div>
      )}
    </Modal>
  );

  const renderRecommendations = () => {
    return (
      <div className="recommendations-content">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>投资推荐</Title>
          <Button type="primary" onClick={handleRequestRecommendation}>
            发起推荐请求
          </Button>
        </div>
        <Table
          columns={[
            { title: '推荐时间', dataIndex: 'createTime', key: 'createTime' },
            { title: '客户经理', dataIndex: 'advisorName', key: 'advisorName' },
            { 
              title: '投资金额', 
              dataIndex: 'totalAmount', 
              key: 'totalAmount',
              render: amount => `¥${(amount || 0).toLocaleString()}`
            },
            { 
              title: '投资期限', 
              dataIndex: 'investmentPeriod', 
              key: 'investmentPeriod',
              render: period => {
                const periodMap = {
                  short: '短期（1-3个月）',
                  medium: '中期（3-12个月）',
                  long: '长期（1年以上）'
                };
                return periodMap[period];
              }
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: status => (
                <Tag color={
                  status === 'pending' ? 'orange' :
                  status === 'processing' ? 'blue' :
                  status === 'accepted' ? 'green' :
                  status === 'rejected' ? 'red' : 'default'
                }>
                  {status === 'pending' ? '待确认' :
                   status === 'processing' ? '处理中' :
                   status === 'accepted' ? '已接受' :
                   status === 'rejected' ? '已拒绝' : status}
                </Tag>
              )
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Space>
                  {record.status === 'pending' && (
                    <>
                      <Button type="primary" onClick={() => handleConfirmRecommendation(record)}>
                        确认
                      </Button>
                      <Button danger onClick={() => handleRejectRecommendation(record.id)}>
                        拒绝
                      </Button>
                    </>
                  )}
                  <Button onClick={() => viewRecommendation(record)}>
                    查看详情
                  </Button>
                </Space>
              )
            }
          ]}
          dataSource={recommendations}
          rowKey="id"
        />
        {renderRecommendationDetailModal()}
      </div>
    );
  };

  const renderOrders = () => {
    return (
      <div className="orders-content">
        <Title level={3}>交易记录</Title>
        <Table
          columns={[
            {
              title: '订单编号',
              dataIndex: 'id',
              key: 'id',
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
                <Button onClick={() => viewOrder(record)}>
                  查看详情
                </Button>
              )
            }
          ]}
          dataSource={orders}
          rowKey="id"
        />

        {/* 订单详情模态框 */}
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
            </Button>
          ]}
        >
          {selectedOrder && (
            <div>
              <Card title="订单信息" style={{ marginBottom: 16 }}>
                <Space direction="vertical">
                  <Text>订单编号：{selectedOrder.id}</Text>
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

              <Card title="订单金额" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text>订单总金额：¥{selectedOrder.totalAmount.toLocaleString()}</Text>
                  <Text>预期总收益：¥{(selectedOrder.totalAmount * (selectedOrder.products.reduce((sum, p) => sum + parseFloat(p.expectedReturn), 0) / selectedOrder.products.length / 100)).toLocaleString()}</Text>
                  <Text>平均预期收益率：{(selectedOrder.products.reduce((sum, p) => sum + parseFloat(p.expectedReturn), 0) / selectedOrder.products.length).toFixed(1)}%</Text>
                </Space>
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
      </div>
    );
  };

  const renderPortfolio = () => {
    // 计算投资组合总价值
    const totalPortfolioValue = portfolio.reduce((sum, item) => sum + item.totalAmount, 0);
    
    // 计算投资组合期望收益
    const totalExpectedReturn = portfolio.reduce((sum, item) => {
      return sum + (item.totalAmount * (parseFloat(item.expectedReturn) / 100));
    }, 0);
    
    return (
      <div className="portfolio-content">
        <Title level={3}>投资组合</Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="投资组合总值"
                value={totalPortfolioValue}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="持仓产品数量"
                value={portfolio.length}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="预期年收益"
                value={totalExpectedReturn}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix="¥"
                suffix={`(${(totalPortfolioValue > 0 ? (totalExpectedReturn / totalPortfolioValue) * 100 : 0).toFixed(2)}%)`}
              />
            </Card>
          </Col>
        </Row>
        
        <Table
          columns={[
            {
              title: '产品名称',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <Space>
                  <Text strong>{text}</Text>
                  <Text type="secondary">({record.code})</Text>
                </Space>
              )
            },
            {
              title: '数量',
              dataIndex: 'quantity',
              key: 'quantity',
              render: text => `${text}股`
            },
            {
              title: '单价',
              dataIndex: 'price',
              key: 'price',
              render: text => `¥${text.toFixed(2)}`
            },
            {
              title: '总价值',
              dataIndex: 'totalAmount',
              key: 'totalAmount',
              render: text => `¥${text.toLocaleString()}`
            },
            {
              title: '风险等级',
              dataIndex: 'riskLevel',
              key: 'riskLevel',
              render: text => (
                <Tag color={
                  text === '高' ? 'red' :
                  text === '中等' ? 'orange' :
                  'green'
                }>
                  {text}
                </Tag>
              )
            },
            {
              title: '预期收益率',
              dataIndex: 'expectedReturn',
              key: 'expectedReturn',
              render: text => `${text}%`
            },
            {
              title: '预期收益',
              key: 'expectedReturnAmount',
              render: (_, record) => `¥${((record.totalAmount * parseFloat(record.expectedReturn) / 100)).toLocaleString()}`
            },
            {
              title: '购买日期',
              dataIndex: 'purchaseDate',
              key: 'purchaseDate'
            }
          ]}
          dataSource={portfolio}
          rowKey={(record, index) => `${record.code}-${index}`}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong>总计</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text strong>{`¥${totalPortfolioValue.toLocaleString()}`}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Text strong>{`¥${totalExpectedReturn.toLocaleString()}`}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="settings-content">
        <Title level={3}>账户设置</Title>
        <Card title="个人资料" style={{ marginBottom: 16 }}>
          <Form layout="vertical" initialValues={user}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="用户名" name="username">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="客户编号" name="id">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="联系电话" name="phone">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="电子邮箱" name="email">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="风险等级" name="riskLevel">
                  <Tag color={
                    user.riskLevel === '高' ? 'red' :
                    user.riskLevel === '中等' ? 'orange' :
                    'green'
                  } style={{ padding: '5px 10px' }}>
                    {user.riskLevel}
                  </Tag>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="下次KYC评估时间">
                  <Row>
                    <Col span={24}>
                      <Text strong style={{ fontSize: '16px' }}>{user.nextKycTime || '未设置'}</Text>
                    </Col>
                    <Col span={24} style={{ marginTop: 8 }}>
                      {user.nextKycTime && moment(user.nextKycTime).isBefore(moment()) ? (
                        <Alert
                          message="KYC评估已过期"
                          description="您的KYC风险评估已过期，风控部门将很快联系您进行更新评估。"
                          type="warning"
                          showIcon
                        />
                      ) : user.nextKycTime ? (
                        <Alert
                          message="KYC评估信息"
                          description={`距离下次评估还有 ${Math.ceil(moment(user.nextKycTime).diff(moment(), 'minutes'))} 分钟。KYC评估是了解您的投资偏好和风险承受能力的重要流程，请保持通讯畅通。`}
                          type="info"
                          showIcon
                        />
                      ) : (
                        <Alert
                          message="尚未设置KYC评估时间"
                          description="请联系您的客户经理设置KYC评估时间。"
                          type="info"
                          showIcon
                        />
                      )}
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary">保存更改</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        
        <Card title="KYC评估历史" style={{ marginBottom: 16 }}>
          {user.kycHistory && user.kycHistory.length > 0 ? (
            <Timeline>
              {user.kycHistory.map((record, index) => (
                <Timeline.Item key={index} color={
                  record.newRiskLevel === '高' ? 'red' :
                  record.newRiskLevel === '中等' ? 'orange' :
                  'green'
                }>
                  <p>
                    <strong>评估时间：</strong> {record.evaluationTime}
                  </p>
                  <p>
                    <strong>评估人员：</strong> {record.evaluator}
                  </p>
                  <p>
                    <strong>风险等级变更：</strong> {record.oldRiskLevel} <ArrowRightOutlined /> {record.newRiskLevel}
                  </p>
                  <p>
                    <strong>评估说明：</strong> {record.notes}
                  </p>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty description="暂无KYC评估记录" />
          )}
        </Card>
        
        <Card title="安全设置">
          <List>
            <List.Item actions={[<Button>修改</Button>]}>
              <List.Item.Meta
                title="登录密码"
                description="定期更换密码可以提升账户安全性"
              />
            </List.Item>
            <List.Item actions={[<Button>绑定</Button>]}>
              <List.Item.Meta
                title="手机验证"
                description="绑定手机号后，可以通过手机验证码重置密码"
              />
              <Badge status="success" text="已绑定" />
            </List.Item>
            <List.Item actions={[<Button>设置</Button>]}>
              <List.Item.Meta
                title="双因素认证"
                description="开启后，登录时将需要输入额外的验证码"
              />
              <Badge status="default" text="未开启" />
            </List.Item>
          </List>
        </Card>
      </div>
    );
  };

  const renderRequestModal = () => (
    <Modal
      title="发起投资推荐请求"
      open={isRequestModalVisible}
      onCancel={() => setIsRequestModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsRequestModalVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleRequestModalOk}>
          提交
        </Button>
      ]}
    >
      <Form form={requestForm} layout="vertical">
        <Form.Item
          name="investmentAmount"
          label="期望投资金额"
          rules={[{ required: true, message: '请输入投资金额' }]}
        >
          <Input type="number" placeholder="请输入投资金额" />
        </Form.Item>
        <Form.Item
          name="investmentPeriod"
          label="投资期限"
          rules={[{ required: true, message: '请选择投资期限' }]}
        >
          <Select placeholder="请选择投资期限">
            <Option value="short">短期（1-3个月）</Option>
            <Option value="medium">中期（3-12个月）</Option>
            <Option value="long">长期（1年以上）</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="notes"
          label="投资需求描述"
        >
          <TextArea rows={4} placeholder="请详细描述您的投资需求，包括投资目标、风险偏好等" />
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderContent = () => {
    switch (currentMenuKey) {
      case 'dashboard':
        return renderDashboard();
      case 'portfolio':
        return renderPortfolio();
      case 'recommendations':
        return renderRecommendations();
      case 'orders':
        return renderOrders();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text strong style={{ color: '#fff' }}>客户工作台</Text>
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
          {renderRecommendationDetailModal()}
          {renderRequestModal()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientDashboard; 