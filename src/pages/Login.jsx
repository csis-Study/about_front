import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message, Modal, Space, Radio, Divider } from 'antd';
import { UserOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginForm] = Form.useForm();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('client');
  const [systemRole, setSystemRole] = useState('advisor');
  
  // Cookie提示框状态
  const [cookieModalVisible, setCookieModalVisible] = useState(false);
  const [cookiePreference, setCookiePreference] = useState('all');

  // 在组件挂载时显示Cookie提示框
  useEffect(() => {
    // 强制显示Cookie提示框，不检查localStorage
    const timer = setTimeout(() => {
      setCookieModalVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 处理用户Cookie选择
  const handleCookieConsent = () => {
    // 存储用户的选择和时间戳，用于判断有效期
    const consent = {
      preference: cookiePreference,
      timestamp: Date.now()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setCookieModalVisible(false);
    message.success('Cookie设置已保存');
  };

  // 拒绝所有非必要Cookie
  const handleRejectCookies = () => {
    setCookiePreference('essential');
    // 存储用户的选择和时间戳
    const consent = {
      preference: 'essential',
      timestamp: Date.now()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setCookieModalVisible(false);
    message.info('仅使用必要的Cookie');
  };

  // 获取角色中文名称
  const getRoleName = (role) => {
    switch (role) {
      case 'advisor': return '客户经理';
      case 'risk': return '风控人员';
      case 'compliance': return '合规人员';
      case 'client': return '客户';
      default: return '系统用户';
    }
  };

  // 初始化测试数据的函数
  const initTestData = () => {
    // 初始化客户数据
    const testClients = [
      { 
        id: 1, 
        name: '张三', 
        phone: '13800138000', 
        riskLevel: '中等',
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        nextKycTime: moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
        kycHistory: [
          {
            evaluator: '风控专员',
            oldRiskLevel: '低',
            newRiskLevel: '中等',
            evaluationTime: moment().subtract(2, 'months').format('YYYY-MM-DD HH:mm:ss'),
            notes: '客户投资偏好变化，风险承受能力提升'
          }
        ]
      },
      { 
        id: 2, 
        name: '李四', 
        phone: '13800138001', 
        riskLevel: '低',
        createTime: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
        nextKycTime: moment().add(28, 'days').format('YYYY-MM-DD HH:mm:ss'),
        kycHistory: []
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
      }
    ];

    // 初始化推荐
    const testRecommendations = [
      {
        id: 101,
        clientId: 1,
        clientName: '张三',
        advisorName: '客户经理',
        products: [
          { 
            id: 3, 
            name: '基金C', 
            code: '200001', 
            price: 1.2, 
            quantity: 1000,
            riskLevel: '中等', 
            expectedReturn: 8
          }
        ],
        totalAmount: 1200,
        createTime: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        status: 'pending'
      }
    ];
    
    // 初始化订单数据
    const testOrders = [
      {
        id: 'ORDER12345',
        clientId: 1,
        clientName: '张三',
        products: [
          { 
            id: 2, 
            name: '债券B', 
            code: '100001', 
            price: 100, 
            quantity: 10,
            riskLevel: '低', 
            expectedReturn: 5
          }
        ],
        totalAmount: 1000,
        status: 'approved',
        createTime: moment().subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss'),
        approvalHistory: [
          {
            approver: '客户经理',
            department: 'advisor',
            action: 'approve',
            time: moment().subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss')
          },
          {
            approver: '风控专员',
            department: 'risk',
            action: 'approve',
            time: moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss')
          },
          {
            approver: '合规专员',
            department: 'compliance',
            action: 'approve',
            time: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
          }
        ]
      }
    ];

    // 保存数据到localStorage
    localStorage.setItem('clients', JSON.stringify(testClients));
    localStorage.setItem('products', JSON.stringify(testProducts));
    localStorage.setItem('recommendations', JSON.stringify(testRecommendations));
    localStorage.setItem('orders', JSON.stringify(testOrders));
    
    message.success('测试数据已初始化');
  };

  const onFinish = (values) => {
    // 确保有测试数据
    const hasClients = JSON.parse(localStorage.getItem('clients') || '[]').length > 0;
    if (!hasClients) {
      initTestData();
    }
    
    console.log('登录信息:', values, userType, systemRole);
    setLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      try {
        const { username, password, remember } = values;
        
        // 记住账号
        if (remember) {
          localStorage.setItem('username', username);
        } else {
          localStorage.removeItem('username');
        }
        
        // 根据用户类型和角色设置不同的登录逻辑
        if (userType === 'client') {
          // 客户登录
          // 获取现有的客户数据
          const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
          
          // 查找匹配的客户或使用默认客户
          let clientData = storedClients.find(c => c.name === (username || '张三'));
          const clientId = clientData?.id || 1;
          
          localStorage.setItem('userInfo', JSON.stringify({
            username: username || '张三',
            role: 'client',
            id: clientId
          }));
          
          // 延迟跳转，确保localStorage更新完成
          setTimeout(() => {
            navigate('/client/dashboard');
            message.success('客户登录成功！');
          }, 100);
        } else if (userType === 'system') {
          // 系统用户登录
          if (systemRole === 'advisor') {
            localStorage.setItem('userInfo', JSON.stringify({
              username: username || '客户经理',
              role: 'advisor'
            }));
            setTimeout(() => {
              navigate('/system/advisor-dashboard');
              message.success('客户经理登录成功！');
            }, 100);
          } else if (systemRole === 'risk') {
            localStorage.setItem('userInfo', JSON.stringify({
              username: username || '风控专员',
              role: 'risk',
              department: 'risk'
            }));
            setTimeout(() => {
              navigate('/system/risk-dashboard');
              message.success('风控人员登录成功！');
            }, 100);
          } else if (systemRole === 'compliance') {
            localStorage.setItem('userInfo', JSON.stringify({
              username: username || '合规专员',
              role: 'compliance',
              department: 'compliance'
            }));
            setTimeout(() => {
              navigate('/system/compliance-dashboard');
              message.success('合规人员登录成功！');
            }, 100);
          }
        }
      } catch (error) {
        console.error('登录出错:', error);
        message.error('登录失败: ' + (error.message || '未知错误'));
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  useEffect(() => {
    // 从localStorage获取用户名（如果之前选择了记住账号）
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      loginForm.setFieldsValue({ username: savedUsername, remember: true });
    }
  }, [loginForm]);

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>财富管理系统</Title>
        </div>
        <Form
          form={loginForm}
          name="login"
          initialValues={{ remember: false }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="userType"
            label="用户类型"
          >
            <Radio.Group 
              value={userType} 
              onChange={(e) => setUserType(e.target.value)}
              style={{ width: '100%' }}
            >
              <Radio.Button value="client" style={{ width: '50%', textAlign: 'center' }}>客户</Radio.Button>
              <Radio.Button value="system" style={{ width: '50%', textAlign: 'center' }}>系统用户</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {userType === 'system' && (
            <Form.Item
              name="systemRole"
              label="系统角色"
            >
              <Radio.Group 
                value={systemRole} 
                onChange={(e) => setSystemRole(e.target.value)}
                style={{ width: '100%' }}
              >
                <Radio.Button value="advisor" style={{ width: '33.3%', textAlign: 'center' }}>客户经理</Radio.Button>
                <Radio.Button value="risk" style={{ width: '33.3%', textAlign: 'center' }}>风控人员</Radio.Button>
                <Radio.Button value="compliance" style={{ width: '33.3%', textAlign: 'center' }}>合规人员</Radio.Button>
              </Radio.Group>
            </Form.Item>
          )}
          
          <Form.Item
            name="username"
            rules={[{ required: false, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名 (可选)" autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: false, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码 (可选)"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住账号</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="#reset-password">
              忘记密码?
            </a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              登录
            </Button>
          </Form.Item>
          
          <Divider style={{ margin: '16px 0' }} />
          <div style={{ textAlign: 'center' }}>
            <Paragraph type="secondary" style={{ marginBottom: 8 }}>
              演示系统，无需真实账号，选择角色后直接登录即可
            </Paragraph>
          </div>
        </Form>
      </Card>

      {/* Cookie提示对话框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff', fontSize: 18 }} />
            <span>Cookie隐私设置</span>
          </div>
        }
        open={cookieModalVisible}
        width={550}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="reject" onClick={handleRejectCookies}>
            仅使用必要的Cookie
          </Button>,
          <Button key="settings" type="primary" onClick={handleCookieConsent}>
            保存设置
          </Button>,
        ]}
        bodyStyle={{ maxHeight: '400px', overflow: 'auto', padding: '20px' }}
      >
        <Paragraph>
          我们使用Cookie和类似技术来帮助个性化内容，提供更好的用户体验，分析我们的网站流量，以及为广告合作伙伴提供有关您使用我们网站的信息。
        </Paragraph>
        
        <Paragraph>
          点击"保存设置"即表示您同意我们使用以下类型的Cookie。您可以随时通过页面底部的"Cookie设置"链接更改您的选择。
        </Paragraph>
        
        <Divider />
        
        <Radio.Group onChange={(e) => setCookiePreference(e.target.value)} value={cookiePreference}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value="all" style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div>
                <Text strong>接受所有Cookie</Text>
                <div>
                  <Text type="secondary">我们将使用Cookie来提供个性化服务，分析网站流量，并与广告合作伙伴共享信息。</Text>
                </div>
              </div>
            </Radio>
            
            <Radio value="performance" style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div>
                <Text strong>性能和功能Cookie</Text>
                <div>
                  <Text type="secondary">这些Cookie帮助我们了解网站的使用情况并改进用户体验，但不包括广告相关的Cookie。</Text>
                </div>
              </div>
            </Radio>
            
            <Radio value="essential" style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div>
                <Text strong>仅必要的Cookie</Text>
                <div>
                  <Text type="secondary">这些Cookie对网站功能至关重要，无法禁用。通常它们仅在您执行特定操作时设置。</Text>
                </div>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
        
        <Divider />
        
        <div style={{ marginTop: 10 }}>
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            更多详细信息请阅读我们的 <a href="#privacy-policy">隐私政策</a> 和 <a href="#terms">使用条款</a>。
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default Login; 