import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, List, Tag, Typography, Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import { market, risk, portfolio } from '../../api';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalystDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [marketData, setMarketData] = useState(null);
  const [analysisReports, setAnalysisReports] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [marketResponse, reportsResponse] = await Promise.all([
        market.getMarketData(),
        // 这里需要添加获取分析报告的 API
        Promise.resolve([])
      ]);
      setMarketData(marketResponse);
      setAnalysisReports(reportsResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const reportColumns = [
    {
      title: '报告编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '报告类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '生成日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '市场趋势',
      dataIndex: 'marketTrend',
      key: 'marketTrend',
      render: (trend) => (
        <Tag color={
          trend === 'up' ? 'green' :
          trend === 'down' ? 'red' :
          'orange'
        }>
          {trend === 'up' ? '上涨' :
           trend === 'down' ? '下跌' :
           '震荡'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status === 'completed' ? '已完成' : '生成中'}
        </Tag>
      )
    }
  ];

  const handleCreateReport = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // 这里添加创建报告的逻辑
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>分析师控制台</Title>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="市场概览">
            <List
              dataSource={[
                { label: '上证指数', value: marketData?.shanghaiIndex },
                { label: '深证成指', value: marketData?.shenzhenIndex },
                { label: '市场趋势', value: marketData?.marketTrend },
                { label: '成交量', value: marketData?.volume }
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
      </Row>

      <Card title="分析报告" style={{ marginTop: '16px' }}>
        <Button type="primary" onClick={handleCreateReport} style={{ marginBottom: '16px' }}>
          创建新报告
        </Button>
        <Table
          columns={reportColumns}
          dataSource={analysisReports}
          rowKey="id"
        />
      </Card>

      <Modal
        title="创建新报告"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="reportType"
            label="报告类型"
            rules={[{ required: true, message: '请选择报告类型' }]}
          >
            <Select>
              <Select.Option value="market">市场分析报告</Select.Option>
              <Select.Option value="sector">行业分析报告</Select.Option>
              <Select.Option value="stock">个股分析报告</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="分析周期"
            rules={[{ required: true, message: '请选择分析周期' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            name="target"
            label="分析目标"
            rules={[{ required: true, message: '请输入分析目标' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="报告描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AnalystDashboard; 