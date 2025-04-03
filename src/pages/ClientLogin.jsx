import React, { useState } from 'react';
import { Form, Input, Button, Card, Layout, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { login } from '../store/slices/authSlice';

const { Content } = Layout;
const { Title } = Typography;

const ClientLogin = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 模拟登录逻辑，而不是使用dispatch
      // const success = await dispatch(login(values.username, values.password, 'client'));
      
      // 简单模拟登录成功
      const success = true;
      
      if (success) {
        message.success('登录成功');
        navigate('/client');
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
        <Card title="客户登录" style={{ width: 400 }}>
          <Form
            name="client_login"
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

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default ClientLogin; 