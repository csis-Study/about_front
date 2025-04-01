import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Form, Input, Select, Button, Modal, Popconfirm, Card } from 'antd';

const { Option } = Select;

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingProduct, setEditingProduct] = useState(null);
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:9001/api/products');
                if (!response.ok) {
                    throw new Error('网络响应异常');
                }
                const data = await response.json();
                setProducts(data.data);
            } catch (err) {
                message.error(`加载产品列表时出错：${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const onAddFinish = async (values) => {
        try {
            const response = await fetch('http://localhost:9001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error('创建产品失败');
            }

            const data = await response.json();
            message.success(data.message);
            addForm.resetFields();
            setAddVisible(false);
            // 重新获取产品列表
            const fetchProducts = async () => {
                try {
                    const response = await fetch('http://localhost:9001/api/products');
                    if (!response.ok) {
                        throw new Error('网络响应异常');
                    }
                    const data = await response.json();
                    setProducts(data.data);
                } catch (err) {
                    message.error(`加载产品列表时出错：${err.message}`);
                }
            };
            fetchProducts();
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        editForm.setFieldsValue({
            ...product,
            productId: product.productId
        });
        setVisible(true);
    };

    const handleUpdate = async () => {
        try {
            const values = await editForm.validateFields();
            const response = await fetch('http://localhost:9001/api/products', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error('更新产品失败');
            }

            const data = await response.json();
            message.success('产品更新成功');
            setVisible(false);
            // 重新获取产品列表
            const fetchProducts = async () => {
                try {
                    const response = await fetch('http://localhost:9001/api/products');
                    if (!response.ok) {
                        throw new Error('网络响应异常');
                    }
                    const data = await response.json();
                    setProducts(data.data);
                } catch (err) {
                    message.error(`加载产品列表时出错：${err.message}`);
                }
            };
            fetchProducts();
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:9001/api/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('删除产品失败');
            }

            message.success('产品删除成功');
            // 重新获取产品列表
            const fetchProducts = async () => {
                try {
                    const response = await fetch('http://localhost:9001/api/products');
                    if (!response.ok) {
                        throw new Error('网络响应异常');
                    }
                    const data = await response.json();
                    setProducts(data.data);
                } catch (err) {
                    message.error(`加载产品列表时出错：${err.message}`);
                }
            };
            fetchProducts();
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleSearch = async () => {
        let url = 'http://localhost:9001/api/products';
        if (searchType) {
            url = `http://localhost:9001/api/products/type?type=${searchType}`;
        } else if (searchName) {
            url = `http://localhost:9001/api/products/search?name=${searchName}`;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('查询产品失败');
            }
            const data = await response.json();
            setProducts(data.data.records || data.data);
        } catch (error) {
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: '产品 ID',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: '产品类型',
            dataIndex: 'productType',
            key: 'productType',
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: '净值',
            dataIndex: 'netValue',
            key: 'netValue',
        },
        {
            title: '浮动利率',
            dataIndex: 'floatRate',
            key: 'floatRate',
        },
        {
            title: '记录日期',
            dataIndex: 'recordDate',
            key: 'recordDate',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除该产品吗？"
                        onConfirm={() => handleDelete(record.productId)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h4>产品管理 &gt; 产品组合</h4>
            <Card style={{ marginBottom: 20 }}>
                <Form layout="inline">
                    <Form.Item label="按类型查询">
                        <Select
                            value={searchType}
                            onChange={(value) => setSearchType(value)}
                            placeholder="请选择产品类型"
                        >
                            <Option value="基金">基金</Option>
                            <Option value="理财">理财</Option>
                            <Option value="股票">股票</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="按名称查询">
                        <Input
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="请输入产品名称"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleSearch}>
                            查询
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => setAddVisible(true)}>
                            添加产品
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Spin spinning={loading}>
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey="productId"
                    pagination={{ pageSize: 10 }}
                />
            </Spin>
            <Modal
                title="添加产品"
                visible={addVisible}
                onOk={() => addForm.submit()}
                onCancel={() => setAddVisible(false)}
            >
                <Form
                    form={addForm}
                    name="productCreation"
                    onFinish={onAddFinish}
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
            <Modal
                title="编辑产品"
                visible={visible}
                onOk={handleUpdate}
                onCancel={() => setVisible(false)}
            >
                <Form form={editForm}>
                    <Form.Item
                        name="productId"
                        label="产品 ID"
                        style={{ display: 'none' }}
                    >
                        <Input readOnly />
                    </Form.Item>
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
        </div>
    );
};

export default ProductManagement;
    