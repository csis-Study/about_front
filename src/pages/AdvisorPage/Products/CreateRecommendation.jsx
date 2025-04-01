import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Form, Input, Button, message, Spin, Table, Select, Modal} from 'antd';
import {value} from "lodash/seq";
import API_BASE_URL from "../../../api/config";


// 定义推荐方案创建组件
const CreateRecommendation = () => {
    const [products, setProducts] = useState([]);
    const { Option } = Select;
    // 设置加载状态
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState({
        title: '',
        description: '',
    });

    useEffect(() => {
        const recommendation = async () => {
            const value = 333;
            try {
                const response = await axios.get(`http://localhost:9003/recommendations/advisor/${value}`);
                // const response = await axios.get(`http://localhost:9003/recommendations/advisor/${value}`);

                if (response.status === 200) {
                    const data = await response.data.data;
                    console.log('返回值:', data);
                    setProducts(data);
                }
            } catch (err) {
                // message.error(`加载产品列表时出错：${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        recommendation();
    }, []);
    // 表单字段变化处理
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setRecommendation({
            ...recommendation,
            [name]: value,
        });
    };

    // 表单提交
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // 调用后端接口，提交推荐方案
            const response = await axios.post('/api/recommendation/Mg', values);

            if (response.status === 200) {
                message.success('推荐方案已成功创建！');
                setRecommendation({title: '', description: ''});
            }
        } catch (err) {
            message.error('创建推荐方案失败，请稍后重试。');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: '推荐单',
            dataIndex: 'recommendationId',
            key: 'recommendationId',
        },
        {
            title: '客户id',
            dataIndex: 'clientId',
            key: 'clientId',
        },
        {
            title: '产品经理',
            dataIndex: 'advisorId',
            key: 'advisorId',
        },
        {
            title: '创建类型',
            dataIndex: 'creatPer',
            key: 'creatPer',
        },
        {
            title: '接受情况',
            dataIndex: 'accepted',
            key: 'accepted',
            render: (accepted) => (accepted ? '接受' : '未接受'),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: '客户反馈',
            dataIndex: 'feedback',
            key: 'feedback',
        },
    ];
    const column = [
        {
            title: '推荐单项',
            dataIndex: 'itemId',
            key: 'itemId',
        },
        {
            title: '推荐单',
            dataIndex: 'recommendationId',
            key: 'recommendationId',
        },
        {
            title: '产品项',
            dataIndex: 'productItem',
            key: 'productItem',
        },
        {
            title: '操作类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '操作金额',
            dataIndex: 'amount',
            key: 'amount',
        }
    ];

    return (
        <div>
            <div>
                <Modal
                    title="添加产品"
                    // visible={addVisible}
                    // onOk={() => addForm.submit()}
                    // onCancel={() => setAddVisible(false)}
                >
                    <Form
                        // form={addForm}
                        name="productCreation"
                        // onFinish={onAddFinish}
                        initialValues={{
                            status: '有效'
                        }}
                    >
                        <Form.Item
                            name="productType"
                            label="产品类型"
                            rules={[{ required: true, message: '请选择产品类型' }]}
                        >
                            <Select placeholder="请选择产品类型">
                                <Option value="基金">基金</Option>
                                <Option value="理财">理财</Option>
                                <Option value="股票">股票</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="productName"
                            label="产品名称"
                        >
                            <Input placeholder="请输入产品名称" />
                        </Form.Item>
                        <Form.Item
                            name="netValue"
                            label="净值"
                            rules={[{ required: true, message: '请输入净值' }]}
                        >
                            <Input type="number" placeholder="请输入净值" />
                        </Form.Item>
                        <Form.Item
                            name="floatRate"
                            label="浮动利率"
                            rules={[{ required: true, message: '请输入浮动利率' }]}
                        >
                            <Input type="number" placeholder="请输入浮动利率" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="状态"
                        >
                            <Select placeholder="请选择状态">
                                <Option value="有效">有效</Option>
                                <Option value="无效">无效</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Table dataSource={products} columns={columns} title={() => '当前推荐单'}/>
                {/*<Table dataSource={dataSource1} columns={column} title={() =>'当前推荐单项'}/>*/}
            </div>
            <div style={{maxWidth: 600, margin: '0 auto', padding: '20px'}}>
                <h2 style={{textAlign: 'center'}}>新建推荐方案</h2>

                <Spin spinning={loading}>
                    <Form
                        name="createRecommendation"
                        layout="vertical"
                        initialValues={recommendation}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="方案标题"
                            name="title"
                            rules={[{required: true, message: '请输入方案标题!'}]}
                        >
                            <Input
                                value={recommendation.title}
                                onChange={handleInputChange}
                                name="title"
                                placeholder="请输入方案标题"
                            />
                        </Form.Item>

                        <Form.Item
                            label="方案描述"
                            name="description"
                            rules={[{required: true, message: '请输入方案描述!'}]}
                        >
                            <Input.TextArea
                                value={recommendation.description}
                                onChange={handleInputChange}
                                name="description"
                                placeholder="请输入方案描述"
                                rows={4}
                            />
                        </Form.Item>


                    </Form>
                </Spin>
            </div>
        </div>
    );
};

export default CreateRecommendation;
