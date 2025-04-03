import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, InputNumber, Table, Modal, Typography, notification, Tag, Row, Col, Divider } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { mockRecommendationRequests, mockRecommendations } from '../../mock/mockData';
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Storage keys
const STORAGE_KEYS = {
  REQUESTS: 'client_recommendation_requests',
  RECOMMENDATIONS: 'client_recommendations'
};

const RecommendationRequest = () => {
  const [form] = Form.useForm();
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecommendationModalVisible, setIsRecommendationModalVisible] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  // 模拟客户数据
  const clientData = {
    id: 1,
    name: '张三',
    riskLevel: '稳健型',
    totalAssets: 1500000
  };

  useEffect(() => {
    // 从localStorage获取持久化数据，如果没有则从模拟数据获取
    const storedRequests = getLocalStorageItem(STORAGE_KEYS.REQUESTS);
    const storedRecommendations = getLocalStorageItem(STORAGE_KEYS.RECOMMENDATIONS);
    
    if (storedRequests) {
      setRequests(storedRequests);
    } else {
      // 从模拟数据获取当前客户的推荐请求
      const clientRequests = mockRecommendationRequests.filter(req => req.clientId === clientData.id);
      setRequests(clientRequests);
      // 存储到localStorage
      setLocalStorageItem(STORAGE_KEYS.REQUESTS, clientRequests);
    }

    if (storedRecommendations) {
      setRecommendations(storedRecommendations);
    } else {
      // 获取当前客户的推荐
      const clientRecommendations = mockRecommendations.filter(rec => rec.clientId === clientData.id);
      setRecommendations(clientRecommendations);
      // 存储到localStorage
      setLocalStorageItem(STORAGE_KEYS.RECOMMENDATIONS, clientRecommendations);
    }
  }, []);

  // 更新状态并保存到localStorage的辅助函数
  const updateAndSaveRequests = (newRequests) => {
    setRequests(newRequests);
    setLocalStorageItem(STORAGE_KEYS.REQUESTS, newRequests);
  };

  const updateAndSaveRecommendations = (newRecommendations) => {
    setRecommendations(newRecommendations);
    setLocalStorageItem(STORAGE_KEYS.RECOMMENDATIONS, newRecommendations);
  };

  const handleSubmit = (values) => {
    setLoading(true);
    
    // 创建一个新请求对象
    const newRequest = {
      id: requests.length + 1,
      requestId: `R${moment().format('YYYYMMDDHHmm')}${Math.floor(Math.random() * 1000)}`,
      clientId: clientData.id,
      clientName: clientData.name,
      riskLevel: clientData.riskLevel,
      totalAssets: clientData.totalAssets,
      requestType: values.requestType,
      investmentGoal: values.investmentGoal,
      preferredProducts: values.preferredProducts,
      investmentAmount: values.investmentAmount,
      remarks: values.remarks,
      status: '处理中',
      managerId: 'U00012345678', // 假设这是客户的经理ID
      managerName: '周经理',
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    // 将新请求添加到列表中并保存到localStorage
    const updatedRequests = [newRequest, ...requests];
    updateAndSaveRequests(updatedRequests);
    
    // 重置表单并关闭模态框
    form.resetFields();
    setIsModalVisible(false);
    setLoading(false);
    
    // 显示成功通知
    notification.success({
      message: '推荐请求已提交',
      description: '您的投资推荐请求已成功提交，客户经理将尽快处理。',
    });
  };

  const viewRecommendation = (record) => {
    // 查找对应的推荐
    const recommendation = recommendations.find(rec => rec.requestId === record.requestId);
    if (recommendation) {
      setCurrentRecommendation(recommendation);
      setIsRecommendationModalVisible(true);
    } else {
      notification.info({
        message: '推荐尚未生成',
        description: '客户经理正在处理您的请求，推荐方案尚未生成。',
      });
    }
  };

  const acceptRecommendation = () => {
    if (currentRecommendation) {
      // 在实际应用中，这里应该调用API将接受的推荐转换为交易
      // 为模拟目的，我们只更新本地状态
      const updatedRecommendations = recommendations.map(rec => {
        if (rec.recommendationId === currentRecommendation.recommendationId) {
          return {
            ...rec,
            status: '已接受',
            clientResponseTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
          };
        }
        return rec;
      });
      
      // 更新状态并保存到localStorage
      updateAndSaveRecommendations(updatedRecommendations);
      setIsRecommendationModalVisible(false);
      
      // 找到对应的请求并更新状态
      const updatedRequests = requests.map(req => {
        if (req.requestId === currentRecommendation.requestId) {
          return {
            ...req,
            status: '已处理'
          };
        }
        return req;
      });
      updateAndSaveRequests(updatedRequests);
      
      notification.success({
        message: '已接受推荐',
        description: '您已成功接受投资推荐，系统将自动生成交易申请。',
      });
    }
  };

  const rejectRecommendation = () => {
    if (currentRecommendation) {
      // 在实际应用中，这里应该调用API更新推荐状态
      // 为模拟目的，我们只更新本地状态
      const updatedRecommendations = recommendations.map(rec => {
        if (rec.recommendationId === currentRecommendation.recommendationId) {
          return {
            ...rec,
            status: '已拒绝',
            clientResponseTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
          };
        }
        return rec;
      });
      
      // 更新状态并保存到localStorage
      updateAndSaveRecommendations(updatedRecommendations);
      setIsRecommendationModalVisible(false);
      
      notification.info({
        message: '已拒绝推荐',
        description: '您已拒绝当前投资推荐，可以与客户经理联系讨论其他投资选择。',
      });
    }
  };

  const requestColumns = [
    {
      title: '请求编号',
      dataIndex: 'requestId',
      key: 'requestId',
    },
    {
      title: '请求类型',
      dataIndex: 'requestType',
      key: 'requestType',
    },
    {
      title: '投资目标',
      dataIndex: 'investmentGoal',
      key: 'investmentGoal',
    },
    {
      title: '投资金额',
      dataIndex: 'investmentAmount',
      key: 'investmentAmount',
      render: (text) => `¥${text.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === '已处理' ? 'green' : 'blue'} icon={text === '已处理' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {text}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => viewRecommendation(record)} 
          disabled={record.status === '处理中'}
        >
          查看推荐
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>投资推荐</Title>
      
      <Card style={{ marginBottom: '20px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: '16px' }}
        >
          新建推荐请求
        </Button>
        
        <Table 
          columns={requestColumns} 
          dataSource={requests} 
          rowKey="requestId"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* 新建请求模态框 */}
      <Modal
        title="新建投资推荐请求"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            requestType: '投资咨询',
            preferredProducts: ['基金', '理财产品'],
          }}
        >
          <Form.Item
            name="requestType"
            label="请求类型"
            rules={[{ required: true, message: '请选择请求类型' }]}
          >
            <Select>
              <Option value="投资咨询">投资咨询</Option>
              <Option value="产品咨询">产品咨询</Option>
              <Option value="投资组合调整">投资组合调整</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="investmentGoal"
            label="投资目标"
            rules={[{ required: true, message: '请输入投资目标' }]}
          >
            <Select>
              <Option value="稳定收益">稳定收益</Option>
              <Option value="保本增值">保本增值</Option>
              <Option value="高收益">高收益</Option>
              <Option value="均衡增长">均衡增长</Option>
              <Option value="现金管理">现金管理</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="preferredProducts"
            label="偏好产品类型"
            rules={[{ required: true, message: '请选择偏好产品类型' }]}
          >
            <Select mode="multiple">
              <Option value="基金">基金</Option>
              <Option value="股票">股票</Option>
              <Option value="理财产品">理财产品</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="investmentAmount"
            label="计划投资金额 (元)"
            rules={[{ required: true, message: '请输入计划投资金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\¥\s?|(,*)/g, '')}
              min={10000}
              max={10000000}
              step={10000}
            />
          </Form.Item>
          
          <Form.Item
            name="remarks"
            label="备注说明"
          >
            <TextArea rows={4} placeholder="请输入您的具体需求和偏好..." />
          </Form.Item>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 推荐详情模态框 */}
      <Modal
        title="投资推荐详情"
        open={isRecommendationModalVisible}
        onCancel={() => setIsRecommendationModalVisible(false)}
        footer={
          currentRecommendation && currentRecommendation.status === '待响应' ? [
            <Button key="reject" onClick={rejectRecommendation}>拒绝</Button>,
            <Button key="accept" type="primary" onClick={acceptRecommendation}>接受并创建交易</Button>,
          ] : [
            <Button key="close" onClick={() => setIsRecommendationModalVisible(false)}>关闭</Button>
          ]
        }
        width={800}
      >
        {currentRecommendation && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Row>
                <Col span={12}>
                  <Text strong>推荐编号：</Text> {currentRecommendation.recommendationId}
                </Col>
                <Col span={12}>
                  <Text strong>状态：</Text> 
                  <Tag color={
                    currentRecommendation.status === '已接受' ? 'green' : 
                    currentRecommendation.status === '已拒绝' ? 'red' : 'blue'
                  }>
                    {currentRecommendation.status}
                  </Tag>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={12}>
                  <Text strong>客户经理：</Text> {currentRecommendation.managerName}
                </Col>
                <Col span={12}>
                  <Text strong>创建时间：</Text> {currentRecommendation.createTime}
                </Col>
              </Row>
            </div>
            
            <Divider>推荐产品</Divider>
            
            {currentRecommendation.recommendedProducts.map((product, index) => (
              <Card key={index} style={{ marginBottom: '16px' }} type="inner" title={`${product.productName} (${product.productType})`}>
                <Row>
                  <Col span={12}>
                    <Text strong>推荐金额：</Text> ¥{product.recommendedAmount.toLocaleString()}
                  </Col>
                </Row>
                <div style={{ marginTop: '10px' }}>
                  <Text strong>推荐理由：</Text>
                  <p>{product.recommendationReason}</p>
                </div>
              </Card>
            ))}
          </>
        )}
      </Modal>
    </div>
  );
};

export default RecommendationRequest; 