import React, { useState, useEffect } from'react';
import { Form, Input, Select, Button, Table, Spin, message, Modal } from 'antd';

const { Option } = Select;

const ProductItemManagement = () => {
    const [productItems, setProductItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createForm] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [searchType, setSearchType] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    });

    useEffect(() => {
        fetchProductItems();
    }, []);

    const fetchProductItems = async () => {
        setLoading(true);
        let url = '';
        switch (searchType) {
            case 'all':
                url = 'http://localhost:9001/api/product-items';
                break;
            case 'groupId':
                url = `http://localhost:9001/api/product-items/group-id?groupId=${searchValue}&page=${pagination.current}&size=${pagination.pageSize}`;
                break;
            case 'groupName':
                url = `http://localhost:9001/api/product-items/group-name?name=${searchValue}&page=${pagination.current}&size=${pagination.pageSize}`;
                break;
            default:
                url = 'http://localhost:9001/api/product-items';
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            setProductItems(data.data.records);
            setPagination({
                current: data.data.current,
                pageSize: data.data.size,
                total: data.data.total
            });
        } catch (error) {
            message.error('获取产品组合项数据失败');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields();
            const response = await fetch('http://localhost:9001/api/product-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            const data = await response.json();
            if (response.ok) {
                message.success(data.message);
                createForm.resetFields();
                setVisible(false);
                fetchProductItems();
            } else {
                message.error(data.message);
            }
        } catch (error) {
            message.error('创建产品组合项失败');
        }
    };

    const handleSearch = async () => {
        try {
            const values = await searchForm.validateFields();
            setSearchValue(values.searchValue);
            setPagination({...pagination, current: 1 });
            fetchProductItems();
        } catch (error) {
            message.error('请输入查询值');
        }
    };

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
        fetchProductItems();
    };

    const columns = [
        {
            title: '组合项 ID',
            dataIndex: 'productItemId',
            key: 'productItemId'
        },
        {
            title: '组合 ID',
            dataIndex: 'productGroupId',
            key: 'productGroupId'
        },
        {
            title: '组合名称',
            dataIndex: 'productGroupName',
            key: 'productGroupName'
        },
        {
            title: '关联产品名称',
            dataIndex: 'product.productName',
            key: 'product.productName'
        },
        {
            title: '数量',
            dataIndex: 'amount',
            key: 'amount'
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        }
    ];

    return (
        <div>
            <h4>产品管理 &gt; 产品详情</h4>
            <Button type="primary" onClick={() => setVisible(true)}>
                创建组合项
            </Button>
            <Form form={searchForm} layout="inline" style={{ margin: '20px 0' }}>
                <Form.Item label="查询类型">
                    <Select value={searchType} onChange={(value) => setSearchType(value)}>
                        <Option value="all">显示所有信息</Option>
                        <Option value="groupId">按组合 ID 查询</Option>
                        <Option value="groupName">按组合名称查询</Option>
                    </Select>
                </Form.Item>
                {searchType!== 'all' && (
                    <Form.Item name="searchValue" rules={[{ required: true, message: '请输入查询值' }]}>
                        <Input placeholder="请输入查询值" />
                    </Form.Item>
                )}
                <Form.Item>
                    <Button type="primary" onClick={handleSearch}>
                        查询
                    </Button>
                </Form.Item>
            </Form>
            <Spin spinning={loading}>
                <Table
                    dataSource={productItems}
                    columns={columns}
                    rowKey="productItemId"
                    pagination={pagination}
                    onChange={handleTableChange}
                />
            </Spin>
            <Modal
                title="创建组合项"
                visible={visible}
                onOk={handleCreate}
                onCancel={() => setVisible(false)}
            >
                <Form form={createForm}>
                    <Form.Item
                        name="productGroupId"
                        label="组合 ID"
                        rules={[{ required: false, message: '请输入组合 ID' }]}
                    >
                        <Input placeholder="请输入组合 ID" />
                    </Form.Item>
                    <Form.Item
                        name="productGroupName"
                        label="组合名称"
                        rules={[{ required: false, message: '请输入组合名称' }]}
                    >
                        <Input placeholder="请输入组合名称" />
                    </Form.Item>
                    <Form.Item
                        name="productId"
                        label="关联产品 ID"
                        rules={[{ required: true, message: '请输入关联产品 ID' }]}
                    >
                        <Input placeholder="请输入关联产品 ID" />
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="数量"
                        rules={[{ required: false, message: '请输入数量' }]}
                    >
                        <Input type="number" placeholder="请输入数量" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductItemManagement;
    