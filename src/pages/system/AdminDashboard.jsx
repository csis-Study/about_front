import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Table, List, Tag, Typography, Button, Modal, Form, Input, Select, Switch, Statistic, Divider, Badge, Spin, Alert, DatePicker, Tabs, Space, Descriptions } from 'antd';
import { UserOutlined, DashboardOutlined, SettingOutlined, SafetyCertificateOutlined, DatabaseOutlined, FileSearchOutlined, AuditOutlined, SafetyOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { Header, Content, Sider } = Layout;

const AdminDashboard = () => {
  const [user] = useState({ 
    username: '系统管理员', 
    role: 'admin' 
  });
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentMenuKey, setCurrentMenuKey] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 68,
    disk: 32,
    uptime: '7天5小时',
    activeUsers: 12,
    lastBackup: '2024-04-01 03:00:00',
    systemAlerts: []
  });
  const [loading, setLoading] = useState(false);
  const [systemLogs, setSystemLogs] = useState([]);
  const [logFilter, setLogFilter] = useState({
    level: 'all',
    dateRange: null,
    source: 'all'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟用户数据
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          name: '系统管理员',
          role: 'admin',
          department: '信息技术部',
          lastLogin: '2024-04-01 10:30:45',
          status: '在线'
        },
        {
          id: 2,
          username: 'manager1',
          name: '张经理',
          role: 'manager',
          department: '客户服务部',
          lastLogin: '2024-04-01 09:15:22',
          status: '在线'
        },
        {
          id: 3,
          username: 'risk1',
          name: '李风控',
          role: 'risk',
          department: '风险管理部',
          lastLogin: '2024-04-01 08:45:01',
          status: '离线'
        }
      ];

      // 模拟系统设置数据
      const mockSettings = {
        general: {
          systemName: '私人财富管理系统',
          version: '1.0.0',
          maintenanceMode: false,
          lastBackup: '2024-04-01 03:00:00'
        },
        security: {
          sessionTimeout: 30
        }
      };

      // 模拟系统日志数据
      const mockLogs = [
        {
          id: 1,
          time: moment().subtract(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          level: 'INFO',
          message: '系统管理员登录系统',
          source: '认证服务',
          details: 'IP: 192.168.1.100'
        },
        {
          id: 2,
          time: moment().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          level: 'INFO',
          message: '修改系统设置',
          source: '系统设置',
          details: '更新了系统维护模式状态'
        },
        {
          id: 3,
          time: moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          level: 'WARNING',
          message: '用户尝试访问未授权资源',
          source: '授权服务',
          details: '用户: manager1, 资源: /api/admin/settings'
        },
        {
          id: 4,
          time: moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          level: 'INFO',
          message: '添加新用户',
          source: '用户管理',
          details: '添加用户: risk2, 角色: 风控人员'
        },
        {
          id: 5,
          time: moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
          level: 'ERROR',
          message: '数据库连接失败',
          source: '数据访问层',
          details: '连接超时，重试3次后失败'
        },
        {
          id: 6,
          time: moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
          level: 'INFO',
          message: '系统备份开始',
          source: '备份服务',
          details: '开始全量数据备份'
        },
        {
          id: 7,
          time: moment().subtract(4, 'hours').format('YYYY-MM-DD HH:mm:ss'),
          level: 'INFO',
          message: '系统备份完成',
          source: '备份服务',
          details: '备份大小: 2.5GB, 耗时: 15分钟'
        }
      ];

      setUsers(mockUsers);
      setSettings(mockSettings);
      
      // 更新系统状态数据
      setSystemStatus({
        cpu: Math.floor(Math.random() * 60) + 20,
        memory: Math.floor(Math.random() * 40) + 40,
        disk: Math.floor(Math.random() * 30) + 20,
        uptime: '7天5小时',
        activeUsers: mockUsers.filter(u => u.status === '在线').length,
        lastBackup: mockSettings.general.lastBackup,
        systemAlerts: [
          { id: 1, level: 'warning', message: '系统CPU使用率超过阈值', time: '2024-04-01 14:30:00' },
          { id: 2, level: 'info', message: '系统备份完成', time: '2024-04-01 03:00:00' }
        ]
      });

      setSystemLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={
          role === 'admin' ? 'red' :
          role === 'manager' ? 'blue' :
          role === 'risk' ? 'gold' :
          role === 'compliance' ? 'green' :
          'default'
        }>
          {role === 'admin' ? '系统管理员' :
           role === 'manager' ? '客户经理' : 
           role === 'risk' ? '风控人员' : 
           role === 'compliance' ? '合规人员' : role}
        </Tag>
      )
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={status === '在线' ? 'success' : 'default'} text={status} />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditUser(record)}>编辑</Button>
      )
    }
  ];

  const handleAddUser = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    form.setFieldsValue({
      ...user,
      status: user.status === '在线'
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // 这里添加创建或更新用户的逻辑
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '系统概览'
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理'
    },
    {
      key: 'status',
      icon: <DatabaseOutlined />,
      label: '系统运行状态'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    },
    {
      key: 'logs',
      icon: <FileSearchOutlined />,
      label: '系统日志'
    },
    {
      key: 'security',
      icon: <SafetyCertificateOutlined />,
      label: '安全管理'
    }
  ];

  const renderContent = () => {
    switch (currentMenuKey) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <Title level={3}>系统概览</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="当前在线用户"
                    value={systemStatus.activeUsers}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="CPU利用率"
                    value={systemStatus.cpu}
                    valueStyle={{ color: systemStatus.cpu > 70 ? '#cf1322' : '#3f8600' }}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="内存使用率"
                    value={systemStatus.memory}
                    valueStyle={{ color: systemStatus.memory > 80 ? '#cf1322' : '#3f8600' }}
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="磁盘使用率"
                    value={systemStatus.disk}
                    valueStyle={{ color: systemStatus.disk > 85 ? '#cf1322' : '#3f8600' }}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Card title="系统状态">
                  <List
                    dataSource={[
                      { label: '系统已运行时间', value: systemStatus.uptime },
                      { label: '系统版本', value: settings?.general?.version || '1.0.0' },
                      { label: '最后备份时间', value: systemStatus.lastBackup },
                      { label: '用户总数', value: users.length }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <span>{item.label}:</span>
                        <span>{item.value}</span>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="系统通知">
                  <List
                    dataSource={systemStatus.systemAlerts}
                    renderItem={item => (
                      <List.Item>
                        <Badge 
                          status={item.level === 'warning' ? 'warning' : 
                                 item.level === 'error' ? 'error' : 'success'} 
                        />
                        <span>{item.message}</span>
                        <span style={{ marginLeft: 'auto' }}>{item.time}</span>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        );
      
      case 'users':
        return (
          <div className="users-content">
            <Title level={3}>用户管理</Title>
            <Button type="primary" onClick={handleAddUser} style={{ marginBottom: '16px' }}>
              添加用户
            </Button>
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
            />
          </div>
        );
      
      case 'status':
        return (
          <div className="status-content">
            <Title level={3}>系统运行状态</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="CPU使用率">
                  <Statistic
                    value={systemStatus.cpu}
                    suffix="%"
                    valueStyle={{ color: systemStatus.cpu > 70 ? '#cf1322' : '#3f8600' }}
                  />
                  <div style={{ height: '100px', background: '#f0f2f5', marginTop: '16px' }}>
                    CPU图表（模拟）
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="内存使用率">
                  <Statistic
                    value={systemStatus.memory}
                    suffix="%"
                    valueStyle={{ color: systemStatus.memory > 80 ? '#cf1322' : '#3f8600' }}
                  />
                  <div style={{ height: '100px', background: '#f0f2f5', marginTop: '16px' }}>
                    内存图表（模拟）
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="磁盘使用率">
                  <Statistic
                    value={systemStatus.disk}
                    suffix="%"
                    valueStyle={{ color: systemStatus.disk > 85 ? '#cf1322' : '#3f8600' }}
                  />
                  <div style={{ height: '100px', background: '#f0f2f5', marginTop: '16px' }}>
                    磁盘图表（模拟）
                  </div>
                </Card>
              </Col>
            </Row>
            
            <Card title="系统活动" style={{ marginTop: '16px' }}>
              <List
                dataSource={[
                  { type: '系统启动', time: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'), status: '成功' },
                  { type: '数据库备份', time: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'), status: '成功' },
                  { type: '缓存清理', time: moment().subtract(6, 'hours').format('YYYY-MM-DD HH:mm:ss'), status: '成功' }
                ]}
                renderItem={item => (
                  <List.Item>
                    <span>{item.type}</span>
                    <span>{item.time}</span>
                    <Tag color="green">{item.status}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        );
      
      case 'settings':
        return (
          <div className="settings-content">
            <Title level={3}>系统设置</Title>
            <Card title="基本设置">
              <Form layout="vertical">
                <Form.Item label="系统名称" initialValue={settings?.general?.systemName}>
                  <Input />
                </Form.Item>
                <Form.Item label="维护模式" initialValue={settings?.general?.maintenanceMode}>
                  <Switch checked={settings?.general?.maintenanceMode} />
                </Form.Item>
                <Form.Item label="会话超时时间（分钟）" initialValue={settings?.security?.sessionTimeout}>
                  <Input type="number" />
                </Form.Item>
                <Divider />
                <Button type="primary">保存设置</Button>
              </Form>
            </Card>
            
            <Card title="密码策略" style={{ marginTop: '16px' }}>
              <Form layout="vertical">
                <Form.Item label="最小密码长度" initialValue={settings?.security?.passwordPolicy?.minLength}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item label="要求大写字母" initialValue={settings?.security?.passwordPolicy?.requireUppercase}>
                  <Switch checked={settings?.security?.passwordPolicy?.requireUppercase} />
                </Form.Item>
                <Form.Item label="要求小写字母" initialValue={settings?.security?.passwordPolicy?.requireLowercase}>
                  <Switch checked={settings?.security?.passwordPolicy?.requireLowercase} />
                </Form.Item>
                <Form.Item label="要求数字" initialValue={settings?.security?.passwordPolicy?.requireNumber}>
                  <Switch checked={settings?.security?.passwordPolicy?.requireNumber} />
                </Form.Item>
                <Divider />
                <Button type="primary">保存密码策略</Button>
              </Form>
            </Card>
          </div>
        );
        
      case 'logs':
        return (
          <div className="logs-content">
            <Title level={3}>系统日志</Title>
            <Card>
              <Space style={{ marginBottom: 16 }}>
                <Select
                  style={{ width: 120 }}
                  value={logFilter.level}
                  onChange={value => setLogFilter(prev => ({ ...prev, level: value }))}
                >
                  <Option value="all">所有级别</Option>
                  <Option value="INFO">信息</Option>
                  <Option value="WARNING">警告</Option>
                  <Option value="ERROR">错误</Option>
                </Select>
                <Select
                  style={{ width: 120 }}
                  value={logFilter.source}
                  onChange={value => setLogFilter(prev => ({ ...prev, source: value }))}
                >
                  <Option value="all">所有来源</Option>
                  <Option value="认证服务">认证服务</Option>
                  <Option value="授权服务">授权服务</Option>
                  <Option value="系统设置">系统设置</Option>
                  <Option value="用户管理">用户管理</Option>
                  <Option value="数据访问层">数据访问层</Option>
                  <Option value="备份服务">备份服务</Option>
                </Select>
                <DatePicker.RangePicker
                  onChange={(dates) => setLogFilter(prev => ({ ...prev, dateRange: dates }))}
                />
                <Button onClick={() => setLogFilter({ level: 'all', dateRange: null, source: 'all' })}>
                  重置筛选
                </Button>
              </Space>
              <Table
                columns={[
                  { 
                    title: '时间', 
                    dataIndex: 'time', 
                    key: 'time',
                    sorter: (a, b) => moment(a.time).unix() - moment(b.time).unix()
                  },
                  { 
                    title: '级别', 
                    dataIndex: 'level', 
                    key: 'level',
                    render: level => (
                      <Tag color={
                        level === 'ERROR' ? 'red' :
                        level === 'WARNING' ? 'orange' :
                        level === 'INFO' ? 'blue' : 'default'
                      }>
                        {level}
                      </Tag>
                    )
                  },
                  { title: '消息', dataIndex: 'message', key: 'message' },
                  { title: '来源', dataIndex: 'source', key: 'source' },
                  { 
                    title: '详细信息', 
                    dataIndex: 'details', 
                    key: 'details',
                    ellipsis: true
                  }
                ]}
                dataSource={filterLogs(systemLogs)}
                rowKey="id"
                pagination={{
                  total: filterLogs(systemLogs).length,
                  pageSize: 10,
                  showTotal: (total) => `共 ${total} 条记录`
                }}
              />
            </Card>
          </div>
        );
        
      case 'security':
        return (
          <div className="security-content">
            <Title level={3}>安全管理</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="登录尝试">
                  <List
                    dataSource={[
                      { username: 'admin', ip: '192.168.1.100', time: '2024-04-01 10:30:45', status: '成功' },
                      { username: 'unknown', ip: '203.0.113.45', time: '2024-04-01 11:15:22', status: '失败' },
                      { username: 'manager', ip: '192.168.1.101', time: '2024-04-01 09:45:01', status: '成功' }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <span>{item.username}</span>
                        <span>{item.ip}</span>
                        <span>{item.time}</span>
                        <Tag color={item.status === '成功' ? 'green' : 'red'}>{item.status}</Tag>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="操作审计">
                  <List
                    dataSource={[
                      { user: 'admin', action: '修改系统设置', time: '2024-04-01 14:30:45' },
                      { user: 'admin', action: '添加用户', time: '2024-04-01 12:15:22' },
                      { user: 'manager', action: '查看客户信息', time: '2024-04-01 11:45:01' }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <span>{item.user}</span>
                        <span>{item.action}</span>
                        <span>{item.time}</span>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
            
            <Card title="IP白名单" style={{ marginTop: '16px' }}>
              <Form layout="inline">
                <Form.Item label="IP地址">
                  <Input placeholder="输入允许访问的IP地址" />
                </Form.Item>
                <Form.Item label="描述">
                  <Input placeholder="描述" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary">添加</Button>
                </Form.Item>
              </Form>
              
              <Table
                style={{ marginTop: '16px' }}
                columns={[
                  { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
                  { title: '描述', dataIndex: 'description', key: 'description' },
                  { title: '添加时间', dataIndex: 'addTime', key: 'addTime' },
                  { title: '操作', key: 'action', render: () => <Button type="link" danger>删除</Button> }
                ]}
                dataSource={[
                  { id: 1, ip: '192.168.1.0/24', description: '内部网络', addTime: '2024-03-15 09:00:00' },
                  { id: 2, ip: '10.0.0.0/8', description: '公司VPN', addTime: '2024-03-15 09:00:00' }
                ]}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </div>
        );
        
      default:
        return <div>请从左侧菜单选择功能</div>;
    }
  };

  const filterLogs = (logs) => {
    return logs.filter(log => {
      const levelMatch = logFilter.level === 'all' || log.level === logFilter.level;
      const sourceMatch = logFilter.source === 'all' || log.source === logFilter.source;
      const dateMatch = !logFilter.dateRange || 
        (moment(log.time).isSameOrAfter(logFilter.dateRange[0], 'day') && 
         moment(log.time).isSameOrBefore(logFilter.dateRange[1], 'day'));
      
      return levelMatch && sourceMatch && dateMatch;
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography.Text strong style={{ color: '#fff' }}>系统管理控制台</Typography.Text>
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
            <span style={{ marginRight: 12 }}>欢迎，{user?.name || '管理员'}</span>
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
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" />
            </div>
          ) : renderContent()}
        </Content>
      </Layout>

      <Modal
        title="用户信息"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select>
                  <Option value="admin">系统管理员</Option>
                  <Option value="manager">客户经理</Option>
                  <Option value="risk">风控人员</Option>
                  <Option value="compliance">合规人员</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请输入部门' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="在线" unCheckedChildren="离线" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard; 