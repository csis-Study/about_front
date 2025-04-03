import React from 'react';
import { Card, Button, Layout } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const LoginSelect = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card title="欢迎使用私人财富管理系统" style={{ width: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button
              type="primary"
              size="large"
              icon={<UserOutlined />}
              onClick={() => navigate('/login/client')}
            >
              客户登录
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<TeamOutlined />}
              onClick={() => navigate('/login/system')}
            >
              系统用户登录
            </Button>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginSelect; 