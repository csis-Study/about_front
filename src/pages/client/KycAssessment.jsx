import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Radio, Select, InputNumber, Typography, Row, Col, Steps, Divider, Modal, notification, Progress } from 'antd';
import { UserOutlined, SafetyOutlined, BankOutlined, AreaChartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { mockClients, mockKycRecords } from '../../mock/mockData';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const KycAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const [basicInfoForm] = Form.useForm();
  const [investmentForm] = Form.useForm();
  const [riskAssessmentForm] = Form.useForm();
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [kycRecords, setKycRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isKycExpired, setIsKycExpired] = useState(false);

  // 模拟客户数据
  const clientData = {
    id: 1,
    name: '张三',
    riskLevel: '稳健型',
    totalAssets: 1500000
  };

  useEffect(() => {
    // 从模拟数据获取当前客户的KYC记录
    const clientKycRecords = mockKycRecords.filter(record => record.clientId === clientData.id);
    setKycRecords(clientKycRecords);
    
    // 检查KYC是否过期
    const latestKyc = clientKycRecords.length > 0 ? 
      clientKycRecords.sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))[0] : 
      null;
    
    if (latestKyc) {
      const isExpired = moment(latestKyc.nextAssessmentDate).isBefore(moment());
      setIsKycExpired(isExpired);
    } else {
      setIsKycExpired(true); // 如果没有KYC记录，也视为需要进行评估
    }
    
    // 如果有最新的KYC记录，预填表单
    if (latestKyc) {
      const client = mockClients.find(client => client.id === clientData.id) || {};
      
      basicInfoForm.setFieldsValue({
        name: client.name,
        phoneNumber: client.phoneNumber,
        email: client.email || '',
        investmentExperience: latestKyc.investmentExperience,
        incomeLevel: latestKyc.incomeLevel
      });
      
      investmentForm.setFieldsValue({
        liquidAssets: latestKyc.liquidAssets,
        investmentGoals: latestKyc.investmentGoals,
        investmentHorizon: latestKyc.investmentHorizon
      });
      
      riskAssessmentForm.setFieldsValue({
        riskTolerance: latestKyc.riskTolerance,
        incomeNeeds: latestKyc.incomeNeeds || '不需要',
        emergencyFunds: latestKyc.emergencyFunds || '是',
        investmentLossTolerance: latestKyc.investmentLossTolerance || '最多10%'
      });
    }
  }, []);

  const handleNext = async () => {
    try {
      let values;
      
      switch (currentStep) {
        case 0:
          values = await basicInfoForm.validateFields();
          setFormData({ ...formData, ...values });
          break;
        case 1:
          values = await investmentForm.validateFields();
          setFormData({ ...formData, ...values });
          break;
        case 2:
          values = await riskAssessmentForm.validateFields();
          setFormData({ ...formData, ...values });
          setLoading(true);
          
          // 模拟提交评估，实际应该调用API
          setTimeout(() => {
            // 计算风险评分和等级
            const result = calculateRiskLevel({ ...formData, ...values });
            setAssessmentResult(result);
            setIsResultModalVisible(true);
            setLoading(false);
          }, 1500);
          return;
        default:
          break;
      }
      
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 计算风险等级
  const calculateRiskLevel = (data) => {
    // 简单的风险评分算法，实际情况下应该更复杂
    let score = 0;
    
    // 投资经验得分
    switch (data.investmentExperience) {
      case '无经验':
        score += 5;
        break;
      case '1-3年':
        score += 15;
        break;
      case '3-5年':
        score += 25;
        break;
      case '5年以上':
        score += 35;
        break;
      default:
        score += 5;
    }
    
    // 投资期限得分
    switch (data.investmentHorizon) {
      case '1年以内':
        score += 5;
        break;
      case '1-3年':
        score += 15;
        break;
      case '3-5年':
        score += 25;
        break;
      case '5年以上':
        score += 35;
        break;
      default:
        score += 5;
    }
    
    // 风险容忍度得分
    switch (data.riskTolerance) {
      case '低':
        score += 10;
        break;
      case '中等':
        score += 25;
        break;
      case '高':
        score += 40;
        break;
      default:
        score += 10;
    }
    
    // 投资损失容忍度得分
    switch (data.investmentLossTolerance) {
      case '不能接受任何损失':
        score += 5;
        break;
      case '最多5%':
        score += 15;
        break;
      case '最多10%':
        score += 25;
        break;
      case '最多20%':
        score += 35;
        break;
      case '可以接受20%以上':
        score += 45;
        break;
      default:
        score += 5;
    }
    
    // 根据得分确定风险等级
    let riskLevel;
    if (score < 50) {
      riskLevel = '保守型';
    } else if (score < 100) {
      riskLevel = '稳健型';
    } else {
      riskLevel = '进取型';
    }
    
    return {
      score,
      riskLevel,
      assessmentDate: moment().format('YYYY-MM-DD'),
      nextAssessmentDate: moment().add(1, 'year').format('YYYY-MM-DD')
    };
  };

  const handleModalOk = () => {
    // 在实际应用中，这里应该调用API保存KYC结果
    setIsResultModalVisible(false);
    
    // 创建新的KYC记录
    const newKycRecord = {
      id: kycRecords.length + 1,
      kycId: `KYC${moment().format('YYYYMMDDHHmm')}${Math.floor(Math.random() * 1000)}`,
      clientId: clientData.id,
      clientName: clientData.name,
      assessmentDate: assessmentResult.assessmentDate,
      nextAssessmentDate: assessmentResult.nextAssessmentDate,
      initialRiskLevel: clientData.riskLevel,
      finalRiskLevel: assessmentResult.riskLevel,
      investmentExperience: formData.investmentExperience,
      incomeLevel: formData.incomeLevel,
      liquidAssets: formData.liquidAssets,
      investmentGoals: formData.investmentGoals,
      investmentHorizon: formData.investmentHorizon,
      riskTolerance: formData.riskTolerance,
      status: '已完成',
      assessor: '自我评估',
      remarks: '客户自我评估完成的KYC'
    };
    
    // 更新本地KYC记录
    setKycRecords([newKycRecord, ...kycRecords]);
    setIsKycExpired(false);
    
    // 重置表单和步骤
    setCurrentStep(0);
    setFormData({});
    
    // 显示成功通知
    notification.success({
      message: 'KYC评估已完成',
      description: `您的风险评级为：${assessmentResult.riskLevel}，下次评估日期：${assessmentResult.nextAssessmentDate}`,
    });
  };

  // 渲染不同的表单步骤
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={basicInfoForm}
            layout="vertical"
          >
            <Title level={4}>基本信息</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label="联系电话"
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="电子邮箱"
                  rules={[
                    { type: 'email', message: '请输入有效的电子邮箱' }
                  ]}
                >
                  <Input placeholder="请输入电子邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="investmentExperience"
                  label="投资经验"
                  rules={[{ required: true, message: '请选择投资经验' }]}
                >
                  <Select placeholder="请选择投资经验">
                    <Option value="无经验">无经验</Option>
                    <Option value="1-3年">1-3年</Option>
                    <Option value="3-5年">3-5年</Option>
                    <Option value="5年以上">5年以上</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="incomeLevel"
              label="收入水平"
              rules={[{ required: true, message: '请选择收入水平' }]}
            >
              <Select placeholder="请选择收入水平">
                <Option value="低收入">低收入（年收入30万以下）</Option>
                <Option value="中等收入">中等收入（年收入30-100万）</Option>
                <Option value="高收入">高收入（年收入100万以上）</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 1:
        return (
          <Form
            form={investmentForm}
            layout="vertical"
          >
            <Title level={4}>投资情况</Title>
            <Form.Item
              name="liquidAssets"
              label="流动资产（元）"
              rules={[{ required: true, message: '请输入流动资产' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                min={0}
                step={100000}
              />
            </Form.Item>
            <Form.Item
              name="investmentGoals"
              label="投资目标"
              rules={[{ required: true, message: '请选择投资目标' }]}
            >
              <Select mode="multiple" placeholder="请选择投资目标（可多选）">
                <Option value="保本增值">保本增值</Option>
                <Option value="稳定收益">稳定收益</Option>
                <Option value="资产保值">资产保值</Option>
                <Option value="长期资本增值">长期资本增值</Option>
                <Option value="退休规划">退休规划</Option>
                <Option value="子女教育">子女教育</Option>
                <Option value="财富积累">财富积累</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="investmentHorizon"
              label="投资期限"
              rules={[{ required: true, message: '请选择投资期限' }]}
            >
              <Select placeholder="请选择投资期限">
                <Option value="1年以内">1年以内</Option>
                <Option value="1-3年">1-3年</Option>
                <Option value="3-5年">3-5年</Option>
                <Option value="5年以上">5年以上</Option>
              </Select>
            </Form.Item>
          </Form>
        );
      case 2:
        return (
          <Form
            form={riskAssessmentForm}
            layout="vertical"
          >
            <Title level={4}>风险评估</Title>
            <Form.Item
              name="riskTolerance"
              label="风险承受能力"
              rules={[{ required: true, message: '请选择风险承受能力' }]}
            >
              <Radio.Group>
                <Radio value="低">低（优先考虑本金安全）</Radio>
                <Radio value="中等">中等（平衡风险和收益）</Radio>
                <Radio value="高">高（追求高收益，能够承受较大风险）</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="incomeNeeds"
              label="是否需要从投资中获得定期收入？"
              rules={[{ required: true, message: '请选择是否需要定期收入' }]}
            >
              <Radio.Group>
                <Radio value="非常需要">非常需要</Radio>
                <Radio value="有一定需要">有一定需要</Radio>
                <Radio value="不需要">不需要</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="emergencyFunds"
              label="是否有足够的应急资金（至少能覆盖6个月生活费）？"
              rules={[{ required: true, message: '请选择是否有足够的应急资金' }]}
            >
              <Radio.Group>
                <Radio value="是">是</Radio>
                <Radio value="否">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="investmentLossTolerance"
              label="您能接受的最大投资损失是多少？"
              rules={[{ required: true, message: '请选择能接受的最大投资损失' }]}
            >
              <Radio.Group>
                <Radio value="不能接受任何损失">不能接受任何损失</Radio>
                <Radio value="最多5%">最多5%</Radio>
                <Radio value="最多10%">最多10%</Radio>
                <Radio value="最多20%">最多20%</Radio>
                <Radio value="可以接受20%以上">可以接受20%以上</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>KYC风险评估</Title>
      
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>KYC状态</Title>
          </div>
          <div>
            <Tag color={isKycExpired ? 'red' : 'green'} style={{ fontSize: '14px', padding: '4px 8px' }}>
              {isKycExpired ? 'KYC已过期' : 'KYC有效'}
            </Tag>
          </div>
        </div>
        
        {kycRecords.length > 0 ? (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>最近评估日期：</Text> {kycRecords[0].assessmentDate}
              </Col>
              <Col span={8}>
                <Text strong>下次评估日期：</Text> {kycRecords[0].nextAssessmentDate}
              </Col>
              <Col span={8}>
                <Text strong>当前风险等级：</Text> 
                <Tag color={
                  kycRecords[0].finalRiskLevel === '进取型' ? 'red' : 
                  kycRecords[0].finalRiskLevel === '稳健型' ? 'blue' : 
                  'green'
                }>
                  {kycRecords[0].finalRiskLevel}
                </Tag>
              </Col>
            </Row>
            {isKycExpired && (
              <div style={{ marginTop: '16px', color: 'red' }}>
                <Text strong>注意：</Text> 您的KYC评估已过期，请完成新的评估以确保账户合规和获取最适合的投资推荐。
              </div>
            )}
          </>
        ) : (
          <div>
            <Text>您尚未完成KYC评估，请立即进行评估以获取个性化的投资服务。</Text>
          </div>
        )}
        
        <div style={{ marginTop: '16px' }}>
          <Button type="primary" onClick={() => setCurrentStep(0)}>
            {kycRecords.length > 0 ? (isKycExpired ? '更新KYC评估' : '重新评估') : '开始KYC评估'}
          </Button>
        </div>
      </Card>
      
      {currentStep >= 0 && (
        <Card>
          <Steps current={currentStep} style={{ marginBottom: '24px' }}>
            <Step title="基本信息" icon={<UserOutlined />} />
            <Step title="投资情况" icon={<BankOutlined />} />
            <Step title="风险评估" icon={<SafetyOutlined />} />
          </Steps>
          
          <div style={{ padding: '24px 0' }}>
            {renderStepContent()}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            {currentStep > 0 && (
              <Button onClick={handlePrev}>
                上一步
              </Button>
            )}
            {currentStep === 0 && (
              <div></div> // 占位
            )}
            <Button 
              type="primary" 
              onClick={handleNext} 
              loading={loading}
            >
              {currentStep === 2 ? '提交评估' : '下一步'}
            </Button>
          </div>
        </Card>
      )}
      
      {/* 评估结果模态框 */}
      <Modal
        title="KYC评估结果"
        visible={isResultModalVisible}
        onOk={handleModalOk}
        okText="确认"
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        width={600}
      >
        {assessmentResult && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Progress
                type="dashboard"
                percent={Math.min(100, (assessmentResult.score / 160) * 100).toFixed(0)}
                format={() => `${assessmentResult.score}分`}
                strokeColor={
                  assessmentResult.riskLevel === '进取型' ? '#f5222d' : 
                  assessmentResult.riskLevel === '稳健型' ? '#1890ff' : 
                  '#52c41a'
                }
              />
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3} style={{ margin: 0 }}>风险等级评估结果</Title>
              <div style={{ marginTop: '16px' }}>
                <Tag 
                  color={
                    assessmentResult.riskLevel === '进取型' ? 'red' : 
                    assessmentResult.riskLevel === '稳健型' ? 'blue' : 
                    'green'
                  }
                  style={{ fontSize: '16px', padding: '8px 16px' }}
                >
                  {assessmentResult.riskLevel}
                </Tag>
              </div>
            </div>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>评估日期：</Text> {assessmentResult.assessmentDate}
              </Col>
              <Col span={12}>
                <Text strong>下次评估日期：</Text> {assessmentResult.nextAssessmentDate}
              </Col>
            </Row>
            
            <div style={{ marginTop: '24px' }}>
              <Title level={5}>风险等级说明</Title>
              {assessmentResult.riskLevel === '保守型' && (
                <Paragraph>
                  您的风险承受能力被评估为保守型。这意味着您更注重本金安全，适合投资于低风险的产品，如固定收益类产品、货币市场基金等。
                </Paragraph>
              )}
              {assessmentResult.riskLevel === '稳健型' && (
                <Paragraph>
                  您的风险承受能力被评估为稳健型。这意味着您能接受一定程度的投资波动，以获取相对较高的回报。适合投资于中低风险的产品组合，如平衡型基金、部分债券型基金和蓝筹股等。
                </Paragraph>
              )}
              {assessmentResult.riskLevel === '进取型' && (
                <Paragraph>
                  您的风险承受能力被评估为进取型。这意味着您能接受较大的投资波动，以追求长期高回报。适合投资于高风险高回报的产品，如股票型基金、个股、新兴市场投资等。
                </Paragraph>
              )}
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <Title level={5}>适合产品类型</Title>
              {assessmentResult.riskLevel === '保守型' && (
                <ul>
                  <li>货币市场基金</li>
                  <li>固定收益类理财产品</li>
                  <li>债券型基金</li>
                  <li>保本型结构性产品</li>
                </ul>
              )}
              {assessmentResult.riskLevel === '稳健型' && (
                <ul>
                  <li>债券型基金</li>
                  <li>混合型基金</li>
                  <li>稳健型理财产品</li>
                  <li>蓝筹股票</li>
                  <li>部分结构性产品</li>
                </ul>
              )}
              {assessmentResult.riskLevel === '进取型' && (
                <ul>
                  <li>股票型基金</li>
                  <li>个股投资</li>
                  <li>高收益债券基金</li>
                  <li>另类投资</li>
                  <li>高风险结构性产品</li>
                </ul>
              )}
            </div>
          </>
        )}
      </Modal>
      
      {/* KYC历史记录 */}
      {kycRecords.length > 0 && (
        <Card title="历史评估记录" style={{ marginTop: '20px' }}>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>评估日期</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>原风险等级</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>评估结果</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>评估人</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>下次评估日期</th>
                </tr>
              </thead>
              <tbody>
                {kycRecords.map((record, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>{record.assessmentDate}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <Tag color={
                        record.initialRiskLevel === '进取型' ? 'red' : 
                        record.initialRiskLevel === '稳健型' ? 'blue' : 
                        'green'
                      }>
                        {record.initialRiskLevel}
                      </Tag>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <Tag color={
                        record.finalRiskLevel === '进取型' ? 'red' : 
                        record.finalRiskLevel === '稳健型' ? 'blue' : 
                        'green'
                      }>
                        {record.finalRiskLevel}
                      </Tag>
                    </td>
                    <td style={{ padding: '12px 8px' }}>{record.assessor}</td>
                    <td style={{ padding: '12px 8px' }}>{record.nextAssessmentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default KycAssessment; 