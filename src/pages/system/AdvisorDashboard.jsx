import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Table, List, Tag, Typography, Button, Modal, Form, Input, Select, DatePicker, Statistic, Spin, Alert, Space, Badge, message } from 'antd';
import { DashboardOutlined, UserOutlined, TeamOutlined, FileTextOutlined, FundOutlined, BellOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const ORDER_STATUS = {
  PENDING_ADVISOR: 'pending_advisor',    // 待客户经理审批
  PENDING_RISK: 'pending_risk',         // 待风控审批
  PENDING_COMPLIANCE: 'pending_compliance', // 待合规审批
  APPROVED: 'approved',                 // 全部通过
  REJECTED: 'rejected'                  // 任一环节拒绝
};

const AdvisorDashboard = () => {
  // 修改用户状态管理
  const [user] = useState({ 
    username: '客户经理', 
    role: 'advisor',
    department: 'advisor'
  });
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: '张三', 
      phone: '13800138000', 
      riskLevel: '中等',
      createTime: '2024-03-20 10:00:00',
      nextKycTime: '2024-07-20 00:00:00',
      kycHistory: [
        {
          evaluator: '风控专员',
          oldRiskLevel: '低',
          newRiskLevel: '中等',
          evaluationTime: '2024-01-20 10:00:00',
          notes: '客户投资偏好变化，风险承受能力提升'
        }
      ]
    },
    { 
      id: 2, 
      name: '李四', 
      phone: '13800138001', 
      riskLevel: '低',
      createTime: '2024-03-19 14:30:00',
      nextKycTime: '2024-06-19 00:00:00',
      kycHistory: []
    },
    { 
      id: 3, 
      name: '王五', 
      phone: '13800138002', 
      riskLevel: '高',
      createTime: '2024-03-18 09:15:00',
      nextKycTime: '2024-07-18 00:00:00',
      kycHistory: [
        {
          evaluator: '风控专员',
          oldRiskLevel: '中等',
          newRiskLevel: '高',
          evaluationTime: '2024-02-18 09:15:00',
          notes: '客户确认愿意接受较高风险以获取更高收益'
        }
      ]
    }
  ]);
  const [recommendations, setRecommendations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: '股票A', 
      code: '600001', 
      price: 10.5, 
      riskLevel: '高', 
      expectedReturn: 15,
      createTime: '2024-03-20 10:00:00'
    },
    { 
      id: 2, 
      name: '债券B', 
      code: '100001', 
      price: 100, 
      riskLevel: '低', 
      expectedReturn: 5,
      createTime: '2024-03-19 14:30:00'
    },
    { 
      id: 3, 
      name: '基金C', 
      code: '200001', 
      price: 1.2, 
      riskLevel: '中等', 
      expectedReturn: 8,
      createTime: '2024-03-18 09:15:00'
    },
    { 
      id: 4, 
      name: '股票D', 
      code: '600002', 
      price: 15.8, 
      riskLevel: '高', 
      expectedReturn: 18,
      createTime: '2024-03-17 11:20:00'
    },
    { 
      id: 5, 
      name: '债券E', 
      code: '100002', 
      price: 95, 
      riskLevel: '低', 
      expectedReturn: 4,
      createTime: '2024-03-16 15:45:00'
    },
    { 
      id: 6, 
      name: '基金F', 
      code: '200002', 
      price: 1.5, 
      riskLevel: '中等', 
      expectedReturn: 10,
      createTime: '2024-03-15 16:30:00'
    }
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentMenuKey, setCurrentMenuKey] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [isRecommendModalVisible, setIsRecommendModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [recommendForm] = Form.useForm();
  const [isRecommendDetailModalVisible, setIsRecommendDetailModalVisible] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [recommendationRequests, setRecommendationRequests] = useState([]);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isRecommendationModalVisible, setIsRecommendationModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [recommendationProducts, setRecommendationProducts] = useState([]);

  // 添加客户管理相关状态
  const [isClientModalVisible, setIsClientModalVisible] = useState(false);
  const [clientForm] = Form.useForm();
  const [editingClient, setEditingClient] = useState(null);

  // 添加产品管理相关状态
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [productForm] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
    
    // 定期刷新数据
    const refreshTimer = setInterval(() => {
      fetchData();
    }, 30000); // 每30秒刷新一次
    
    return () => clearInterval(refreshTimer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 从localStorage获取数据，如果没有则使用初始数据
      const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      // 修复订单状态和推荐状态
      const storedOrders = fixOrderStatuses();
      const storedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
      const storedRequests = JSON.parse(localStorage.getItem('recommendationRequests') || '[]');
      
      // 检查是否有状态为"处理中"的推荐请求，但已有对应的推荐生成
      const updatedRequests = storedRequests.map(req => {
        if (req.status === 'processing') {
          // 检查这个请求是否有对应的被客户接受的推荐
          const hasAcceptedRecommendation = storedRecommendations.some(rec => 
            rec.requestId === req.id && rec.status === 'accepted'
          );
          
          if (hasAcceptedRecommendation) {
            console.log(`更新推荐请求状态: ${req.id}, 原状态: ${req.status}, 新状态: accepted`);
            return { ...req, status: 'accepted' };
          }
        }
        return req;
      });
      
      // 保存更新后的请求
      if (JSON.stringify(updatedRequests) !== JSON.stringify(storedRequests)) {
        localStorage.setItem('recommendationRequests', JSON.stringify(updatedRequests));
      }

      // 更新状态
      setClients(storedClients.length > 0 ? storedClients : clients);
      setProducts(storedProducts.length > 0 ? storedProducts : products);
      setOrders(storedOrders);
      setRecommendations(storedRecommendations);
      setRecommendationRequests(updatedRequests);

      // 生成通知
      const pendingOrders = storedOrders.filter(order => order.status === ORDER_STATUS.PENDING_ADVISOR);
      const pendingRequests = updatedRequests.filter(req => req.status === 'pending');
      
      // 调试输出
      console.log('fetchData - 已修复状态的订单:', storedOrders);
      console.log('fetchData - 待审批订单:', pendingOrders);

      const notifications = [
        ...pendingOrders.map(order => ({
          id: `order_${order.id}`,
          type: 'order_approval',
          clientName: order.clientName,
          message: `客户 ${order.clientName} 的订单需要审批`,
          time: order.createTime,
          read: false
        })),
        ...pendingRequests.map(req => ({
          id: `req_${req.id}`,
          type: 'recommendation_request',
          clientName: req.clientName,
          message: `客户 ${req.clientName} 请求投资推荐`,
          time: req.createTime,
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

  // 修复订单状态值和推荐状态值的函数
  const fixOrderStatuses = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 确保订单状态常量正确
    const fixedOrders = storedOrders.map(order => {
      if (typeof order.status === 'string') {
        // 检查状态值是否在常量定义中，否则设为默认值
        if (!Object.values(ORDER_STATUS).includes(order.status)) {
          console.log(`修复订单状态: ${order.id}, 原状态: ${order.status}, 新状态: ${ORDER_STATUS.PENDING_ADVISOR}`);
          order.status = ORDER_STATUS.PENDING_ADVISOR;
        }
      } else {
        // 如果状态不是字符串，设为默认值
        console.log(`修复订单非字符串状态: ${order.id}, 原状态: ${order.status}, 新状态: ${ORDER_STATUS.PENDING_ADVISOR}`);
        order.status = ORDER_STATUS.PENDING_ADVISOR;
      }
      return order;
    });
    
    // 保存修复后的订单
    localStorage.setItem('orders', JSON.stringify(fixedOrders));
    
    // 同步也修复推荐状态
    fixRecommendationStatuses();
    
    return fixedOrders;
  };
  
  // 添加修复推荐状态的函数
  const fixRecommendationStatuses = () => {
    const storedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 检查是否有被客户接受的推荐，但状态未更新
    const updatedRecommendations = storedRecommendations.map(rec => {
      // 检查此推荐是否已生成订单
      const hasOrder = storedOrders.some(order => 
        order.products.some(p => rec.products && rec.products.some(rp => rp.id === p.id)) && 
        order.clientName === rec.clientName
      );
      
      if (hasOrder && rec.status !== 'accepted') {
        console.log(`修复推荐状态: ${rec.id}, 客户: ${rec.clientName}, 原状态: ${rec.status}, 新状态: accepted`);
        return { ...rec, status: 'accepted' };
      }
      return rec;
    });
    
    // 保存修复后的推荐
    localStorage.setItem('recommendations', JSON.stringify(updatedRecommendations));
    
    return updatedRecommendations;
  };

  // 修改获取推荐请求的函数
  const fetchRecommendationRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem('recommendationRequests') || '[]');
    setRecommendationRequests(storedRequests);
  };

  useEffect(() => {
    fetchRecommendationRequests();
  }, []);

  // 修改推荐列表渲染函数
  const renderRecommendations = () => {
    return (
      <div className="recommendations-content">
        <Title level={3}>推荐请求</Title>
        <Table
          columns={[
            { title: '客户姓名', dataIndex: 'clientName', key: 'clientName' },
            { title: '申请时间', dataIndex: 'createTime', key: 'createTime' },
            { 
              title: '风险等级', 
              dataIndex: 'riskLevel', 
              key: 'riskLevel',
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
              title: '投资金额', 
              dataIndex: 'investmentAmount', 
              key: 'investmentAmount',
              render: amount => `¥${amount.toLocaleString()}`
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
                  {status === 'pending' ? '待处理' :
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
                    <Button type="primary" onClick={() => handleGenerateRecommendation(record)}>
                      生成推荐
                    </Button>
                  )}
                  {record.status === 'processing' && (
                    <Button type="primary" onClick={() => handleGenerateRecommendation(record)}>
                      重新生成
                    </Button>
                  )}
                  <Button onClick={() => viewRecommendation(record)}>
                    查看详情
                  </Button>
                </Space>
              )
            }
          ]}
          dataSource={recommendationRequests}
          rowKey="id"
        />
        {renderRecommendationModal()}
      </div>
    );
  };

  // 修改生成推荐方案的函数
  const handleGenerateRecommendation = (request) => {
    setCurrentRequest(request);
    generateRecommendationProducts(request);
  };

  // 添加生成推荐产品的函数
  const generateRecommendationProducts = (request) => {
    // 根据客户风险等级筛选合适的产品
    const riskLevelMap = {
      '低': ['低'],
      '中等': ['低', '中等'],
      '高': ['低', '中等', '高']
    };
    
    const suitableProducts = products.filter(product => 
      riskLevelMap[request.riskLevel].includes(product.riskLevel)
    );

    // 随机打乱产品顺序
    const shuffledProducts = [...suitableProducts].sort(() => Math.random() - 0.5);
    
    // 随机选择2-3个产品
    const productCount = Math.floor(Math.random() * 2) + 2; // 2-3个产品
    const selectedProducts = shuffledProducts.slice(0, productCount).map(product => {
      // 根据产品风险等级和投资期限调整预期收益率
      let baseReturn = product.expectedReturn;
      let periodMultiplier = 1;
      switch (request.investmentPeriod) {
        case 'short':
          periodMultiplier = 0.8;
          break;
        case 'medium':
          periodMultiplier = 1;
          break;
        case 'long':
          periodMultiplier = 1.2;
          break;
      }
      
      // 添加随机波动
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2之间的随机数
      const adjustedReturn = baseReturn * periodMultiplier * randomFactor;

      // 计算购买数量，考虑投资金额和产品价格
      const quantity = Math.floor((request.investmentAmount / productCount) / product.price);

      return {
        ...product,
        quantity,
        expectedReturn: adjustedReturn.toFixed(1)
      };
    });

    setRecommendationProducts(selectedProducts);
    setIsRecommendationModalVisible(true);
  };

  // 修改推荐方案生成模态框
  const renderRecommendationModal = () => (
    <Modal
      title="生成推荐方案"
      open={isRecommendationModalVisible}
      onOk={handleConfirmRecommendation}
      onCancel={() => {
        setIsRecommendationModalVisible(false);
        setCurrentRequest(null);
        setRecommendationProducts([]);
      }}
      width={800}
      footer={[
        <Button key="regenerate" onClick={() => generateRecommendationProducts(currentRequest)}>
          重新生成
        </Button>,
        <Button key="cancel" onClick={() => {
          setIsRecommendationModalVisible(false);
          setCurrentRequest(null);
          setRecommendationProducts([]);
        }}>
          取消
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirmRecommendation}>
          确认
        </Button>
      ]}
    >
      {currentRequest && (
        <div>
          <Card title="客户信息" style={{ marginBottom: 16 }}>
            <Space direction="vertical">
              <Text>客户姓名：{currentRequest.clientName}</Text>
              <Text>风险等级：{currentRequest.riskLevel}</Text>
              <Text>投资金额：¥{currentRequest.investmentAmount.toLocaleString()}</Text>
              <Text>投资期限：{
                {
                  short: '短期（1-3个月）',
                  medium: '中期（3-12个月）',
                  long: '长期（1年以上）'
                }[currentRequest.investmentPeriod]
              }</Text>
              {currentRequest.notes && <Text>备注：{currentRequest.notes}</Text>}
            </Space>
          </Card>

          <Card title="推荐产品组合" style={{ marginBottom: 16 }}>
            <List
              dataSource={recommendationProducts}
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

          <Card title="投资分析">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>总投资金额：¥{recommendationProducts.reduce((sum, p) => sum + p.quantity * p.price, 0).toLocaleString()}</Text>
              <Text>预期总收益：¥{(recommendationProducts.reduce((sum, p) => sum + p.quantity * p.price * (parseFloat(p.expectedReturn) / 100), 0)).toLocaleString()}</Text>
              <Text>平均预期收益率：{(recommendationProducts.reduce((sum, p) => sum + parseFloat(p.expectedReturn), 0) / recommendationProducts.length).toFixed(1)}%</Text>
            </Space>
          </Card>
        </div>
      )}
    </Modal>
  );

  // 修改推荐方案确认函数
  const handleConfirmRecommendation = () => {
    if (!currentRequest || !recommendationProducts.length) return;

    const newRecommendation = {
      id: Date.now(),
      requestId: currentRequest.id,
      clientId: currentRequest.clientId,
      clientName: currentRequest.clientName,
      advisorId: user.id,
      advisorName: user.username,
      products: recommendationProducts,
      totalAmount: recommendationProducts.reduce((sum, p) => sum + p.quantity * p.price, 0),
      investmentPeriod: currentRequest.investmentPeriod,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      status: 'pending'
    };

    // 保存推荐方案
    const existingRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    localStorage.setItem('recommendations', JSON.stringify([...existingRecommendations, newRecommendation]));

    // 更新请求状态
    const existingRequests = JSON.parse(localStorage.getItem('recommendationRequests') || '[]');
    const updatedRequests = existingRequests.map(req => 
      req.id === currentRequest.id ? { ...req, status: 'processing' } : req
    );
    localStorage.setItem('recommendationRequests', JSON.stringify(updatedRequests));

    message.success('推荐方案已生成');
    setIsRecommendationModalVisible(false);
    fetchData();
  };

  // 修改获取推荐列表的函数
  const fetchRecommendations = () => {
    const storedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    setRecommendations(storedRecommendations);
  };

  // 修改拒绝推荐状态的函数
  const handleRejectRecommendation = (recommendationId) => {
    const updatedRecommendations = recommendations.map(rec => 
      rec.id === recommendationId ? { ...rec, status: 'rejected' } : rec
    );
    localStorage.setItem('recommendations', JSON.stringify(updatedRecommendations));
    setRecommendations(updatedRecommendations);
    message.success('已拒绝推荐方案');
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // 刷新推荐方案
  const refreshRecommendation = (recommendationId) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      handleGenerateRecommendation(recommendation);
    }
  };

  // 生成订单
  const generateOrder = (recommendationId) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    const newOrder = {
      id: orders.length + 1,
      clientId: recommendation.clientId,
      clientName: recommendation.clientName,
      products: recommendation.products.map(p => ({
        ...p,
        price: products.find(prod => prod.id === p.productId)?.price || 0
      })),
      totalAmount: recommendation.products.reduce((sum, p) => 
        sum + (p.quantity * (products.find(prod => prod.id === p.productId)?.price || 0)), 0),
      status: 'pending',
      createTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    setOrders([...orders, newOrder]);
    message.success('已生成订单');
  };

  // 表格列定义
  const recommendationColumns = [
    {
      title: '客户名称',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '推荐产品',
      key: 'products',
      render: (_, record) => (
        <List
          dataSource={record.products}
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
                  <Text>金额: ¥{item.totalAmount.toLocaleString()}</Text>
                </Space>
                <Space>
                  <Text type="success">预期收益: {item.expectedReturn}%</Text>
                  <Text type="secondary">风险等级: {item.riskLevel}</Text>
                </Space>
              </Space>
            </List.Item>
          )}
        />
      )
    },
    {
      title: '总金额',
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
          status === 'pending' ? 'orange' :
          status === 'processing' ? 'blue' :
          status === 'accepted' ? 'green' :
          status === 'rejected' ? 'red' : 'default'
        }>
          {status === 'pending' ? '待处理' :
           status === 'processing' ? '处理中' :
           status === 'accepted' ? '已接受' :
           status === 'rejected' ? '已拒绝' : status}
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
          <Button 
            type="link" 
            onClick={() => refreshRecommendation(record.id)}
            disabled={record.status === 'confirmed'}
          >
            刷新方案
          </Button>
          <Button 
            type="primary" 
            onClick={() => generateOrder(record.id)}
            disabled={record.status !== 'confirmed'}
          >
            生成订单
          </Button>
        </Space>
      )
    }
  ];

  const orderColumns = [
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
          status === 'pending_advisor' ? 'orange' :
          status === 'pending_risk' ? 'blue' :
          status === 'pending_compliance' ? 'purple' :
          status === 'approved' ? 'green' :
          status === 'rejected' ? 'red' : 'default'
        }>
          {status === 'pending_advisor' ? '待客户经理审批' :
           status === 'pending_risk' ? '待风控审批' :
           status === 'pending_compliance' ? '待合规审批' :
           status === 'approved' ? '已通过' :
           status === 'rejected' ? '已拒绝' : status}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }
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
      case 'clients':
        return renderClients();
      case 'products':
        return renderProducts();
      case 'recommendations':
        return renderRecommendations();
      case 'orders':
        return renderOrders();
      default:
        return <div>请从左侧菜单选择功能</div>;
    }
  };

  const renderDashboard = () => {
    // 获取待审批订单
    const pendingOrders = orders.filter(o => o.status === ORDER_STATUS.PENDING_ADVISOR);
    // 获取待处理推荐请求
    const pendingRequests = recommendationRequests.filter(r => r.status === 'pending');
    
    return (
      <div className="dashboard-content">
        <Title level={3}>工作台</Title>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="客户总数"
                value={clients.length}
                valueStyle={{ color: '#3f8600' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待处理推荐"
                value={recommendationRequests.filter(r => r.status === 'pending').length}
                valueStyle={{ color: '#1890ff' }}
                prefix={<FundOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待审批订单"
                value={orders.filter(o => o.status === ORDER_STATUS.PENDING_ADVISOR).length}
                valueStyle={{ color: '#faad14' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已批准订单"
                value={orders.filter(o => o.status === ORDER_STATUS.APPROVED).length}
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
                  <span>待审核订单</span>
                  {pendingOrders.length > 0 && (
                    <Tag color="orange">{pendingOrders.length}个待处理</Tag>
                  )}
                </div>
              }
            >
              <List
                dataSource={pendingOrders.slice(0, 5)}
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
                  <span>待处理推荐请求</span>
                  {pendingRequests.length > 0 && (
                    <Tag color="blue">{pendingRequests.length}个待处理</Tag>
                  )}
                </div>
              }
            >
              <List
                dataSource={pendingRequests.slice(0, 5)}
                renderItem={item => (
                  <List.Item actions={[
                    <Button size="small" type="primary" onClick={() => handleGenerateRecommendation(item)}>
                      生成推荐
                    </Button>
                  ]}>
                    <List.Item.Meta
                      title={item.clientName}
                      description={`投资金额: ¥${item.investmentAmount.toLocaleString()} | 风险等级: ${item.riskLevel}`}
                    />
                    <div>{moment(item.createTime).fromNow()}</div>
                  </List.Item>
                )}
                footer={
                  <div style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => setCurrentMenuKey('recommendations')}>查看全部推荐</Button>
                  </div>
                }
                locale={{ emptyText: '暂无待处理推荐请求' }}
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

  const renderClients = () => {
    return (
      <div className="clients-content">
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => {
            setEditingClient(null);
            clientForm.resetFields();
            setIsClientModalVisible(true);
          }}>
            新增客户
          </Button>
        </div>
        <Table
          columns={[
            { title: '客户姓名', dataIndex: 'name', key: 'name' },
            { title: '联系电话', dataIndex: 'phone', key: 'phone' },
            { 
              title: '风险等级', 
              dataIndex: 'riskLevel', 
              key: 'riskLevel',
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
              title: '下次KYC评估时间', 
              dataIndex: 'nextKycTime', 
              key: 'nextKycTime',
              render: (time) => {
                const kycDate = moment(time);
                const now = moment();
                const daysDiff = kycDate.diff(now, 'days');
                
                // 如果KYC时间已过期或剩余不到15天，显示提醒标记
                return (
                  <Space>
                    {time}
                    {daysDiff <= 0 ? (
                      <Badge status="error" text="已过期，需立即评估" />
                    ) : daysDiff <= 15 ? (
                      <Badge status="warning" text={`剩余${daysDiff}天`} />
                    ) : null}
                  </Space>
                );
              }
            },
            { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Space>
                  <Button type="primary" onClick={() => {
                    setEditingClient(record);
                    
                    // 将日期字符串转换为DatePicker需要的moment对象
                    clientForm.setFieldsValue({
                      ...record,
                      nextKycTime: record.nextKycTime ? moment(record.nextKycTime) : null
                    });
                    
                    setIsClientModalVisible(true);
                  }}>
                    编辑
                  </Button>
                  <Button onClick={() => handleGenerateRecommendation(record)}>
                    生成推荐
                  </Button>
                </Space>
              )
            }
          ]}
          dataSource={clients}
          rowKey="id"
        />
        <Modal
          title={editingClient ? '编辑客户' : '新增客户'}
          open={isClientModalVisible}
          onOk={handleClientSubmit}
          onCancel={() => setIsClientModalVisible(false)}
        >
          <Form form={clientForm} layout="vertical">
            <Form.Item
              name="name"
              label="客户姓名"
              rules={[{ required: true, message: '请输入客户姓名' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="riskLevel"
              label="风险等级"
              rules={[{ required: true, message: '请选择风险等级' }]}
            >
              <Select>
                <Option value="低">低</Option>
                <Option value="中等">中等</Option>
                <Option value="高">高</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="nextKycTime"
              label="下次KYC评估时间"
              rules={[{ required: true, message: '请选择下次KYC评估时间' }]}
              tooltip="设置客户下次KYC评估时间，KYC评估将由风控部门自动执行"
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
      </div>
    );
  };

  const viewRecommendation = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsRecommendDetailModalVisible(true);
  };

  const renderOrders = () => {
    // 获取最新的订单数据
    const latestOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    return (
      <div className="orders-content">
        <Title level={3}>订单审批</Title>
        <Alert
          message="订单审批说明"
          description={
            <div>
              <p>当前状态定义: PENDING_ADVISOR = '{ORDER_STATUS.PENDING_ADVISOR}'</p>
              <p>待审批订单数: {latestOrders.filter(o => o.status === ORDER_STATUS.PENDING_ADVISOR).length}</p>
              {latestOrders.length === 0 && <p>目前没有订单数据，请让客户接受推荐生成订单</p>}
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
                  {/* 客户经理审批按钮 */}
                  {record.status === ORDER_STATUS.PENDING_ADVISOR && (
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

    console.log('审批前的订单:', currentOrder);
    console.log('订单状态:', currentOrder.status);
    console.log('期望状态:', ORDER_STATUS.PENDING_ADVISOR);
    console.log('状态是否匹配:', currentOrder.status === ORDER_STATUS.PENDING_ADVISOR);

    // 验证订单状态是否为待客户经理审批
    if (currentOrder.status !== ORDER_STATUS.PENDING_ADVISOR) {
      message.error(`订单状态不正确，无法审批。当前状态: ${currentOrder.status}，期望状态: ${ORDER_STATUS.PENDING_ADVISOR}`);
      return;
    }

    // 更新订单状态为待风控审批
    const updatedOrders = latestOrders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: ORDER_STATUS.PENDING_RISK,
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
        console.log('更新后的订单:', updatedOrder);
        return updatedOrder;
      }
      return order;
    });

    // 保存到localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    message.success('订单已审批通过，等待风控审批');
    
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

    // 验证订单是否处于可拒绝的状态
    if (currentOrder.status !== ORDER_STATUS.PENDING_ADVISOR && 
        currentOrder.status !== ORDER_STATUS.PENDING_RISK && 
        currentOrder.status !== ORDER_STATUS.PENDING_COMPLIANCE) {
      message.error(`订单状态不正确，无法拒绝。当前状态: ${currentOrder.status}`);
      return;
    }

    // 获取当前用户部门
    let department = 'advisor';
    if (currentOrder.status === ORDER_STATUS.PENDING_RISK) {
      department = 'risk';
    } else if (currentOrder.status === ORDER_STATUS.PENDING_COMPLIANCE) {
      department = 'compliance';
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
              approver: department === 'advisor' ? user.username : 
                        department === 'risk' ? '风控经理' : '合规经理',
              department: department,
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
    message.success('订单已拒绝');
    
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
        selectedOrder && selectedOrder.status === ORDER_STATUS.PENDING_ADVISOR && (
          <Button key="approve" type="primary" onClick={() => {
            handleApproveOrder(selectedOrder.id);
            setIsOrderDetailModalVisible(false);
          }}>
            审批通过
          </Button>
        ),
        selectedOrder && selectedOrder.status === ORDER_STATUS.PENDING_ADVISOR && (
          <Button key="reject" danger onClick={() => {
            handleRejectOrder(selectedOrder.id);
            setIsOrderDetailModalVisible(false);
          }}>
            拒绝
          </Button>
        )
      ].filter(Boolean)}
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

          <Card title="审批流程" style={{ marginBottom: 16 }}>
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
                    selectedOrder.status === ORDER_STATUS.REJECTED && selectedOrder.approvalHistory?.some(h => h.department === 'advisor' && h.action === 'reject') ? 'red' : 'default'
                  }>
                    {selectedOrder.status === ORDER_STATUS.PENDING_ADVISOR ? '处理中' :
                    selectedOrder.status === ORDER_STATUS.PENDING_RISK || 
                    selectedOrder.status === ORDER_STATUS.PENDING_COMPLIANCE || 
                    selectedOrder.status === ORDER_STATUS.APPROVED ? '已通过' :
                    selectedOrder.status === ORDER_STATUS.REJECTED && selectedOrder.approvalHistory?.some(h => h.department === 'advisor' && h.action === 'reject') ? '已拒绝' : '等待中'}
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
  );

  const renderProducts = () => {
    return (
      <div className="products-content">
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => {
            setEditingProduct(null);
            productForm.resetFields();
            setIsProductModalVisible(true);
          }}>
            新增产品
          </Button>
        </div>
        <Table
          columns={[
            { title: '产品名称', dataIndex: 'name', key: 'name' },
            { title: '产品代码', dataIndex: 'code', key: 'code' },
            { 
              title: '价格', 
              dataIndex: 'price', 
              key: 'price',
              render: price => `¥${price.toFixed(2)}`
            },
            { 
              title: '风险等级', 
              dataIndex: 'riskLevel', 
              key: 'riskLevel',
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
              title: '预期收益', 
              dataIndex: 'expectedReturn', 
              key: 'expectedReturn',
              render: return_ => `${return_}%`
            },
            { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Button type="primary" onClick={() => {
                  setEditingProduct(record);
                  productForm.setFieldsValue(record);
                  setIsProductModalVisible(true);
                }}>
                  编辑
                </Button>
              )
            }
          ]}
          dataSource={products}
          rowKey="id"
        />
        <Modal
          title={editingProduct ? '编辑产品' : '新增产品'}
          open={isProductModalVisible}
          onOk={handleProductSubmit}
          onCancel={() => setIsProductModalVisible(false)}
        >
          <Form form={productForm} layout="vertical">
            <Form.Item
              name="name"
              label="产品名称"
              rules={[{ required: true, message: '请输入产品名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="code"
              label="产品代码"
              rules={[{ required: true, message: '请输入产品代码' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="价格"
              rules={[{ required: true, message: '请输入价格' }]}
            >
              <Input type="number" step="0.01" />
            </Form.Item>
            <Form.Item
              name="riskLevel"
              label="风险等级"
              rules={[{ required: true, message: '请选择风险等级' }]}
            >
              <Select>
                <Option value="低">低</Option>
                <Option value="中等">中等</Option>
                <Option value="高">高</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="expectedReturn"
              label="预期收益"
              rules={[{ required: true, message: '请输入预期收益' }]}
            >
              <Input type="number" step="0.1" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const handleClientSubmit = () => {
    clientForm.validateFields().then(values => {
      // 处理日期时间格式
      const formattedValues = {
        ...values,
        nextKycTime: values.nextKycTime ? values.nextKycTime.format('YYYY-MM-DD HH:mm:ss') : moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss')
      };

      const updatedClients = [...clients];
      if (editingClient) {
        const index = updatedClients.findIndex(c => c.id === editingClient.id);
        
        // 如果风险等级有变更，添加到KYC历史记录
        if (editingClient.riskLevel !== formattedValues.riskLevel) {
          const kycRecord = {
            evaluator: user.username,
            oldRiskLevel: editingClient.riskLevel,
            newRiskLevel: formattedValues.riskLevel,
            evaluationTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            notes: '客户经理手动更新风险等级'
          };
          
          if (!editingClient.kycHistory) {
            editingClient.kycHistory = [];
          }
          
          updatedClients[index] = { 
            ...editingClient, 
            ...formattedValues,
            kycHistory: [...editingClient.kycHistory, kycRecord]
          };
        } else {
          updatedClients[index] = { ...editingClient, ...formattedValues };
        }
      } else {
        updatedClients.push({
          id: Date.now(),
          ...formattedValues,
          createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          kycHistory: []
        });
      }
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      setClients(updatedClients);
      setIsClientModalVisible(false);
      message.success(editingClient ? '客户信息已更新' : '新客户已添加');
    });
  };

  const handleProductSubmit = () => {
    productForm.validateFields().then(values => {
      const updatedProducts = [...products];
      if (editingProduct) {
        const index = updatedProducts.findIndex(p => p.id === editingProduct.id);
        updatedProducts[index] = { ...editingProduct, ...values };
      } else {
        updatedProducts.push({
          id: Date.now(),
          ...values,
          createTime: moment().format('YYYY-MM-DD HH:mm:ss')
        });
      }
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setIsProductModalVisible(false);
      message.success(editingProduct ? '产品信息已更新' : '新产品已添加');
    });
  };

  // 添加初始化测试数据功能
  const initTestData = () => {
    // 初始化客户数据
    const testClients = [
      { 
        id: 1, 
        name: '张三', 
        phone: '13800138000', 
        riskLevel: '中等',
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        nextKycTime: '2024-07-20 00:00:00',
        kycHistory: [
          {
            evaluator: '风控专员',
            oldRiskLevel: '低',
            newRiskLevel: '中等',
            evaluationTime: '2024-01-20 10:00:00',
            notes: '客户投资偏好变化，风险承受能力提升'
          }
        ]
      },
      { 
        id: 2, 
        name: '李四', 
        phone: '13800138001', 
        riskLevel: '低',
        createTime: '2024-03-19 14:30:00',
        nextKycTime: '2024-06-19 00:00:00',
        kycHistory: []
      },
      { 
        id: 3, 
        name: '王五', 
        phone: '13800138002', 
        riskLevel: '高',
        createTime: '2024-03-18 09:15:00',
        nextKycTime: '2024-07-18 00:00:00',
        kycHistory: [
          {
            evaluator: '风控专员',
            oldRiskLevel: '中等',
            newRiskLevel: '高',
            evaluationTime: '2024-02-18 09:15:00',
            notes: '客户确认愿意接受较高风险以获取更高收益'
          }
        ]
      }
    ];

    // 初始化产品数据
    const testProducts = [
      { 
        id: 1, 
        name: '股票A', 
        code: '600001', 
        price: 10.5, 
        riskLevel: '高', 
        expectedReturn: 15,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      { 
        id: 2, 
        name: '债券B', 
        code: '100001', 
        price: 100, 
        riskLevel: '低', 
        expectedReturn: 5,
        createTime: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      },
      { 
        id: 3, 
        name: '基金C', 
        code: '200001', 
        price: 1.2, 
        riskLevel: '中等', 
        expectedReturn: 8,
        createTime: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      },
      { 
        id: 4, 
        name: '股票D', 
        code: '600002', 
        price: 15.8, 
        riskLevel: '高', 
        expectedReturn: 18,
        createTime: moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss')
      },
      { 
        id: 5, 
        name: '债券E', 
        code: '100002', 
        price: 95, 
        riskLevel: '低', 
        expectedReturn: 4,
        createTime: moment().subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss')
      },
      { 
        id: 6, 
        name: '基金F', 
        code: '200002', 
        price: 1.5, 
        riskLevel: '中等', 
        expectedReturn: 10,
        createTime: moment().subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    ];

    // 初始化推荐请求
    const testRequests = [
      {
        id: 1,
        clientId: 1,
        clientName: '张三',
        riskLevel: '中等',
        investmentAmount: 50000,
        investmentPeriod: 'medium',
        status: 'pending',
        createTime: moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        notes: '希望获得稳健的投资组合'
      },
      {
        id: 2,
        clientId: 2,
        clientName: '李四',
        riskLevel: '低',
        investmentAmount: 100000,
        investmentPeriod: 'long',
        status: 'pending',
        createTime: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        notes: '长期投资，规避风险'
      }
    ];

    // 初始化推荐
    const testRecommendations = [
      {
        id: 101,
        requestId: 1,
        clientId: 1,
        clientName: '张三',
        advisorId: 1,
        advisorName: '客户经理',
        products: [
          { 
            id: 3, 
            name: '基金C', 
            code: '200001', 
            price: 1.2, 
            quantity: 10000,
            riskLevel: '中等', 
            expectedReturn: 8
          },
          { 
            id: 2, 
            name: '债券B', 
            code: '100001', 
            price: 100, 
            quantity: 400,
            riskLevel: '低', 
            expectedReturn: 5
          }
        ],
        totalAmount: 52000,
        investmentPeriod: 'medium',
        createTime: moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        status: 'accepted'
      }
    ];

    // 初始化订单
    const testOrders = [
      {
        id: `ORDER${Date.now()}`,
        clientId: 1,
        clientName: '张三',
        products: [
          { 
            id: 3, 
            name: '基金C', 
            code: '200001', 
            price: 1.2, 
            quantity: 10000,
            riskLevel: '中等', 
            expectedReturn: 8
          },
          { 
            id: 2, 
            name: '债券B', 
            code: '100001', 
            price: 100, 
            quantity: 400,
            riskLevel: '低', 
            expectedReturn: 5
          }
        ],
        totalAmount: 52000,
        status: ORDER_STATUS.PENDING_ADVISOR,
        createTime: moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        approvalHistory: []
      },
      {
        id: `ORDER${Date.now()-1000}`,
        clientId: 2,
        clientName: '李四',
        products: [
          { 
            id: 5, 
            name: '债券E', 
            code: '100002', 
            price: 95, 
            quantity: 800,
            riskLevel: '低', 
            expectedReturn: 4
          }
        ],
        totalAmount: 76000,
        status: ORDER_STATUS.PENDING_ADVISOR,
        createTime: moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        approvalHistory: []
      },
      {
        id: `ORDER${Date.now()-2000}`,
        clientId: 3,
        clientName: '王五',
        products: [
          { 
            id: 1, 
            name: '股票A', 
            code: '600001', 
            price: 10.5, 
            quantity: 5000,
            riskLevel: '高', 
            expectedReturn: 15
          },
          { 
            id: 4, 
            name: '股票D', 
            code: '600002', 
            price: 15.8, 
            quantity: 3000,
            riskLevel: '高', 
            expectedReturn: 18
          }
        ],
        totalAmount: 100000,
        status: ORDER_STATUS.PENDING_RISK,
        createTime: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        approvalHistory: [
          {
            approver: '客户经理',
            department: 'advisor',
            action: 'approve',
            time: moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
          }
        ]
      }
    ];

    // 保存到localStorage
    localStorage.setItem('clients', JSON.stringify(testClients));
    localStorage.setItem('products', JSON.stringify(testProducts));
    localStorage.setItem('recommendationRequests', JSON.stringify(testRequests));
    localStorage.setItem('recommendations', JSON.stringify(testRecommendations));
    localStorage.setItem('orders', JSON.stringify(testOrders));
    
    // 刷新数据
    fetchData();
    
    message.success('测试数据已初始化');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text strong style={{ color: '#fff' }}>客户经理工作台</Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentMenuKey]}
          style={{ height: '100%', borderRight: 0 }}
          onClick={e => setCurrentMenuKey(e.key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            工作台
          </Menu.Item>
          <Menu.Item key="clients" icon={<TeamOutlined />}>
            客户管理
          </Menu.Item>
          <Menu.Item key="products" icon={<AppstoreOutlined />}>
            产品管理
          </Menu.Item>
          <Menu.Item key="recommendations" icon={<FundOutlined />}>
            推荐管理
          </Menu.Item>
          <Menu.Item key="orders" icon={<FileTextOutlined />}>
            订单审批
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Header style={{ background: '#fff', padding: 0, paddingLeft: 16, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {currentMenuKey === 'dashboard' ? '工作台' :
             currentMenuKey === 'clients' ? '客户管理' :
             currentMenuKey === 'products' ? '产品管理' :
             currentMenuKey === 'recommendations' ? '推荐管理' :
             currentMenuKey === 'orders' ? '订单审批' : ''}
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

export default AdvisorDashboard; 