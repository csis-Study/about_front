import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Select, Input, InputNumber, Tag, Typography, Row, Col, Divider, notification } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
import { mockRecommendationRequests, mockRecommendations, mockProducts } from '../../mock/mockData';
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Storage keys
const STORAGE_KEYS = {
  MANAGER_REQUESTS: 'manager_recommendation_requests',
  MANAGER_RECOMMENDATIONS: 'manager_recommendations',
  PRODUCTS: 'available_products'
};

const ProductRecommendation = () => {
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟客户经理数据
  const managerData = {
    id: 'U00012345678',
    name: '周经理'
  };

  useEffect(() => {
    // 从localStorage获取持久化数据，如果没有则从模拟数据获取
    const storedRequests = getLocalStorageItem(STORAGE_KEYS.MANAGER_REQUESTS);
    const storedRecommendations = getLocalStorageItem(STORAGE_KEYS.MANAGER_RECOMMENDATIONS);
    const storedProducts = getLocalStorageItem(STORAGE_KEYS.PRODUCTS);
    
    if (storedRequests) {
      setRequests(storedRequests);
    } else {
      // 获取该客户经理负责的推荐请求
      const managerRequests = mockRecommendationRequests.filter(req => req.managerId === managerData.id);
      setRequests(managerRequests);
      // 存储到localStorage
      setLocalStorageItem(STORAGE_KEYS.MANAGER_REQUESTS, managerRequests);
    }

    if (storedRecommendations) {
      setRecommendations(storedRecommendations);
    } else {
      // 获取该客户经理创建的推荐
      const managerRecommendations = mockRecommendations.filter(rec => rec.managerId === managerData.id);
      setRecommendations(managerRecommendations);
      // 存储到localStorage
      setLocalStorageItem(STORAGE_KEYS.MANAGER_RECOMMENDATIONS, managerRecommendations);
    }

    if (storedProducts) {
      setProducts(storedProducts);
    } else {
      // 获取所有产品
      const allProducts = [
        ...mockProducts.funds.map(fund => ({...fund, type: '基金'})),
        ...mockProducts.stocks.map(stock => ({...stock, type: '股票'})),
        ...mockProducts.financialProducts.map(product => ({...product, type: '理财产品'}))
      ];
      setProducts(allProducts);
      // 存储到localStorage
      setLocalStorageItem(STORAGE_KEYS.PRODUCTS, allProducts);
    }
  }, []);

  // 更新状态并保存到localStorage的辅助函数
  const updateAndSaveRequests = (newRequests) => {
    setRequests(newRequests);
    setLocalStorageItem(STORAGE_KEYS.MANAGER_REQUESTS, newRequests);
  };

  const updateAndSaveRecommendations = (newRecommendations) => {
    setRecommendations(newRecommendations);
    setLocalStorageItem(STORAGE_KEYS.MANAGER_RECOMMENDATIONS, newRecommendations);
  };

  // 同时更新客户端的推荐请求状态（为了保持一致性）
  const updateClientRequests = (requestId, newStatus) => {
    const clientRequests = getLocalStorageItem('client_recommendation_requests');
    if (clientRequests) {
      const updatedClientRequests = clientRequests.map(req => {
        if (req.requestId === requestId) {
          return { ...req, status: newStatus };
        }
        return req;
      });
      setLocalStorageItem('client_recommendation_requests', updatedClientRequests);
    }
  };

  // 同步创建的推荐到客户端的推荐列表
  const syncRecommendationToClient = (newRecommendation) => {
    const clientRecommendations = getLocalStorageItem('client_recommendations') || [];
    const updatedClientRecommendations = [newRecommendation, ...clientRecommendations];
    setLocalStorageItem('client_recommendations', updatedClientRecommendations);
  };

  const handleCreateRecommendation = (request) => {
    setCurrentRequest(request);
    setRecommendProducts([{ key: Date.now() }]); // 初始化一个空的推荐产品
    setIsModalVisible(true);
    
    // 根据客户风险等级和偏好预先筛选适合的产品
    const filteredProducts = filterProductsByClientPreference(request);
    
    // 设置表单初始值
    form.setFieldsValue({
      requestId: request.requestId,
      clientId: request.clientId,
      clientName: request.clientName
    });
  };

  // 根据客户风险等级和偏好筛选适合的产品
  const filterProductsByClientPreference = (request) => {
    let riskLevelMapping = {
      '保守型': '低',
      '稳健型': '中',
      '进取型': '高'
    };
    
    let clientRiskLevel = riskLevelMapping[request.riskLevel] || '中';
    
    // 这里简单实现筛选逻辑，实际场景可能更复杂
    return products.filter(product => {
      // 根据客户偏好的产品类型筛选
      if (!request.preferredProducts.includes(product.type)) {
        return false;
      }
      
      // 根据风险等级筛选（保守型客户只推荐低风险，稳健型可推荐低中风险，进取型可推荐所有）
      if (request.riskLevel === '保守型' && product.riskLevel !== '低') {
        return false;
      } else if (request.riskLevel === '稳健型' && product.riskLevel === '高') {
        return false;
      }
      
      return true;
    });
  };

  const addRecommendProduct = () => {
    setRecommendProducts([...recommendProducts, { key: Date.now() }]);
  };

  const removeRecommendProduct = (key) => {
    const newProducts = recommendProducts.filter(item => item.key !== key);
    setRecommendProducts(newProducts);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 创建新的推荐对象
      const recommendId = `PR${moment().format('YYYYMMDDHHmm')}${Math.floor(Math.random() * 1000)}`;
      
      // 处理推荐产品
      const recommendedProducts = values.products.map(product => {
        const selectedProduct = products.find(p => p.id === product.productId);
        return {
          productId: product.productId,
          productName: selectedProduct ? selectedProduct.name : '未知产品',
          productType: selectedProduct ? selectedProduct.type : '未知类型',
          recommendedAmount: product.amount,
          recommendationReason: product.reason
        };
      });
      
      const newRecommendation = {
        id: recommendations.length + 1,
        recommendationId: recommendId,
        requestId: currentRequest.requestId,
        clientId: currentRequest.clientId,
        clientName: currentRequest.clientName,
        managerId: managerData.id,
        managerName: managerData.name,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: '待响应',
        clientResponseTime: null,
        recommendedProducts: recommendedProducts
      };
      
      // 更新推荐列表
      const updatedRecommendations = [newRecommendation, ...recommendations];
      updateAndSaveRecommendations(updatedRecommendations);
      
      // 同步推荐到客户端
      syncRecommendationToClient(newRecommendation);
      
      // 更新请求状态
      const updatedRequests = requests.map(req => {
        if (req.requestId === currentRequest.requestId) {
          return {
            ...req,
            status: '已处理',
            updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
          };
        }
        return req;
      });
      updateAndSaveRequests(updatedRequests);
      
      // 更新客户端的请求状态
      updateClientRequests(currentRequest.requestId, '已处理');
      
      // 关闭模态框并重置表单
      setIsModalVisible(false);
      setRecommendProducts([]);
      form.resetFields();
      setLoading(false);
      
      // 显示成功通知
      notification.success({
        message: '产品推荐已发送',
        description: `成功为客户 ${currentRequest.clientName} 创建产品推荐。`,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const requestColumns = [
    {
      title: '请求编号',
      dataIndex: 'requestId',
      key: 'requestId',
    },
    {
      title: '客户姓名',
      dataIndex: 'clientName',
      key: 'clientName',
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
          type="primary" 
          icon={<SendOutlined />} 
          onClick={() => handleCreateRecommendation(record)}
          disabled={record.status === '已处理'}
        >
          创建推荐
        </Button>
      ),
    },
  ];

  const recommendationColumns = [
    {
      title: '推荐编号',
      dataIndex: 'recommendationId',
      key: 'recommendationId',
    },
    {
      title: '请求编号',
      dataIndex: 'requestId',
      key: 'requestId',
    },
    {
      title: '客户姓名',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '推荐产品数',
      key: 'productCount',
      render: (_, record) => record.recommendedProducts.length,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={
          text === '已接受' ? 'green' : 
          text === '已拒绝' ? 'red' : 
          'blue'
        }>
          {text}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '客户响应时间',
      dataIndex: 'clientResponseTime',
      key: 'clientResponseTime',
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => viewRecommendationDetails(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const viewRecommendationDetails = (record) => {
    Modal.info({
      title: '推荐详情',
      width: 700,
      content: (
        <div style={{ marginTop: '20px' }}>
          <Row>
            <Col span={12}>
              <Text strong>推荐编号：</Text> {record.recommendationId}
            </Col>
            <Col span={12}>
              <Text strong>请求编号：</Text> {record.requestId}
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={12}>
              <Text strong>客户姓名：</Text> {record.clientName}
            </Col>
            <Col span={12}>
              <Text strong>状态：</Text> 
              <Tag color={
                record.status === '已接受' ? 'green' : 
                record.status === '已拒绝' ? 'red' : 
                'blue'
              }>
                {record.status}
              </Tag>
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={12}>
              <Text strong>创建时间：</Text> {record.createTime}
            </Col>
            <Col span={12}>
              <Text strong>客户响应时间：</Text> {record.clientResponseTime || '-'}
            </Col>
          </Row>
          
          <Divider>推荐产品</Divider>
          
          {record.recommendedProducts.map((product, index) => (
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
        </div>
      ),
      okText: '关闭',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>产品推荐管理</Title>
      
      <Card title="待处理推荐请求" style={{ marginBottom: '20px' }}>
        <Table 
          columns={requestColumns} 
          dataSource={requests.filter(req => req.status === '处理中')} 
          rowKey="requestId"
          pagination={{ pageSize: 5 }}
        />
      </Card>
      
      <Card title="我的推荐记录">
        <Table 
          columns={recommendationColumns} 
          dataSource={recommendations} 
          rowKey="recommendationId"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* 创建推荐模态框 */}
      <Modal
        title="创建产品推荐"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setRecommendProducts([]);
          form.resetFields();
        }}
        onOk={handleModalOk}
        width={800}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="requestId"
                label="请求编号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="clientId"
                label="客户ID"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="clientName"
                label="客户姓名"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          {currentRequest && (
            <Card style={{ marginBottom: '20px' }} type="inner" title="客户情况">
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>风险等级：</Text> 
                  <Tag color={
                    currentRequest.riskLevel === '进取型' ? 'red' : 
                    currentRequest.riskLevel === '稳健型' ? 'blue' : 
                    'green'
                  }>
                    {currentRequest.riskLevel}
                  </Tag>
                </Col>
                <Col span={8}>
                  <Text strong>投资目标：</Text> {currentRequest.investmentGoal}
                </Col>
                <Col span={8}>
                  <Text strong>投资金额：</Text> ¥{currentRequest.investmentAmount.toLocaleString()}
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={24}>
                  <Text strong>偏好产品类型：</Text> 
                  {currentRequest.preferredProducts.map(type => (
                    <Tag key={type} style={{ marginLeft: '8px' }}>{type}</Tag>
                  ))}
                </Col>
              </Row>
              {currentRequest.remarks && (
                <Row style={{ marginTop: '10px' }}>
                  <Col span={24}>
                    <Text strong>客户备注：</Text>
                    <Paragraph>{currentRequest.remarks}</Paragraph>
                  </Col>
                </Row>
              )}
            </Card>
          )}
          
          <Divider>推荐产品</Divider>
          
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {recommendProducts.map((product, index) => (
                  <Card 
                    key={product.key} 
                    style={{ marginBottom: '16px' }}
                    extra={
                      recommendProducts.length > 1 ? (
                        <Button 
                          danger
                          onClick={() => {
                            removeRecommendProduct(product.key);
                            remove(index);
                          }}
                        >
                          移除
                        </Button>
                      ) : null
                    }
                  >
                    <Form.Item
                      name={[index, 'productId']}
                      label="选择产品"
                      rules={[{ required: true, message: '请选择产品' }]}
                    >
                      <Select 
                        showSearch
                        placeholder="选择产品"
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {products.map(product => (
                          <Option key={product.id} value={product.id}>
                            {`${product.name} (${product.type}, 风险等级: ${product.riskLevel})`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      name={[index, 'amount']}
                      label="推荐投资金额 (元)"
                      rules={[{ required: true, message: '请输入推荐投资金额' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                        min={10000}
                        max={currentRequest ? currentRequest.investmentAmount : 10000000}
                      />
                    </Form.Item>
                    
                    <Form.Item
                      name={[index, 'reason']}
                      label="推荐理由"
                      rules={[{ required: true, message: '请输入推荐理由' }]}
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="请详细说明为什么推荐该产品给客户..."
                      />
                    </Form.Item>
                  </Card>
                ))}
                
                <Button 
                  type="dashed" 
                  onClick={() => {
                    addRecommendProduct();
                    add();
                  }} 
                  block
                  style={{ marginBottom: '20px' }}
                >
                  + 添加推荐产品
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductRecommendation; 