import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Popconfirm,
  message,
  Select,
  Input,
  Modal,
  Form,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import API_BASE_URL from '../../../api/config.js'
import axios from "axios";

const { Option } = Select;

const RiskManagement = () => {
  // 存储风险官员数据
  const [riskOfficers, setRiskOfficers] = useState([]);
  // 存储搜索类型（姓名、用户名、状态）
  const [searchType, setSearchType] = useState("name");
  // 存储搜索文本
  const [searchText, setSearchText] = useState("");
  // 控制新增风险官员模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 表单实例
  const [form] = Form.useForm();

  // 生命周期函数，在组件挂载或相关依赖项变化时获取风险官员数据
  useEffect(() => {
    fetchRiskOfficers();
  }, [searchType, searchText]);

  // 获取风险官员数据的函数
  // const fetchRiskOfficers = () => {
  //   const url = searchText
  //    ? `${API_BASE_URL}/risk-officers/${
  //         searchType === "username"
  //          ? "username"
  //           : searchType === "status"
  //          ? "status"
  //           : "name"
  //       }/${searchText}`
  //     : `${API_BASE_URL}/risk-officers`;

  //   axios
  //    .get(url)
  //    .then((response) => {
  //       if (response.data.code === 200) {
  //         let dataToSet = response.data.data;
  //         // 如果是按用户名查询且返回的不是数组，将其转换为包含单个对象的数组
  //         if (searchType === "username" && typeof dataToSet === "object" &&!Array.isArray(dataToSet)) {
  //           dataToSet = [dataToSet];
  //         }
  //         setRiskOfficers(dataToSet);
  //       }
  //     })
  //    .catch((error) => console.error("Error fetching risk officers:", error));
  // };
  // 获取风险官员数据的函数
const fetchRiskOfficers = () => {
  const url = searchText
   ? `${API_BASE_URL}/risk-officers/${
        searchType === "username"
         ? "username"
          : searchType === "status"
         ? "status"
          : "name"
      }/${searchText === "在职"? "1" : searchText === "离职"? "0" : searchText}`
    : `${API_BASE_URL}/risk-officers`;

  axios
   .get(url)
   .then((response) => {
      if (response.data.code === 200) {
        let dataToSet = response.data.data;
        // 如果是按用户名查询且返回的不是数组，将其转换为包含单个对象的数组
        if (searchType === "username" && typeof dataToSet === "object" &&!Array.isArray(dataToSet)) {
          dataToSet = [dataToSet];
        }
        setRiskOfficers(dataToSet);
      }
    })
   .catch((error) => console.error("Error fetching risk officers:", error));
};

  // 删除风险官员的函数
  const handleDelete = (id) => {
    axios
     .delete(`${API_BASE_URL}/risk-officers/${id}`)
     .then((response) => {
        if (response.data.code === 200) {
          message.success("删除成功");
          setRiskOfficers(riskOfficers.filter(officer => officer.id!== id));
        } else {
          message.error("删除失败");
        }
      })
     .catch((error) => console.error("Error deleting risk officer:", error));
  };

  // 取消删除操作的提示函数
  const cancel = () => {
    message.error('取消删除');
  };

  // 显示新增风险官员模态框的函数
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 处理新增风险官员表单提交的函数
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post(
        `${API_BASE_URL}/risk-officers`,
        values
      );
      if (response.data.code === 200) {
        message.success("添加风险官员成功");
        setIsModalVisible(false);
        form.resetFields();
        fetchRiskOfficers();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding risk officer:", error);
      message.error("添加风险官员时出现错误，请稍后重试");
    }
  };

  // 关闭新增风险官员模态框并重置表单的函数
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 定义表格列
  const columns = [
    {
      title: "风险官员ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      render: (text) => text === "M"? "男" : "女",
    },
    {
      title: "出生日期",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "手机号码",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "电子邮件",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text) => text === 1? "在职" : "离职",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个风险官员吗？"
            onConfirm={() => handleDelete(record.id)}
            onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ marginBottom: 16 }} size="middle">
          <Select
            style={{ width: 120 }}
            value={searchType}
            onChange={(value) => setSearchType(value)}
          >
            <Option value="name">姓名</Option>
            <Option value="username">用户名</Option>
            <Option value="status">状态</Option>
          </Select>
          <Input.Search
            placeholder={`输入${
              searchType === "username"? "用户名" : searchType === "status"? "状态" : "姓名"
            }进行搜索`}
            onSearch={(value) => setSearchText(value)}
            enterButton={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <button onClick={showModal}>新增风险官员</button>
        </Space>
        <Table columns={columns} dataSource={riskOfficers} rowKey="id" />
      </Space>
      <Modal
        title="新增风险官员"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addRiskOfficerForm"
          layout="vertical"
          initialValues={{ remember: true }}
        >
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
            label="出生日期"
            name="birthday"
            rules={[{ required: true, message: "请输入出生日期" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="phoneNumber"
            rules={[{ required: true, message: "请输入手机号码" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电子邮件"
            name="email"
            rules={[{ required: true, message: "请输入电子邮件" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: "请输入角色" }]}
          >
            <Input defaultValue="risk" disabled />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select>
              <Option value="1">在职</Option>
              <Option value="0">离职</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RiskManagement;