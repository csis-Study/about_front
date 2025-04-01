import React, { useState, useEffect } from'react';
import { Form, Input, Button, Table, Card, message } from 'antd';
import axios from 'axios';

// 角色配置组件
const RoleConfiguration = () => {
    const [roles, setRoles] = useState([]);
    const [roleForm] = Form.useForm();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:9001/api/roles');
            setRoles(response.data.data);
        } catch (error) {
            message.error('获取角色列表失败');
        }
    };

    const handleCreateRole = async () => {
        try {
            const values = await roleForm.validateFields();
            const response = await axios.post('http://localhost:9001/api/roles', values);
            message.success(response.data.message);
            roleForm.resetFields();
            fetchRoles();
        } catch (error) {
            message.error('创建角色失败');
        }
    };

    const roleColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '权限', dataIndex: 'permissions', key: 'permissions' }
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>角色配置</h2>
            <Form form={roleForm} layout="inline">
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: '请输入角色名称' }]}
                >
                    <Input placeholder="角色名称" />
                </Form.Item>
                <Form.Item
                    name="permissions"
                    rules={[{ required: true, message: '请输入权限列表' }]}
                >
                    <Input placeholder="权限列表，逗号分隔" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleCreateRole}>
                        创建角色
                    </Button>
                </Form.Item>
            </Form>
            <Table dataSource={roles} columns={roleColumns} rowKey="id" />
        </div>
    );
};

// 访问控制组件
const AccessControl = () => {
    const [roleId, setRoleId] = useState('');
    const [permission, setPermission] = useState('');
    const [hasPermission, setHasPermission] = useState(null);

    const handleCheckPermission = async () => {
        try {
            const response = await axios.get(`http://localhost:9001/api/access-control/${roleId}/${permission}`);
            setHasPermission(response.data.data.hasPermission);
        } catch (error) {
            message.error('检查权限失败');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>访问控制</h2>
            <Form layout="inline">
                <Form.Item
                    name="roleId"
                    rules={[{ required: true, message: '请输入角色ID' }]}
                >
                    <Input placeholder="角色ID" onChange={(e) => setRoleId(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="permission"
                    rules={[{ required: true, message: '请输入权限名称' }]}
                >
                    <Input placeholder="权限名称" onChange={(e) => setPermission(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleCheckPermission}>
                        检查权限
                    </Button>
                </Form.Item>
            </Form>
            {hasPermission!== null && (
                <p>该角色{"是否"[+hasPermission]}具有此权限</p>
            )}
        </div>
    );
};

// 运行状态组件
const RunningStatus = () => {
    const [status, setStatus] = useState({});

    useEffect(() => {
        fetchSystemStatus();
    }, []);

    const fetchSystemStatus = async () => {
        try {
            const response = await axios.get('http://localhost:9001/api/system-status');
            setStatus(response.data.data);
        } catch (error) {
            message.error('获取系统状态失败');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>系统运行状态</h2>
            <Card>
                <p>运行状态: {status.running? '运行中' : '停止'}</p>
                <p>当前时间: {status.currentTime}</p>
            </Card>
        </div>
    );
};

// 系统日志组件
const SystemLogs = () => {
    const [systemLogs, setSystemLogs] = useState([]);
    const [logForm] = Form.useForm();

    useEffect(() => {
        fetchSystemLogs();
    }, []);

    const fetchSystemLogs = async () => {
        try {
            const response = await axios.get('http://localhost:9001/api/system-logs');
            setSystemLogs(response.data.data);
        } catch (error) {
            message.error('获取系统日志失败');
        }
    };

    const handleCreateLog = async () => {
        try {
            const values = await logForm.validateFields();
            const response = await axios.post('http://localhost:9001/api/system-logs', values);
            message.success(response.data.message);
            logForm.resetFields();
            fetchSystemLogs();
        } catch (error) {
            message.error('记录日志失败');
        }
    };

    const logColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '消息', dataIndex: 'message', key: 'message' },
        { title: '时间戳', dataIndex: 'timestamp', key: 'timestamp' }
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>系统日志</h2>
            <Form form={logForm} layout="inline">
                <Form.Item
                    name="message"
                    rules={[{ required: true, message: '请输入日志消息' }]}
                >
                    <Input placeholder="日志消息" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleCreateLog}>
                        记录日志
                    </Button>
                </Form.Item>
            </Form>
            <Table dataSource={systemLogs} columns={logColumns} rowKey="id" />
        </div>
    );
};

export {
    RoleConfiguration,
    AccessControl,
    RunningStatus,
    SystemLogs
};