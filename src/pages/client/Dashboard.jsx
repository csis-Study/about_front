import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Table, List, Tag, Typography, Button, Statistic, Spin, Alert, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { DashboardOutlined, FundOutlined, TransactionOutlined, SafetyOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';
import { client, portfolio, market, risk, trade } from '../../api';
import moment from 'moment';
import { mockClients, mockPortfolios, mockMarketData, mockRiskData, mockTransactions } from '../../mock/mockData';
import * as Recharts from 'recharts';

const { Title } = Typography;
const { Header, Content, Sider } = Layout;

const ClientDashboard = () => {
  // 使用本地状态而不是Redux
  // const auth = useSelector((state) => state.auth);
  // const user = auth?.user || { username: '访客用户', role: 'client' };
  const [user] = useState({ username: '访客用户', role: 'client' });
  
  const [clientData, setClientData] = useState(null);
  const [portfolioData, setPortfolioData] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentMenuKey, setCurrentMenuKey] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [recommendationModalVisible, setRecommendationModalVisible] = useState(false);
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [subscribeModalVisible, setSubscribeModalVisible] = useState(false);
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyShares, setBuyShares] = useState(1000);
  const [sellShares, setSellShares] = useState(1000);
  const [subscribeAmount, setSubscribeAmount] = useState(10000);
  const [redeemAmount, setRedeemAmount] = useState(10000);
  const [transactionDetailVisible, setTransactionDetailVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // 生成随机净值变化
  const generateNetValueChange = (currentNetValue) => {
    // 生成-0.5%到+0.5%之间的随机变化
    const changePercent = (Math.random() - 0.5) * 0.01;
    return currentNetValue * (1 + changePercent);
  };

  // 更新产品净值
  const updateProductNetValue = () => {
    setPortfolioData(prevData => {
      const updatedData = prevData.map(item => {
        const newNetValue = generateNetValueChange(item.netValue);
        const oldMarketValue = item.marketValue;
        const newMarketValue = item.shares * newNetValue;
        const marketValueChange = newMarketValue - oldMarketValue;
        
        return {
          ...item,
          netValue: newNetValue,
          marketValue: newMarketValue,
          dailyChange: marketValueChange,
          dailyChangePercent: (marketValueChange / oldMarketValue * 100)
        };
      });

      // 计算总资产和总变动
      const totalValue = updatedData.reduce((sum, item) => sum + (item.marketValue || 0), 0);
      const totalChange = updatedData.reduce((sum, item) => sum + (item.dailyChange || 0), 0);
      const totalChangePercent = totalValue ? (totalChange / totalValue * 100) : 0;

      // 更新客户数据
      setClientData(prev => ({
        ...prev,
        totalAssets: totalValue,
        dailyChange: totalChange,
        dailyChangePercent: totalChangePercent
      }));

      return updatedData;
    });
  };

  // 设置定时更新净值
  useEffect(() => {
    // 每30秒更新一次净值
    const timer = setInterval(updateProductNetValue, 30000);
    
    // 组件卸载时清除定时器
    return () => clearInterval(timer);
  }, []);

  // 初始化数据
  useEffect(() => {
    setLoading(true);
    try {
      const clientId = 1;
      const clientInfo = mockClients.find(c => c.id === clientId) || {};
      setClientData(clientInfo);
      setMarketData(generateMarketData());
      setRiskData(generateRiskData());
      setTransactions(generateTransactions());
      setPortfolioData(initializePortfolioData());
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化投资组合数据
  const initializePortfolioData = () => {
    const storedPortfolio = localStorage.getItem('clientPortfolio');
    if (storedPortfolio) {
      return JSON.parse(storedPortfolio);
    }
    
    // 如果没有存储的数据，使用初始数据
    const initialPortfolio = [
      {
        productCode: 'F001',
        productName: '稳健债券基金',
        productType: '基金',
        riskLevel: '低',
        shares: 10000,
        netValue: 1.0500,
        marketValue: 10500,
        dailyChange: 0,
        dailyChangePercent: 0
      },
      {
        productCode: 'P001',
        productName: '安心收益理财',
        productType: '理财产品',
        riskLevel: '低',
        shares: 50000,
        netValue: 1.0200,
        marketValue: 51000,
        dailyChange: 0,
        dailyChangePercent: 0
      },
      {
        productCode: 'S003',
        productName: '特斯拉',
        productType: '股票',
        riskLevel: '高',
        shares: 100,
        netValue: 1.50,
        marketValue: 150,
        dailyChange: 0,
        dailyChangePercent: 0
      },
      {
        productCode: 'F003',
        productName: '新兴市场基金',
        productType: '基金',
        riskLevel: '中',
        shares: 8000,
        netValue: 1.1500,
        marketValue: 9200,
        dailyChange: 0,
        dailyChangePercent: 0
      }
    ];
    
    localStorage.setItem('clientPortfolio', JSON.stringify(initialPortfolio));
    return initialPortfolio;
  };

  // 更新投资组合数据
  const updatePortfolioData = (productCode, newShares, operation) => {
    setPortfolioData(prevData => {
      const updatedPortfolio = prevData.map(item => {
        if (item.productCode === productCode) {
          const oldShares = item.shares;
          const newMarketValue = newShares * item.netValue;
          const oldMarketValue = oldShares * item.netValue;
          const marketValueChange = newMarketValue - oldMarketValue;
          
          return {
            ...item,
            shares: newShares,
            marketValue: newMarketValue,
            dailyChange: marketValueChange,
            dailyChangePercent: (marketValueChange / oldMarketValue * 100)
          };
        }
        return item;
      });
      
      // 计算总资产和总变动
      const totalValue = updatedPortfolio.reduce((sum, item) => sum + (item.marketValue || 0), 0);
      const totalChange = updatedPortfolio.reduce((sum, item) => sum + (item.dailyChange || 0), 0);
      const totalChangePercent = totalValue ? (totalChange / totalValue * 100) : 0;

      // 更新客户数据
      setClientData(prev => ({
        ...prev,
        totalAssets: totalValue,
        dailyChange: totalChange,
        dailyChangePercent: totalChangePercent
      }));
      
      localStorage.setItem('clientPortfolio', JSON.stringify(updatedPortfolio));
      return updatedPortfolio;
    });
  };

  // 生成随机市场数据
  const generateMarketData = () => {
    const today = new Date();
    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        indices: [
          {
            name: '上证指数',
            value: 3000 + Math.random() * 200
          },
          {
            name: '深证成指',
            value: 10000 + Math.random() * 500
          },
          {
            name: '创业板指',
            value: 2000 + Math.random() * 100
          }
        ]
      });
    }
    return {
      indexTrends: data,
      news: [
        {
          title: '央行发布最新货币政策报告',
          date: '2024-04-10',
          content: '央行表示将继续实施稳健的货币政策，保持流动性合理充裕。'
        },
        {
          title: 'A股市场震荡上行',
          date: '2024-04-09',
          content: '市场情绪回暖，科技股领涨，成交量明显放大。'
        }
      ],
      calendar: [
        {
          event: 'CPI数据公布',
          date: '2024-04-11',
          impact: '高'
        },
        {
          event: '美联储议息会议',
          date: '2024-04-12',
          impact: '中'
        }
      ]
    };
  };

  // 生成随机风险数据
  const generateRiskData = () => {
    const today = new Date();
    const history = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      history.push({
        date: date.toISOString().split('T')[0],
        score: 60 + Math.random() * 30
      });
    }
    return {
      riskScore: 75 + Math.random() * 10,
      riskLevel: Math.random() > 0.5 ? '高' : '中',
      riskMetrics: {
        sharpeRatio: 1.2 + Math.random() * 0.5,
        maxDrawdown: 15 + Math.random() * 5,
        var: 10 + Math.random() * 5
      },
      riskScoreHistory: history,
      sectorExposure: [
        { sector: '科技', percentage: 30 + Math.random() * 10, riskLevel: '高' },
        { sector: '金融', percentage: 20 + Math.random() * 10, riskLevel: '中' },
        { sector: '消费', percentage: 15 + Math.random() * 10, riskLevel: '中' },
        { sector: '医药', percentage: 10 + Math.random() * 10, riskLevel: '高' },
        { sector: '其他', percentage: 25 + Math.random() * 10, riskLevel: '低' }
      ],
      stressTestResults: [
        {
          scenario: '市场大跌',
          expectedLoss: 15 + Math.random() * 5,
          impact: '中等',
          suggestedAction: '适当减仓，增加防御性资产'
        },
        {
          scenario: '利率上升',
          expectedLoss: 10 + Math.random() * 5,
          impact: '低',
          suggestedAction: '调整债券久期'
        }
      ],
      recommendations: {
        alert: '您的投资组合中科技行业占比过高，建议适当分散投资。',
        suggestions: [
          '适当减持高风险资产，尤其是科技类股票',
          '考虑增加固定收益类产品占比',
          '建议保持至少20%的现金仓位，应对市场波动',
          '定期检视投资组合，保持分散化投资策略'
        ]
      }
    };
  };

  // 生成随机交易数据
  const generateTransactions = () => {
    const types = ['申购', '赎回'];
    const statuses = ['已执行', '审批中', '已拒绝', '待审批'];
    const products = [
      { productName: '稳健债券基金', productCode: 'F001' },
      { productName: '安心收益理财', productCode: 'P001' },
      { productName: '特斯拉', productCode: 'S003' },
      { productName: '新兴市场基金', productCode: 'F003' }
    ];
    
    const transactions = [];
    for (let i = 0; i < 20; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = 10000 + Math.random() * 90000;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      transactions.push({
        tradeId: `TR${Math.random().toString(36).substr(2, 9)}`,
        productItem: product,
        type,
        amount,
        status,
        createTime: date.toISOString(),
        updateTime: new Date(date.getTime() + Math.random() * 86400000).toISOString()
      });
    }
    return transactions;
  };

  // 生成资产配置的饼图数据
  const generateAssetAllocationData = () => {
    if (!portfolioData || portfolioData.length === 0) return [];
    
    // 按产品类型分组
    const groupedByType = portfolioData.reduce((acc, item) => {
      const type = item.productType || '其他';
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += item.marketValue || 0;
      return acc;
    }, {});
    
    // 转换为饼图数据格式
    return Object.keys(groupedByType).map(type => ({
      name: type,
      value: groupedByType[type],
    }));
  };

  // 生成风险等级分布的饼图数据
  const generateRiskDistributionData = () => {
    if (!portfolioData || portfolioData.length === 0) return [];
    
    // 按风险等级分组
    const groupedByRisk = portfolioData.reduce((acc, item) => {
      const riskLevel = item.riskLevel || '未知';
      if (!acc[riskLevel]) {
        acc[riskLevel] = 0;
      }
      acc[riskLevel] += item.marketValue || 0;
      return acc;
    }, {});
    
    // 转换为饼图数据格式
    return Object.keys(groupedByRisk).map(risk => ({
      name: risk,
      value: groupedByRisk[risk],
    }));
  };

  // 生成风险评分历史的折线图数据
  const generateRiskScoreHistoryData = () => {
    if (!riskData || !riskData.riskScoreHistory) return [];
    return riskData.riskScoreHistory.map(item => ({
      date: item.date,
      score: item.score
    }));
  };

  // 生成市场指数趋势图数据
  const generateMarketIndexData = () => {
    if (!marketData || !marketData.indexTrends) return [];
    return marketData.indexTrends.map(item => ({
      date: item.date,
      上证指数: item.indices.find(idx => idx.name === '上证指数')?.value || 0,
      深证成指: item.indices.find(idx => idx.name === '深证成指')?.value || 0,
      创业板指: item.indices.find(idx => idx.name === '创业板指')?.value || 0,
    }));
  };

  // 定义投资组合表格列
  const portfolioColumns = [
    {
      title: '产品代码',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '持有份额',
      dataIndex: 'shares',
      key: 'shares',
      render: (text) => text ? text.toFixed(2) : '0.00',
    },
    {
      title: '最新净值',
      dataIndex: 'netValue',
      key: 'netValue',
      render: (text) => text ? text.toFixed(4) : '0.0000',
    },
    {
      title: '市值',
      dataIndex: 'marketValue',
      key: 'marketValue',
      render: (text) => text ? text.toFixed(2) : '0.00',
    },
    {
      title: '日变动额',
      dataIndex: 'dailyChange',
      key: 'dailyChange',
      render: (text) => (
        <span style={{ color: text >= 0 ? '#3f8600' : '#cf1322' }}>
          {text ? text.toFixed(2) : '0.00'}
        </span>
      ),
    },
    {
      title: '日变动率',
      dataIndex: 'dailyChangePercent',
      key: 'dailyChangePercent',
      render: (text) => (
        <span style={{ color: text >= 0 ? '#3f8600' : '#cf1322' }}>
          {text ? text.toFixed(2) : '0.00'}%
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="link" size="small" onClick={() => handleBuy(record)}>买入</Button>
          <Button type="link" size="small" onClick={() => handleSell(record)}>卖出</Button>
          <Button type="link" size="small" onClick={() => handleSubscribe(record)}>申购</Button>
          <Button type="link" size="small" onClick={() => handleRedeem(record)}>赎回</Button>
        </span>
      ),
    }
  ];

  // 处理买入操作
  const handleBuy = (record) => {
    setSelectedProduct(record);
    setBuyModalVisible(true);
  };

  // 处理卖出操作
  const handleSell = (record) => {
    setSelectedProduct(record);
    setSellModalVisible(true);
  };

  // 处理申购操作
  const handleSubscribe = (record) => {
    setSelectedProduct(record);
    setSubscribeModalVisible(true);
  };

  // 处理赎回操作
  const handleRedeem = (record) => {
    setSelectedProduct(record);
    setRedeemModalVisible(true);
  };

  // 处理查看交易详情
  const handleViewTransactionDetail = (record) => {
    setSelectedTransaction(record);
    setTransactionDetailVisible(true);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '投资概览'
    },
    {
      key: 'portfolio',
      icon: <FundOutlined />,
      label: '投资组合'
    },
    {
      key: 'transactions',
      icon: <TransactionOutlined />,
      label: '交易记录'
    },
    {
      key: 'risk',
      icon: <SafetyOutlined />,
      label: '风险评估'
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
        return renderDashboardPage();
      case 'portfolio':
        return renderPortfolioPage();
      case 'transactions':
        return renderTransactionPage();
      case 'risk':
        return renderRiskPage();
      default:
        return renderDashboardPage();
    }
  };

  // 渲染仪表盘首页
  const renderDashboardPage = () => {
    const marketIndexData = generateMarketIndexData();
    
    return (
      <>
        <Title level={2}>投资概览</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic 
                title="总账户资产" 
                value={clientData?.totalAssets || 0} 
                precision={2} 
                suffix="元" 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="日收益" 
                value={portfolioData?.dailyChange || 0} 
                precision={2} 
                valueStyle={{ color: (portfolioData?.dailyChange || 0) >= 0 ? '#3f8600' : '#cf1322' }}
                suffix="元" 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="日收益率" 
                value={portfolioData?.dailyChangePercent || 0} 
                precision={2} 
                valueStyle={{ color: (portfolioData?.dailyChangePercent || 0) >= 0 ? '#3f8600' : '#cf1322' }}
                suffix="%" 
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="关键市场指数">
              <Recharts.ResponsiveContainer width="100%" height={300}>
                <Recharts.AreaChart data={marketIndexData}>
                  <Recharts.CartesianGrid strokeDasharray="3 3" />
                  <Recharts.XAxis dataKey="date" />
                  <Recharts.YAxis />
                  <Recharts.Tooltip />
                  <Recharts.Legend />
                  <Recharts.Area type="monotone" dataKey="上证指数" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Recharts.Area type="monotone" dataKey="深证成指" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  <Recharts.Area type="monotone" dataKey="创业板指" stackId="3" stroke="#ffc658" fill="#ffc658" />
                </Recharts.AreaChart>
              </Recharts.ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="账户信息">
              <List
                size="small"
                bordered={false}
                dataSource={[
                  { label: '姓名', value: clientData?.name || '未知' },
                  { label: '风险等级', value: clientData?.riskLevel || '未知' },
                  { label: '上次评估日期', value: clientData?.kycCheckDate || '未知' },
                  { label: '投资偏好', value: clientData?.investmentPreference || '未知' },
                  { label: '客户经理', value: clientData?.relationshipManagerName || '未知' },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <span style={{ fontWeight: 'bold', marginRight: 8 }}>{item.label}:</span>
                    {item.value}
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="市场资讯">
              <List
                size="small"
                dataSource={marketData?.news || []}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{item.date}</div>
                      <div>{item.content}</div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="财经日历">
              <List
                size="small"
                dataSource={marketData?.calendar || []}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.event}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{item.date}</div>
                      </div>
                      <Tag color={
                        item.impact === '高' ? 'red' : 
                        item.impact === '中' ? 'orange' : 'green'
                      }>
                        {item.impact}影响
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        
        <Card title="近期交易" style={{ marginTop: 16 }}>
          <Table 
            dataSource={transactions.slice(0, 5)} 
            rowKey="tradeId"
            pagination={false}
            columns={[
              {
                title: '交易日期',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text) => moment(text).format('YYYY-MM-DD'),
              },
              {
                title: '产品名称',
                dataIndex: 'productItem',
                key: 'productName',
                render: (text) => text?.productName || '未知产品',
              },
              {
                title: '交易类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => (
                  <Tag color={text === '申购' ? 'blue' : 'orange'}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (text) => `¥${text.toFixed(2)}`,
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                  let color = 'default';
                  if (text === '已执行') color = 'green';
                  else if (text === '审批中') color = 'blue';
                  else if (text === '已拒绝') color = 'red';
                  else if (text === '待审批') color = 'orange';
                  
                  return <Tag color={color}>{text}</Tag>;
                },
              },
            ]}
          />
        </Card>
      </>
    );
  };

  // 渲染组合页面
  const renderPortfolioPage = () => {
    const assetAllocationData = generateAssetAllocationData();
    const riskDistributionData = generateRiskDistributionData();
    
    // 计算总资产和总变动
    const totalValue = portfolioData.reduce((sum, item) => sum + (item.marketValue || 0), 0);
    const totalChange = portfolioData.reduce((sum, item) => sum + (item.dailyChange || 0), 0);
    const totalChangePercent = totalValue ? (totalChange / totalValue * 100) : 0;
    
    // 饼图自定义颜色
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    
    return (
      <>
        <Title level={2}>我的投资组合</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic title="总资产" value={totalValue} precision={2} suffix="元" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="每日变动金额" 
                value={totalChange} 
                precision={2} 
                valueStyle={{ color: totalChange >= 0 ? '#3f8600' : '#cf1322' }}
                suffix="元" 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="每日变动比例" 
                value={totalChangePercent} 
                precision={2} 
                valueStyle={{ color: totalChangePercent >= 0 ? '#3f8600' : '#cf1322' }}
                suffix="%" 
              />
            </Card>
          </Col>
        </Row>
        
        <Card title="持仓明细" style={{ marginTop: 16 }}>
          <Table 
            dataSource={portfolioData} 
            rowKey="productCode"
            pagination={false}
            columns={portfolioColumns}
          />
        </Card>
        
        <Card title="资产配置分析" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Card type="inner" title="产品类型分布">
                <Recharts.ResponsiveContainer width="100%" height={300}>
                  <Recharts.PieChart>
                    <Recharts.Pie
                      data={assetAllocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Recharts.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Recharts.Pie>
                    <Recharts.Tooltip formatter={(value) => `¥${value.toFixed(2)}`} />
                    <Recharts.Legend />
                  </Recharts.PieChart>
                </Recharts.ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card type="inner" title="风险等级分布">
                <Recharts.ResponsiveContainer width="100%" height={300}>
                  <Recharts.PieChart>
                    <Recharts.Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Recharts.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Recharts.Pie>
                    <Recharts.Tooltip formatter={(value) => `¥${value.toFixed(2)}`} />
                    <Recharts.Legend />
                  </Recharts.PieChart>
                </Recharts.ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Card>
      </>
    );
  };

  // 渲染风险评估页面
  const renderRiskPage = () => {
    const riskScoreHistoryData = generateRiskScoreHistoryData();
    
    return (
      <>
        <Title level={2}>风险评估</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="风险评分" value={riskData?.riskScore || 0} suffix={`/ 100`} />
              <div style={{ marginTop: 8 }}>
                <Tag color={riskData?.riskLevel === '高' ? 'red' : riskData?.riskLevel === '中' ? 'orange' : 'green'}>
                  {riskData?.riskLevel || '低'}风险
                </Tag>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="夏普比率" value={riskData?.riskMetrics?.sharpeRatio || 0} precision={2} />
              <div style={{ marginTop: 8 }}>
                <Tag color={(riskData?.riskMetrics?.sharpeRatio || 0) > 1 ? 'green' : 'orange'}>
                  {(riskData?.riskMetrics?.sharpeRatio || 0) > 1 ? '良好' : '一般'}
                </Tag>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="最大回撤" value={riskData?.riskMetrics?.maxDrawdown || 0} precision={2} suffix="%" />
              <div style={{ marginTop: 8 }}>
                <Tag color={(riskData?.riskMetrics?.maxDrawdown || 0) < 20 ? 'green' : 'red'}>
                  {(riskData?.riskMetrics?.maxDrawdown || 0) < 20 ? '可控' : '较高'}
                </Tag>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="VaR (95%)" value={riskData?.riskMetrics?.var || 0} precision={2} suffix="%" />
              <div style={{ marginTop: 8 }}>
                <Tag color={(riskData?.riskMetrics?.var || 0) < 15 ? 'green' : 'red'}>
                  {(riskData?.riskMetrics?.var || 0) < 15 ? '可控' : '较高'}
                </Tag>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Card title="风险评分历史" style={{ marginTop: 16 }}>
          <Recharts.ResponsiveContainer width="100%" height={300}>
            <Recharts.LineChart data={riskScoreHistoryData}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="date" />
              <Recharts.YAxis domain={[0, 100]} />
              <Recharts.Tooltip />
              <Recharts.Legend />
              <Recharts.Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
            </Recharts.LineChart>
          </Recharts.ResponsiveContainer>
        </Card>
        
        <Card title="行业风险暴露" style={{ marginTop: 16 }}>
          <Table 
            dataSource={riskData?.sectorExposure || []} 
            rowKey="sector"
            pagination={false}
            columns={[
              {
                title: '行业',
                dataIndex: 'sector',
                key: 'sector',
              },
              {
                title: '比例',
                dataIndex: 'percentage',
                key: 'percentage',
                render: (text) => `${text}%`,
              },
              {
                title: '风险等级',
                dataIndex: 'riskLevel',
                key: 'riskLevel',
                render: (text) => (
                  <Tag color={text === '高' ? 'red' : text === '中' ? 'orange' : 'green'}>
                    {text}
                  </Tag>
                ),
              },
            ]}
          />
        </Card>
        
        <Card title="压力测试结果" style={{ marginTop: 16 }}>
          <Table 
            dataSource={riskData?.stressTestResults || []} 
            rowKey="scenario"
            pagination={false}
            columns={[
              {
                title: '情景',
                dataIndex: 'scenario',
                key: 'scenario',
              },
              {
                title: '预期亏损',
                dataIndex: 'expectedLoss',
                key: 'expectedLoss',
                render: (text) => `${text}%`,
              },
              {
                title: '影响评级',
                dataIndex: 'impact',
                key: 'impact',
                render: (text) => (
                  <Tag color={text === '严重' ? 'red' : text === '中等' ? 'orange' : 'green'}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: '建议行动',
                dataIndex: 'suggestedAction',
                key: 'suggestedAction',
              },
            ]}
          />
        </Card>
        
        <Card title="风险提示与建议" style={{ marginTop: 16 }}>
          <Alert
            message="风险集中提示"
            description={riskData?.recommendations?.alert || "您的投资组合中科技行业占比过高，建议适当分散投资。"}
            type="warning"
            showIcon
          />
          <div style={{ marginTop: 16 }}>
            <h4>投资建议：</h4>
            <ul>
              {(riskData?.recommendations?.suggestions || [
                "适当减持高风险资产，尤其是科技类股票",
                "考虑增加固定收益类产品占比",
                "建议保持至少20%的现金仓位，应对市场波动",
                "定期检视投资组合，保持分散化投资策略"
              ]).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </Card>
      </>
    );
  };

  // 渲染交易记录页面
  const renderTransactionPage = () => {
    return (
      <>
        <Title level={2}>交易记录</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Card>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Select
                    style={{ width: 200, marginRight: 8 }}
                    placeholder="请选择产品"
                    onChange={(value) => {
                      const product = portfolioData.find(p => p.productCode === value);
                      setSelectedProduct(product);
                    }}
                  >
                    {portfolioData.map(product => (
                      <Select.Option key={product.productCode} value={product.productCode}>
                        {product.productName}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => {
                    if (selectedProduct) {
                      setSubscribeModalVisible(true);
                    } else {
                      message.warning('请先选择要申购的产品');
                    }
                  }}>申购</Button>
                  <Button style={{ marginRight: 8 }} onClick={() => {
                    if (selectedProduct) {
                      setRedeemModalVisible(true);
                    } else {
                      message.warning('请先选择要赎回的产品');
                    }
                  }}>赎回</Button>
                </div>
                <div>
                  <span style={{ marginRight: 8 }}>
                    <strong>交易状态：</strong>
                    <Tag color="blue">全部</Tag>
                  </span>
                  <span>
                    <strong>交易类型：</strong>
                    <Tag color="blue">全部</Tag>
                  </span>
                </div>
              </div>
              
              <Table
                dataSource={transactions}
                rowKey="tradeId"
                pagination={{
                  pageSize: 10,
                  showTotal: total => `共 ${total} 条记录`
                }}
                columns={[
                  { 
                    title: '交易流水号', 
                    dataIndex: 'tradeId', 
                    key: 'tradeId',
                    width: 160
                  },
                  { 
                    title: '产品名称', 
                    dataIndex: 'productItem', 
                    key: 'productItem',
                    render: (text) => text?.productName || '未知产品',
                  },
                  { 
                    title: '交易类型', 
                    dataIndex: 'type', 
                    key: 'type',
                    width: 100, 
                    render: type => (
                      <Tag color={type === '申购' ? 'blue' : 'orange'}>
                        {type}
                      </Tag>
                    )
                  },
                  { 
                    title: '金额', 
                    dataIndex: 'amount', 
                    key: 'amount',
                    width: 140,
                    render: amount => `¥${Number(amount).toFixed(2)}`
                  },
                  { 
                    title: '交易状态', 
                    dataIndex: 'status', 
                    key: 'status',
                    width: 120,
                    render: status => {
                      let color = 'default';
                      if (status === '已执行') color = 'green';
                      else if (status === '审批中') color = 'blue';
                      else if (status === '已拒绝') color = 'red';
                      else if (status === '待审批') color = 'orange';
                      
                      return <Tag color={color}>{status}</Tag>;
                    }
                  },
                  { 
                    title: '申请时间', 
                    dataIndex: 'createTime', 
                    key: 'createTime',
                    width: 180,
                    render: time => moment(time).format('YYYY-MM-DD HH:mm:ss')
                  },
                  { 
                    title: '更新时间', 
                    dataIndex: 'updateTime', 
                    key: 'updateTime',
                    width: 180,
                    render: time => moment(time).format('YYYY-MM-DD HH:mm:ss')
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 120,
                    render: (_, record) => (
                      <>
                        <Button type="link" size="small" onClick={() => handleViewTransactionDetail(record)}>
                          详情
                        </Button>
                        {record.status === '待审批' && (
                          <Button type="link" size="small" danger>撤销</Button>
                        )}
                      </>
                    )
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="交易类型统计">
              <Recharts.ResponsiveContainer width="100%" height={300}>
                <Recharts.BarChart data={[
                  { type: '申购', value: transactions.filter(t => t.type === '申购').length },
                  { type: '赎回', value: transactions.filter(t => t.type === '赎回').length }
                ]}>
                  <Recharts.CartesianGrid strokeDasharray="3 3" />
                  <Recharts.XAxis dataKey="type" />
                  <Recharts.YAxis />
                  <Recharts.Tooltip />
                  <Recharts.Legend />
                  <Recharts.Bar dataKey="value" fill="#8884d8" name="交易数量" />
                </Recharts.BarChart>
              </Recharts.ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="交易状态统计">
              <Recharts.ResponsiveContainer width="100%" height={300}>
                <Recharts.PieChart>
                  <Recharts.Pie
                    data={[
                      { name: '已执行', value: transactions.filter(t => t.status === '已执行').length, color: '#52c41a' },
                      { name: '审批中', value: transactions.filter(t => t.status === '审批中').length, color: '#1890ff' },
                      { name: '已拒绝', value: transactions.filter(t => t.status === '已拒绝').length, color: '#f5222d' },
                      { name: '待审批', value: transactions.filter(t => t.status === '待审批').length, color: '#faad14' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: '已执行', value: transactions.filter(t => t.status === '已执行').length, color: '#52c41a' },
                      { name: '审批中', value: transactions.filter(t => t.status === '审批中').length, color: '#1890ff' },
                      { name: '已拒绝', value: transactions.filter(t => t.status === '已拒绝').length, color: '#f5222d' },
                      { name: '待审批', value: transactions.filter(t => t.status === '待审批').length, color: '#faad14' }
                    ].map((entry, index) => (
                      <Recharts.Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Recharts.Pie>
                  <Recharts.Tooltip />
                  <Recharts.Legend />
                </Recharts.PieChart>
              </Recharts.ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        {renderTransactionDetailModal()}
      </>
    );
  };

  // 渲染交易详情模态框
  const renderTransactionDetailModal = () => {
    if (!selectedTransaction) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case '已执行': return 'green';
        case '审批中': return 'blue';
        case '已拒绝': return 'red';
        case '待审批': return 'orange';
        default: return 'default';
      }
    };

    return (
      <Modal
        title="交易详情"
        open={transactionDetailVisible}
        onCancel={() => {
          setTransactionDetailVisible(false);
          setSelectedTransaction(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setTransactionDetailVisible(false);
            setSelectedTransaction(null);
          }}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <div style={{ padding: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>交易流水号</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedTransaction.tradeId}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>交易状态</div>
                <div>
                  <Tag color={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Tag>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>产品名称</div>
                <div style={{ fontSize: '16px' }}>{selectedTransaction.productItem.productName}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>产品代码</div>
                <div style={{ fontSize: '16px' }}>{selectedTransaction.productItem.productCode}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>交易类型</div>
                <div>
                  <Tag color={selectedTransaction.type === '申购' ? 'blue' : 'orange'}>
                    {selectedTransaction.type}
                  </Tag>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>交易金额</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  ¥{Number(selectedTransaction.amount).toFixed(2)}
                </div>
              </div>
            </Col>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>申请时间</div>
                <div style={{ fontSize: '16px' }}>
                  {moment(selectedTransaction.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </Col>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#999', fontSize: '14px' }}>更新时间</div>
                <div style={{ fontSize: '16px' }}>
                  {moment(selectedTransaction.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </Col>
            {selectedTransaction.status === '已拒绝' && (
              <Col span={24}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#999', fontSize: '14px' }}>拒绝原因</div>
                  <div style={{ fontSize: '16px', color: '#ff4d4f' }}>
                    交易金额超出单笔限额
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Modal>
    );
  };

  // 发起推荐请求
  const handleRecommendationRequest = () => {
    setRecommendationModalVisible(true);
  };

  // 渲染推荐请求模态框
  const renderRecommendationModal = () => {
    return (
      <Modal
        title="发起产品推荐请求"
        open={recommendationModalVisible}
        onCancel={() => setRecommendationModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRecommendationModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => setRecommendationModalVisible(false)}>
            提交
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="投资需求描述" required>
            <Input.TextArea rows={4} placeholder="请详细描述您的投资需求，包括投资目标、风险偏好、投资期限等" />
          </Form.Item>
          <Form.Item label="期望投资金额" required>
            <InputNumber
              style={{ width: '100%' }}
              min={10000}
              step={10000}
              placeholder="请输入期望投资金额"
            />
          </Form.Item>
          <Form.Item label="投资期限" required>
            <Select placeholder="请选择投资期限">
              <Select.Option value="short">短期（1年以内）</Select.Option>
              <Select.Option value="medium">中期（1-3年）</Select.Option>
              <Select.Option value="long">长期（3年以上）</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 渲染买入模态框
  const renderBuyModal = () => {
    return (
      <Modal
        title="买入产品"
        open={buyModalVisible}
        onCancel={() => {
          setBuyModalVisible(false);
          setBuyShares(1000);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setBuyModalVisible(false);
            setBuyShares(1000);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            if (selectedProduct && buyShares > 0) {
              const newShares = selectedProduct.shares + buyShares;
              updatePortfolioData(selectedProduct.productCode, newShares, 'buy');
              message.success('买入申请已提交');
              setBuyModalVisible(false);
              setBuyShares(1000);
            }
          }}>
            确认买入
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="产品名称">
            <Input value={selectedProduct?.productName} disabled />
          </Form.Item>
          <Form.Item label="产品代码">
            <Input value={selectedProduct?.productCode} disabled />
          </Form.Item>
          <Form.Item label="当前净值">
            <Input value={selectedProduct?.netValue} disabled />
          </Form.Item>
          <Form.Item label="买入份额" required>
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              step={1}
              value={buyShares}
              onChange={value => setBuyShares(value)}
              placeholder="请输入买入份额"
            />
          </Form.Item>
          <Form.Item label="预计金额">
            <Input 
              value={selectedProduct ? (buyShares * selectedProduct.netValue).toFixed(2) : '0.00'} 
              disabled 
              suffix="元"
            />
          </Form.Item>
          <Form.Item label="交易密码" required>
            <Input.Password placeholder="请输入交易密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 渲染卖出模态框
  const renderSellModal = () => {
    return (
      <Modal
        title="卖出产品"
        open={sellModalVisible}
        onCancel={() => {
          setSellModalVisible(false);
          setSellShares(1000);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setSellModalVisible(false);
            setSellShares(1000);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            if (selectedProduct && sellShares > 0 && sellShares <= selectedProduct.shares) {
              const newShares = selectedProduct.shares - sellShares;
              updatePortfolioData(selectedProduct.productCode, newShares, 'sell');
              message.success('卖出申请已提交');
              setSellModalVisible(false);
              setSellShares(1000);
            } else if (sellShares > selectedProduct.shares) {
              message.error('卖出份额不能超过持有份额');
            }
          }}>
            确认卖出
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="产品名称">
            <Input value={selectedProduct?.productName} disabled />
          </Form.Item>
          <Form.Item label="产品代码">
            <Input value={selectedProduct?.productCode} disabled />
          </Form.Item>
          <Form.Item label="当前净值">
            <Input value={selectedProduct?.netValue} disabled />
          </Form.Item>
          <Form.Item label="持有份额">
            <Input value={selectedProduct?.shares} disabled />
          </Form.Item>
          <Form.Item label="卖出份额" required>
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={selectedProduct?.shares}
              step={1}
              value={sellShares}
              onChange={value => setSellShares(value)}
              placeholder="请输入卖出份额"
            />
          </Form.Item>
          <Form.Item label="预计金额">
            <Input 
              value={selectedProduct ? (sellShares * selectedProduct.netValue).toFixed(2) : '0.00'} 
              disabled 
              suffix="元"
            />
          </Form.Item>
          <Form.Item label="交易密码" required>
            <Input.Password placeholder="请输入交易密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 渲染申购模态框
  const renderSubscribeModal = () => {
    return (
      <Modal
        title="申购产品"
        open={subscribeModalVisible}
        onCancel={() => {
          setSubscribeModalVisible(false);
          setSubscribeAmount(10000);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setSubscribeModalVisible(false);
            setSubscribeAmount(10000);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            if (selectedProduct && subscribeAmount >= 10000) {
              message.success('申购申请已提交');
              setSubscribeModalVisible(false);
              setSubscribeAmount(10000);
            } else if (subscribeAmount < 10000) {
              message.error('申购金额不能低于10000元');
            }
          }}>
            确认申购
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="产品名称">
            <Input value={selectedProduct?.productName} disabled />
          </Form.Item>
          <Form.Item label="产品代码">
            <Input value={selectedProduct?.productCode} disabled />
          </Form.Item>
          <Form.Item label="当前净值">
            <Input value={selectedProduct?.netValue} disabled />
          </Form.Item>
          <Form.Item label="申购金额" required>
            <InputNumber
              style={{ width: '100%' }}
              min={10000}
              step={1000}
              value={subscribeAmount}
              onChange={value => setSubscribeAmount(value)}
              placeholder="请输入申购金额"
            />
          </Form.Item>
          <Form.Item label="预计份额">
            <Input 
              value={selectedProduct ? (subscribeAmount / selectedProduct.netValue).toFixed(2) : '0.00'} 
              disabled 
              suffix="份"
            />
          </Form.Item>
          <Form.Item label="交易密码" required>
            <Input.Password placeholder="请输入交易密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 渲染赎回模态框
  const renderRedeemModal = () => {
    return (
      <Modal
        title="赎回产品"
        open={redeemModalVisible}
        onCancel={() => {
          setRedeemModalVisible(false);
          setRedeemAmount(10000);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setRedeemModalVisible(false);
            setRedeemAmount(10000);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            if (selectedProduct && redeemAmount >= 10000) {
              message.success('赎回申请已提交');
              setRedeemModalVisible(false);
              setRedeemAmount(10000);
            } else if (redeemAmount < 10000) {
              message.error('赎回金额不能低于10000元');
            }
          }}>
            确认赎回
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="产品名称">
            <Input value={selectedProduct?.productName} disabled />
          </Form.Item>
          <Form.Item label="产品代码">
            <Input value={selectedProduct?.productCode} disabled />
          </Form.Item>
          <Form.Item label="当前净值">
            <Input value={selectedProduct?.netValue} disabled />
          </Form.Item>
          <Form.Item label="持有份额">
            <Input value={selectedProduct?.shares} disabled />
          </Form.Item>
          <Form.Item label="赎回金额" required>
            <InputNumber
              style={{ width: '100%' }}
              min={10000}
              max={selectedProduct ? selectedProduct.shares * selectedProduct.netValue : 0}
              step={1000}
              value={redeemAmount}
              onChange={value => setRedeemAmount(value)}
              placeholder="请输入赎回金额"
            />
          </Form.Item>
          <Form.Item label="预计赎回份额">
            <Input 
              value={selectedProduct ? (redeemAmount / selectedProduct.netValue).toFixed(2) : '0.00'} 
              disabled 
              suffix="份"
            />
          </Form.Item>
          <Form.Item label="交易密码" required>
            <Input.Password placeholder="请输入交易密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography.Text strong style={{ color: '#fff' }}>私人财富管理</Typography.Text>
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
            <span style={{ marginRight: 12 }}>欢迎，{clientData?.name || user?.username}</span>
            <Button type="primary" onClick={handleRecommendationRequest}>发起推荐请求</Button>
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
          {renderRecommendationModal()}
          {renderBuyModal()}
          {renderSellModal()}
          {renderSubscribeModal()}
          {renderRedeemModal()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientDashboard;