import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';

// 模拟资产数据
const mockAssetsData = [
    {
        clientId: "987654321098765431",
        productDailyProfit: [
            {
                record_date: "2025-03-29",
                profit_rate: 5.25,
                product_type: "基金",
                product_id: 1001,
                purchase_ratio: 500,
                daily_total_value: 100000.0,
            },
            {
                record_date: "2025-03-30",
                profit_rate: -2.15,
                product_type: "股票",
                product_id: 2002,
                purchase_ratio: 1000,
                daily_total_value: 250000.5,
            },
            {
                record_date: "2025-03-31",
                profit_rate: 3.75,
                product_type: "理财",
                product_id: 3003,
                purchase_ratio: 2000,
                daily_total_value: 500000.0,
            },
        ],
    },
    {
        clientId: "987654321098765432",
        productDailyProfit: [
            {
                record_date: "2025-03-30",
                profit_rate: -2.15,
                product_type: "股票",
                product_id: 2002,
                purchase_ratio: 1000,
                daily_total_value: 250000.5,
            },
        ],
    },
];

// 模拟服务层方法，根据 clientId 获取资产信息
const getAssetsByClientId = (clientId) => {
    return mockAssetsData
      .filter((item) => item.clientId === clientId)
      .map((item) => item.productDailyProfit)
      .flat();
};

const AccountOverview = () => {
    const [assets, setAssets] = useState([]);
    const [visible, setVisible] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [form] = Form.useForm();
    const mockClientId = "987654321098765431"; // 模拟客户 ID

    useEffect(() => {
        const fetchedAssets = getAssetsByClientId(mockClientId);
        setAssets(fetchedAssets);
    }, []);

    const columns = [
        {
            title: '记录日期',
            dataIndex: 'record_date',
            key: 'record_date',
        },
        {
            title: '利润率',
            dataIndex: 'profit_rate',
            key: 'profit_rate',
        },
        {
            title: '产品类型',
            dataIndex: 'product_type',
            key: 'product_type',
        },
        {
            title: '产品 ID',
            dataIndex: 'product_id',
            key: 'product_id',
        },
        {
            title: '购买比例',
            dataIndex: 'purchase_ratio',
            key: 'purchase_ratio',
        },
        {
            title: '日总价值',
            dataIndex: 'daily_total_value',
            key: 'daily_total_value',
        },
        {
            title: '操作',
            key: 'operation',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
                </div>
            ),
        },
    ];

    // 模拟添加数据
    const handleAdd = () => {
        setVisible(true);
        setEditingRow(null);
        form.resetFields();
    };

    // 模拟编辑数据
    const handleEdit = (record) => {
        setVisible(true);
        setEditingRow(record);
        form.setFieldsValue({
            record_date: record.record_date,
            profit_rate: record.profit_rate,
            product_type: record.product_type,
            product_id: record.product_id,
            purchase_ratio: record.purchase_ratio,
            daily_total_value: record.daily_total_value,
        });
    };

    // 模拟删除数据
    const handleDelete = (record) => {
        const newAssets = assets.filter((item) => item.product_id!== record.product_id);
        setAssets(newAssets);
    };

    // 模拟保存数据（添加或更新）
    const handleSave = () => {
        form.validateFields().then((values) => {
            if (editingRow) {
                // 更新操作
                const newAssets = assets.map((item) =>
                    item.product_id === editingRow.product_id? values : item
                );
                setAssets(newAssets);
            } else {
                // 添加操作
                setAssets([...assets, values]);
            }
            setVisible(false);
        });
    };

    // 模拟查询数据（这里简单打印所有数据）
    // const handleQuery = () => {
    //     console.log('查询所有数据:', assets);
    // };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h3 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
                个人中心&gt;账户总览
            </h3>
            <div style={{ marginBottom: '16px' }}>
                <Button type="primary" onClick={handleAdd}>添加</Button>
                {/* <Button type="primary" style={{ marginLeft: '8px' }} onClick={handleQuery}>查询</Button> */}
            </div>
            {assets.length > 0? (
                <Table
                    columns={columns}
                    dataSource={assets}
                    rowKey="product_id"
                    pagination={false}
                />
            ) : (
                <p className="text-center text-gray-500">正在加载数据...</p>
            )}
            <Modal
                title={editingRow? '编辑资产信息' : '添加资产信息'}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setVisible(false)}>取消</Button>,
                    <Button key="save" type="primary" onClick={handleSave}>保存</Button>,
                ]}
            >
                <Form form={form}>
                    <Form.Item
                        label="记录日期"
                        name="record_date"
                        rules={[{ required: true, message: '请输入记录日期' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="利润率"
                        name="profit_rate"
                        rules={[{ required: true, message: '请输入利润率' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="产品类型"
                        name="product_type"
                        rules={[{ required: true, message: '请输入产品类型' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="产品 ID"
                        name="product_id"
                        rules={[{ required: true, message: '请输入产品 ID' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="购买比例"
                        name="purchase_ratio"
                        rules={[{ required: true, message: '请输入购买比例' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="日总价值"
                        name="daily_total_value"
                        rules={[{ required: true, message: '请输入日总价值' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccountOverview;