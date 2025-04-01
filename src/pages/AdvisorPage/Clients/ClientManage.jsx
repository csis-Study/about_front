// import React, { useState, useEffect } from 'react';
// import { Table, Button, Input, Modal, Form, message } from 'antd';
// import axios from 'axios';

// const ClientManage = () => {
//     const [clients, setClients] = useState([]);
//     const [form] = Form.useForm();
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingClient, setEditingClient] = useState(null);

//     useEffect(() => {
//         fetchClients();
//     }, []);

//     const fetchClients = async () => {
//         try {
//             const response = await axios.get('/clients');
//             setClients(response.data.data);
//         } catch (error) {
//             message.error('获取客户列表失败');
//         }
//     };

//     const handleCreate = async () => {
//         try {
//             const values = await form.validateFields();
//             const response = await axios.post('/clients', values);
//             setClients([...clients, response.data.data]);
//             setIsModalVisible(false);
//             form.resetFields();
//             message.success('客户创建成功');
//         } catch (error) {
//             message.error('客户创建失败');
//         }
//     };

//     const handleEdit = (client) => {
//         setEditingClient(client);
//         form.setFieldsValue(client);
//         setIsModalVisible(true);
//     };

//     const handleUpdate = async () => {
//         try {
//             const values = await form.validateFields();
//             const response = await axios.put(`/clients/${editingClient.usrAccount}/basic-info`, values);
//             const newClients = clients.map((c) =>
//                 c.usrAccount === editingClient.usrAccount ? response.data.data : c
//             );
//             setClients(newClients);
//             setIsModalVisible(false);
//             form.resetFields();
//             setEditingClient(null);
//             message.success('客户信息更新成功');
//         } catch (error) {
//             message.error('客户信息更新失败');
//         }
//     };

//     const handleDelete = async (usrAccount) => {
//         try {
//             await axios.delete(`/clients/usrAccount1/${usrAccount}`);
//             const newClients = clients.filter((c) => c.usrAccount !== usrAccount);
//             setClients(newClients);
//             message.success('客户删除成功');
//         } catch (error) {
//             message.error('客户删除失败');
//         }
//     };

//     const columns = [
//         {
//             title: '用户 ID',
//             dataIndex: 'usrId',
//             key: 'usrId',
//         },
//         {
//             title: '用户账户',
//             dataIndex: 'usrAccount',
//             key: 'usrAccount',
//         },
//         {
//             title: '姓名',
//             dataIndex: 'name',
//             key: 'name',
//         },
//         {
//             title: '性别',
//             dataIndex: 'gender',
//             key: 'gender',
//         },
//         {
//             title: '电话号码',
//             dataIndex: 'phoneNumber',
//             key: 'phoneNumber',
//         },
//         {
//             title: '总资产',
//             dataIndex: 'totalAssets',
//             key: 'totalAssets',
//         },
//         {
//             title: '风险等级',
//             dataIndex: 'riskLevel',
//             key: 'riskLevel',
//         },
//         {
//             title: 'KYC 检查日期',
//             dataIndex: 'kycCheckDate',
//             key: 'kycCheckDate',
//         },
//         {
//             title: '客户经理 ID',
//             dataIndex: 'managerId',
//             key: 'managerId',
//         },
//         {
//             title: '操作',
//             key: 'action',
//             render: (_, record) => (
//                 <div>
//                     <Button onClick={() => handleEdit(record)}>编辑</Button>
//                     <Button onClick={() => handleDelete(record.usrAccount)}>删除</Button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div>
//             <Button onClick={() => {
//                 setIsModalVisible(true);
//                 setEditingClient(null);
//                 form.resetFields();
//             }}>
//                 创建客户
//             </Button>
//             <Table dataSource={clients} columns={columns} rowKey="usrId" />
//             <Modal
//                 title={editingClient ? '编辑客户信息' : '创建客户'}
//                 visible={isModalVisible}
//                 onOk={editingClient ? handleUpdate : handleCreate}
//                 onCancel={() => {
//                     setIsModalVisible(false);
//                     form.resetFields();
//                 }}
//             >
//                 <Form
//                     form={form}
//                     layout="vertical"
//                     name="clientForm"
//                     initialValues={{
//                         remember: true,
//                     }}
//                 >
//                     <Form.Item
//                         name="usrAccount"
//                         label="用户账户"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入用户账户',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="password"
//                         label="密码"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入密码',
//                             },
//                         ]}
//                     >
//                         <Input.Password />
//                     </Form.Item>
//                     <Form.Item
//                         name="name"
//                         label="姓名"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入姓名',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="gender"
//                         label="性别"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入性别',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="phoneNumber"
//                         label="电话号码"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入电话号码',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="totalAssets"
//                         label="总资产"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入总资产',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="riskLevel"
//                         label="风险等级"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入风险等级',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="kycCheckDate"
//                         label="KYC 检查日期"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入 KYC 检查日期',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="managerId"
//                         label="客户经理 ID"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: '请输入客户经理 ID',
//                             },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default ClientManage;

import React, { useState, useEffect } from'react';
import { Table, Button, Input, Modal, Form, message } from 'antd';

const ClientManage = () => {
    const [clients, setClients] = useState([
        {
            usrId: '1',
            usrAccount: 'user1',
            name: 'John Doe',
            gender: 'Male',
            phoneNumber: '1234567890',
            totalAssets: '10000',
            riskLevel: 'Medium',
            kycCheckDate: '2024-01-01',
            managerId: 'M001'
        },
        {
            usrId: '2',
            usrAccount: 'user2',
            name: 'Jane Smith',
            gender: 'Female',
            phoneNumber: '0987654321',
            totalAssets: '20000',
            riskLevel: 'High',
            kycCheckDate: '2024-02-01',
            managerId: 'M002'
        }
    ]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        // 这里可以添加一些初始化逻辑，目前直接使用模拟数据
    }, []);

    const handleCreate = () => {
        form.validateFields().then((values) => {
            const newClient = {
               ...values,
                usrId: (clients.length + 1).toString() // 简单模拟生成用户ID
            };
            setClients([...clients, newClient]);
            setIsModalVisible(false);
            form.resetFields();
            message.success('客户创建成功');
        }).catch(() => {
            message.error('客户创建失败');
        });
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        form.setFieldsValue(client);
        setIsModalVisible(true);
    };

    const handleUpdate = () => {
        form.validateFields().then((values) => {
            const newClients = clients.map((c) =>
                c.usrAccount === editingClient.usrAccount? {...c,...values } : c
            );
            setClients(newClients);
            setIsModalVisible(false);
            form.resetFields();
            setEditingClient(null);
            message.success('客户信息更新成功');
        }).catch(() => {
            message.error('客户信息更新失败');
        });
    };

    const handleDelete = (usrAccount) => {
        const newClients = clients.filter((c) => c.usrAccount!== usrAccount);
        setClients(newClients);
        message.success('客户删除成功');
    };

    const columns = [
        {
            title: '用户 ID',
            dataIndex: 'usrId',
            key: 'usrId',
        },
        {
            title: '用户账户',
            dataIndex: 'usrAccount',
            key: 'usrAccount',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '电话号码',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: '总资产',
            dataIndex: 'totalAssets',
            key: 'totalAssets',
        },
        {
            title: '风险等级',
            dataIndex: 'riskLevel',
            key: 'riskLevel',
        },
        {
            title: 'KYC 检查日期',
            dataIndex: 'kycCheckDate',
            key: 'kycCheckDate',
        },
        {
            title: '客户经理 ID',
            dataIndex:'managerId',
            key:'managerId',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleEdit(record)}>编辑</Button>
                    <Button onClick={() => handleDelete(record.usrAccount)}>删除</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Button onClick={() => {
                setIsModalVisible(true);
                setEditingClient(null);
                form.resetFields();
            }}>
                创建客户
            </Button>
            <Table dataSource={clients} columns={columns} rowKey="usrId" />
            <Modal
                title={editingClient? '编辑客户信息' : '创建客户'}
                visible={isModalVisible}
                onOk={editingClient? handleUpdate : handleCreate}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="clientForm"
                    initialValues={{
                        remember: true,
                    }}
                >
                    <Form.Item
                        name="usrAccount"
                        label="用户账户"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户账户',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[
                            {
                                required: true,
                                message: '请输入姓名',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="性别"
                        rules={[
                            {
                                required: true,
                                message: '请输入性别',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="电话号码"
                        rules={[
                            {
                                required: true,
                                message: '请输入电话号码',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="totalAssets"
                        label="总资产"
                        rules={[
                            {
                                required: true,
                                message: '请输入总资产',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="riskLevel"
                        label="风险等级"
                        rules={[
                            {
                                required: true,
                                message: '请输入风险等级',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="kycCheckDate"
                        label="KYC 检查日期"
                        rules={[
                            {
                                required: true,
                                message: '请输入 KYC 检查日期',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="managerId"
                        label="客户经理 ID"
                        rules={[
                            {
                                required: true,
                                message: '请输入客户经理 ID',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClientManage;