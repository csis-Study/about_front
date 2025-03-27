import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Popconfirm,
  message,
  Input,
  Modal,
  Form,
  Button,
  Select
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from '../../../api/config.js'
import axios from "axios";

const { Option } = Select;

const ClientManage = () => {
  // 存储客户数据
  const [clients, setClients] = useState([]);
  // 存储当前页码
  const [page, setPage] = useState(1);
  // 存储每页数量
  const [pageSize, setPageSize] = useState(10);
  // 控制新增客户模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 控制更新客户信息模态框的显示与隐藏
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  // 当前要更新的客户信息
  const [currentClient, setCurrentClient] = useState({});
  // 表单实例
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  // 生命周期函数，在组件挂载或相关依赖项变化时获取客户数据
  useEffect(() => {
    fetchClients();
  }, [page, pageSize]);

  // 获取客户数据的函数
  const fetchClients = () => {
    axios
     .get(`${API_BASE_URL}/clients?page=${page}&pageSize=${pageSize}`)
     .then((response) => {
        if (response.data.code === 200) {
          setClients(response.data.data);
        }
      })
     .catch((error) => console.error("Error fetching clients:", error));
  };

  // 删除客户的函数
  const handleDelete = (usrId) => {
    axios
     .delete(`${API_BASE_URL}/clients/${usrId}`)
     .then((response) => {
        if (response.data.code === 200) {
          message.success("删除成功");
          fetchClients();
        } else {
          message.error("删除失败");
        }
      })
     .catch((error) => console.error("Error deleting client:", error));
  };

  // 取消删除操作的提示函数
  const cancel = () => {
    message.error("取消删除");
  };

  // 显示新增客户模态框的函数
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 处理新增客户表单提交的函数
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post(
        `${API_BASE_URL}/clients`,
        values
      );
      if (response.data.code === 200) {
        message.success("添加客户成功");
        setIsModalVisible(false);
        form.resetFields();
        fetchClients();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding client:", error);
      message.error("添加客户时出现错误，请稍后重试");
    }
  };

  // 关闭新增客户模态框并重置表单的函数
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 显示更新客户信息模态框的函数
  const showUpdateModal = (client) => {
    setCurrentClient(client);
    updateForm.setFieldsValue(client);
    setIsUpdateModalVisible(true);
  };

  // 处理更新客户基本信息表单提交的函数
  const handleUpdateOk = async () => {
    try {
      const values = await updateForm.validateFields();
      const usrId = currentClient.usrId;
      const response = await axios.put(
        `${API_BASE_URL}/clients/${usrId}/basic-info`,
        values
      );
      if (response.data.code === 200) {
        message.success("更新客户信息成功");
        setIsUpdateModalVisible(false);
        fetchClients();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      message.error("更新客户信息时出现错误，请稍后重试");
    }
  };

  // 关闭更新客户信息模态框并重置表单的函数
  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
  };

  // 定义表格列
  const columns = [
    // {
    //   title: "客户ID",
    //   dataIndex: "usrId",
    //   key: "usrId",
    // },
    {
      title: "账号",
      dataIndex: "usrAccount",
      key: "usrAccount",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "生日",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "电话号码",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "国籍",
      dataIndex: "nationality",
      key: "nationality",
    },
    // {
    //   title: "客户经理ID",
    //   dataIndex: "relationshipManagerId",
    //   key: "relationshipManagerId",
    // },
    {
      title: "证件类型",
      dataIndex: "idType",
      key: "idType",
    },
    {
      title: "证件号码",
      dataIndex: "idNumber",
      key: "idNumber",
    },
    {
      title: "收入水平",
      dataIndex: "incomeLevel",
      key: "incomeLevel",
    },
    {
      title: "注册日期",
      dataIndex: "registerDate",
      key: "registerDate",
    },
    {
      title: "KYC检查日期",
      dataIndex: "kycCheckDate",
      key: "kycCheckDate",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "备注",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "风险等级",
      dataIndex: "riskLevel",
      key: "riskLevel",
    },
    {
      title: "总资产",
      dataIndex: "totalAssets",
      key: "totalAssets",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个客户吗？"
            onConfirm={() => handleDelete(record.usrId)}
            onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
          <Button type="link" onClick={() => showUpdateModal(record)}>
            更新
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>客户管理</h1>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ marginBottom: 16 }} size="middle">
          <Input.Search
            placeholder="输入客户ID或其他信息进行搜索"
            enterButton={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={showModal}>
            新增客户
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={clients}
          rowKey="usrId"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: clients.length,
            onChange: (newPage) => setPage(newPage),
            onShowSizeChange: (_, newPageSize) => setPageSize(newPageSize),
          }}
        />
      </Space>
      <Modal
        title="新增客户"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addClientForm"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="账号"
            name="usrAccount"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="usrPasswd"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: "请选择性别" }]}
          >
            <Select>
              <Option value="M">男</Option>
              <Option value="F">女</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="生日"
            name="birthday"
            rules={[{ required: true, message: "请输入生日" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话号码"
            name="phoneNumber"
            rules={[{ required: true, message: "请输入电话号码" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="国籍"
            name="nationality"
            rules={[{ required: true, message: "请输入国籍" }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="客户经理ID"
            name="relationshipManagerId"
            rules={[{ required: true, message: "请输入客户经理ID" }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="证件类型"
            name="idType"
            rules={[{ required: true, message: "请输入证件类型" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="证件号码"
            name="idNumber"
            rules={[{ required: true, message: "请输入证件号码" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="收入水平"
            name="incomeLevel"
            rules={[{ required: true, message: "请输入收入水平" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="风险等级"
            name="riskLevel"
            rules={[{ required: true, message: "请输入风险等级" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="总资产"
            name="totalAssets"
            rules={[{ required: true, message: "请输入总资产" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="更新客户信息"
        visible={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      >
        <Form
          form={updateForm}
          name="updateClientForm"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="账号"
            name="usrAccount"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: "请选择性别" }]}
          >
            <Select>
              <Option value="M">男</Option>
              <Option value="F">女</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="生日"
            name="birthday"
            rules={[{ required: true, message: "请输入生日" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话号码"
            name="phoneNumber"
            rules={[{ required: true, message: "请输入电话号码" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="国籍"
            name="nationality"
            rules={[{ required: true, message: "请输入国籍" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="客户经理ID"
            name="relationshipManagerId"
            rules={[{ required: true, message: "请输入客户经理ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="证件类型"
            name="idType"
            rules={[{ required: true, message: "请输入证件类型" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="证件号码"
            name="idNumber"
            rules={[{ required: true, message: "请输入证件号码" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="收入水平"
            name="incomeLevel"
            rules={[{ required: true, message: "请输入收入水平" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="风险等级"
            name="riskLevel"
            rules={[{ required: true, message: "请输入风险等级" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="总资产"
            name="totalAssets"
            rules={[{ required: true, message: "请输入总资产" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientManage;