import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Table, Tag, Typography, Button, Modal, Form, Input, Select, DatePicker, Statistic, Spin, List, Divider, Descriptions } from 'antd';
import { DashboardOutlined, UserOutlined, TeamOutlined, FileTextOutlined, FundOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const ManagerDashboard = () => {
  // 使用本地状态替代Redux
  const [user] = useState({ 
    username: '客户经理', 
    role: 'manager' 
  });
  
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentMenuKey, setCurrentMenuKey] = useState('dashboard');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟从API获取数据
      const clientsData = [
        {
          id: '1001',
          clientName: '张三',
          gender: '男',
          contactNumber: '13500000001',
          email: 'zhangsan@example.com',
          totalAssets: 2500000,
          riskLevel: '稳健型',
          lastContact: '2024-04-15',
          status: '活跃'
        },
        {
          id: '1002',
          clientName: '李四',
          gender: '男',
          contactNumber: '13500000002',
          email: 'lisi@example.com',
          totalAssets: 1800000,
          riskLevel: '保守型',
          lastContact: '2024-04-10',
          status: '活跃'
        },
        {
          id: '1003',
          clientName: '王五',
          gender: '男',
          contactNumber: '13500000003',
          email: 'wangwu@example.com',
          totalAssets: 3500000,
          riskLevel: '进取型',
          lastContact: '2024-04-05',
          status: '活跃'
        },
        {
          id: '1004',
          clientName: '赵六',
          gender: '女',
          contactNumber: '13500000004',
          email: 'zhaoliu@example.com',
          totalAssets: 1200000,
          riskLevel: '稳健型',
          lastContact: '2024-03-25',
          status: '非活跃'
        }
      ];
      
      const appointmentsData = [
        {
          id: '2001',
          clientId: '1001',
          clientName: '张三',
          appointmentTime: '2024-05-05 10:00:00',
          location: '公司会议室A',
          purpose: '投资组合审查',
          status: '已确认'
        },
        {
          id: '2002',
          clientId: '1002',
          clientName: '李四',
          appointmentTime: '2024-05-06 14:30:00',
          location: '线上会议',
          purpose: '风险评估更新',
          status: '待确认'
        },
        {
          id: '2003',
          clientId: '1003',
          clientName: '王五',
          appointmentTime: '2024-05-08 09:15:00',
          location: '客户办公室',
          purpose: '新产品介绍',
          status: '已确认'
        }
      ];
      
      const tasksData = [
        {
          id: '3001',
          title: '联系张三确认下周会议',
          dueDate: '2024-05-02',
          priority: '高',
          status: '未完成'
        },
        {
          id: '3002',
          title: '准备王五的投资方案',
          dueDate: '2024-05-03',
          priority: '高',
          status: '未完成'
        },
        {
          id: '3003',
          title: '赵六的风险评估更新',
          dueDate: '2024-05-04',
          priority: '中',
          status: '未完成'
        },
        {
          id: '3004',
          title: '市场月度报告分析',
          dueDate: '2024-05-10',
          priority: '中',
          status: '未完成'
        }
      ];
      
      setClients(clientsData);
      setAppointments(appointmentsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clientColumns = [
    {
      title: '客户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户姓名',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '联系电话',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: '总资产',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      render: (text) => `¥${text.toLocaleString()}`,
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (text) => (
        <Tag color={
          text === '进取型' ? 'red' : 
          text === '稳健型' ? 'blue' : 
          'green'
        }>
          {text}
        </Tag>
      ),
    },
    {
      title: '最近联系',
      dataIndex: 'lastContact',
      key: 'lastContact',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === '活跃' ? 'green' : 'orange'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" size="small" onClick={() => handleViewClient(record)}>
            查看
          </Button>
          <Button type="link" size="small">
            联系
          </Button>
        </>
      ),
    },
  ];

  const appointmentColumns = [
    {
      title: '预约编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户姓名',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '目的',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === '已确认' ? 'green' : 'blue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small" danger>
            取消
          </Button>
        </>
      ),
    },
  ];

  const taskColumns = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (text) => (
        <Tag color={
          text === '高' ? 'red' : 
          text === '中' ? 'orange' : 
          'green'
        }>
          {text}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === '已完成' ? 'green' : 'blue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" size="small">
            完成
          </Button>
          <Button type="link" size="small">
            编辑
          </Button>
        </>
      ),
    },
  ];

  const handleViewClient = (client) => {
    setCurrentRecord(client);
    setIsModalVisible(true);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: 'clients',
      icon: <TeamOutlined />,
      label: '客户管理',
    },
    {
      key: 'appointments',
      icon: <FileTextOutlined />,
      label: '预约管理',
    },
    {
      key: 'tasks',
      icon: <FileTextOutlined />,
      label: '任务管理',
    },
    {
      key: 'reports',
      icon: <FundOutlined />,
      label: '业绩报表',
    },
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
        return (
          <div className="dashboard-content">
            <Title level={3}>工作台</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="我的客户数"
                    value={clients.length}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="今日预约"
                    value={appointments.filter(appointment => 
                      moment(appointment.appointmentTime).isSame(moment(), 'day')
                    ).length}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="待办任务"
                    value={tasks.filter(task => task.status === '未完成').length}
                    valueStyle={{ color: tasks.filter(task => task.status === '未完成').length > 0 ? '#faad14' : '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="客户总资产"
                    value={clients.reduce((sum, client) => sum + client.totalAssets, 0)}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="¥"
                    suffix=""
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={16}>
                <Card title="今日预约" extra={<a href="#">查看全部</a>}>
                  <List
                    dataSource={appointments.filter(appointment => 
                      moment(appointment.appointmentTime).isSame(moment(), 'day')
                    )}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" size="small">详情</Button>,
                          <Button type="link" size="small">完成</Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={`${item.clientName} - ${item.purpose}`}
                          description={`时间: ${item.appointmentTime} | 地点: ${item.location}`}
                        />
                        <div>
                          <Tag color={item.status === '已确认' ? 'green' : 'blue'}>
                            {item.status}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                    locale={{ emptyText: '今日暂无预约' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="待办任务" extra={<a href="#">查看全部</a>}>
                  <List
                    dataSource={tasks.filter(task => task.status === '未完成')
                      .sort((a, b) => moment(a.dueDate).diff(moment(b.dueDate)))
                      .slice(0, 5)}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" size="small">完成</Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={`截止日期: ${item.dueDate}`}
                        />
                        <Tag color={
                          item.priority === '高' ? 'red' : 
                          item.priority === '中' ? 'orange' : 
                          'green'
                        }>
                          {item.priority}
                        </Tag>
                      </List.Item>
                    )}
                    locale={{ emptyText: '暂无待办任务' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        );
      
      case 'clients':
        return (
          <div className="clients-content">
            <Title level={3}>客户管理</Title>
            <Button type="primary" style={{ marginBottom: '16px' }}>
              添加客户
            </Button>
            <Table
              columns={clientColumns}
              dataSource={clients}
              rowKey="id"
            />
          </div>
        );
      
      case 'appointments':
        return (
          <div className="appointments-content">
            <Title level={3}>预约管理</Title>
            <Button type="primary" style={{ marginBottom: '16px' }}>
              新建预约
            </Button>
            <Table
              columns={appointmentColumns}
              dataSource={appointments}
              rowKey="id"
            />
          </div>
        );
      
      case 'tasks':
        return (
          <div className="tasks-content">
            <Title level={3}>任务管理</Title>
            <Button type="primary" style={{ marginBottom: '16px' }}>
              新建任务
            </Button>
            <Table
              columns={taskColumns}
              dataSource={tasks}
              rowKey="id"
            />
          </div>
        );
      
      case 'reports':
        return (
          <div className="reports-content">
            <Title level={3}>业绩报表</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="月度业绩统计">
                  <Statistic
                    title="新增客户数"
                    value={3}
                    prefix="+"
                    valueStyle={{ color: '#3f8600' }}
                  />
                  <Divider />
                  <Statistic
                    title="新增资产"
                    value={2500000}
                    prefix="¥"
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                  />
                  <Divider />
                  <Statistic
                    title="完成任务数"
                    value={15}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="客户净值变化">
                  <div style={{ height: 300, background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    此处将展示客户资产净值变化图表
                  </div>
                </Card>
              </Col>
            </Row>
            
            <Card title="业绩详情" style={{ marginTop: '16px' }}>
              <Table
                columns={[
                  { title: '月份', dataIndex: 'month', key: 'month' },
                  { title: '新增客户数', dataIndex: 'newClients', key: 'newClients' },
                  { title: '资产净流入', dataIndex: 'netAssetInflow', key: 'netAssetInflow', render: text => `¥${text.toLocaleString()}` },
                  { title: '客户满意度', dataIndex: 'satisfaction', key: 'satisfaction', render: text => `${text}%` },
                  { title: '业绩排名', dataIndex: 'ranking', key: 'ranking' }
                ]}
                dataSource={[
                  { key: 1, month: '2024-01', newClients: 2, netAssetInflow: 1800000, satisfaction: 96, ranking: 5 },
                  { key: 2, month: '2024-02', newClients: 1, netAssetInflow: 1200000, satisfaction: 95, ranking: 7 },
                  { key: 3, month: '2024-03', newClients: 3, netAssetInflow: 2500000, satisfaction: 97, ranking: 3 },
                  { key: 4, month: '2024-04', newClients: 2, netAssetInflow: 1500000, satisfaction: 98, ranking: 4 }
                ]}
                pagination={false}
              />
            </Card>
          </div>
        );
        
      default:
        return <div>请从左侧菜单选择功能</div>;
    }
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

      <Modal
        title="客户详情"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
          <Button key="edit" type="primary">
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentRecord && (
          <>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="客户ID">{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="客户姓名">{currentRecord.clientName}</Descriptions.Item>
              <Descriptions.Item label="性别">{currentRecord.gender}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentRecord.contactNumber}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱">{currentRecord.email}</Descriptions.Item>
              <Descriptions.Item label="总资产">¥{currentRecord.totalAssets?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="风险等级">
                <Tag color={
                  currentRecord.riskLevel === '进取型' ? 'red' : 
                  currentRecord.riskLevel === '稳健型' ? 'blue' : 
                  'green'
                }>
                  {currentRecord.riskLevel}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={currentRecord.status === '活跃' ? 'green' : 'orange'}>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="最近联系">{currentRecord.lastContact}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={5}>投资组合</Title>
            <Table
              columns={[
                { title: '产品代码', dataIndex: 'code', key: 'code' },
                { title: '产品名称', dataIndex: 'name', key: 'name' },
                { title: '投资金额', dataIndex: 'amount', key: 'amount', render: text => `¥${text.toLocaleString()}` },
                { title: '占比', dataIndex: 'percentage', key: 'percentage', render: text => `${text}%` },
                { title: '产品类型', dataIndex: 'type', key: 'type' }
              ]}
              dataSource={[
                { key: 1, code: 'P001', name: '安心收益债券基金', amount: 1000000, percentage: 40, type: '债券型' },
                { key: 2, code: 'P002', name: '稳健平衡混合基金', amount: 800000, percentage: 32, type: '混合型' },
                { key: 3, code: 'P003', name: '增长型多元资产基金', amount: 700000, percentage: 28, type: '混合型' }
              ]}
              pagination={false}
            />
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default ManagerDashboard; 