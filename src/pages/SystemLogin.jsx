import React, { useState } from 'react';
import { Form, Input, Button, Card, Layout, message, Select, Radio, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice';

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const SystemLogin = () => {
  // 使用本地状态和导航替代Redux
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('admin');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 模拟登录逻辑，而不是使用dispatch
      // const success = await dispatch(login(values.username, values.password, role));
      
      // 简单模拟登录成功
      const success = true;
      
      if (success) {
        message.success('登录成功');
        
        // 基于角色导航到对应页面
        if (role === 'admin') {
          navigate('/system/admin');
        } else if (role === 'advisor') {
          navigate('/system/advisor');
        } else if (role === 'risk') {
          navigate('/system/risk');
        } else if (role === 'compliance') {
          navigate('/system/compliance');
        }
      }
    } catch (error) {
      message.error('登录失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card title="系统用户登录" style={{ width: 400 }}>
          <Form
            name="system_login"
            initialValues={{ role: role }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>

            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Radio.Group
                value={role}
                onChange={(e) => {
                  console.log('角色已更改为:', e.target.value);
                  setRole(e.target.value);
                }}
              >
                <Radio.Button value="admin">系统管理员</Radio.Button>
                <Radio.Button value="advisor">客户经理</Radio.Button>
                <Radio.Button value="risk">风控人员</Radio.Button>
                <Radio.Button value="compliance">合规人员</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default SystemLogin; 