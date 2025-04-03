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
import axios from "axios";
import API_BASE_URL from '../../../api/config.js'

const { Option } = Select;

const AdvisorManagement = () => {
  // 存储客户经理数据
  const [advisors, setAdvisors] = useState([]);
  // 存储分页信息
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7, total: 0 });
  // 存储搜索类型（姓名或证件号码）
  const [searchType, setSearchType] = useState("name");
  // 存储搜索文本
  const [searchText, setSearchText] = useState("");
  // 控制新增客户经理模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 表单实例
  const [form] = Form.useForm();

  // 生命周期函数，在组件挂载或相关依赖项变化时获取客户经理数据
  useEffect(() => {
    fetchAdvisors();
  }, [pagination.current, pagination.pageSize, searchType, searchText]);

  // 获取客户经理数据的函数
  // const fetchAdvisors = () => {
  //   // 根据是否有搜索文本构建不同的请求 URL
  //   const url = searchText
  //    ? `${API_BASE_URL}/advisors/${
  //         searchType === "name"? "name" : "idNumber"
  //       }/${searchText}?page=${pagination.current}&pageSize=${pagination.pageSize}`
  //     : `${API_BASE_URL}/advisors?page=${pagination.current}&pageSize=${pagination.pageSize}`;

  //   axios
  //    .get(url)
  //    .then((response) => {
  //       if (response.data.code === 200) {
  //         setAdvisors(response.data.data);
  //         setPagination({ ...pagination, total: response.data.total });
  //       }
  //     })
  //    .catch((error) => console.error("Error fetching advisors:", error));
  // };
  const fetchAdvisors = () => {
    const url = searchText
     ? `${API_BASE_URL}/advisors/${
          searchType === "name"? "name" : "idNumber"
        }/${searchText}?page=${pagination.current}&pageSize=${pagination.pageSize}`
      : `${API_BASE_URL}/advisors?page=${pagination.current}&pageSize=${pagination.pageSize}`;
  
    axios
     .get(url, {
      headers: {
        'Authorization': localStorage.getItem("token")
      }
     })
     .then((response) => {
        if (response.data.code === 200) {
          let dataToSet = response.data.data;
          // 判断按证件号查询时返回的数据是否为数组
          if (searchType === "idNumber" &&!Array.isArray(dataToSet)) {
            dataToSet = [dataToSet];
          }
          setAdvisors(dataToSet);
          setPagination({ ...pagination, total: response.data.total });
        }
      })
     .catch((error) => console.error("Error fetching advisors:", error));
  };

  // 处理表格分页变化的函数
  const handleTableChange = (newPagination) => {
    setPagination({ ...pagination, current: newPagination.current, pageSize: newPagination.pageSize });
  };

  // 删除客户经理的函数
  const handleDelete = (id) => {
    axios
     .delete(`${API_BASE_URL}/advisors/delete/${id}`, {
      headers: {
        'Authorization': localStorage.getItem("token")
      }
     })
     .then((response) => {
        if (response.status === 204) {
          message.success("删除成功");
          setAdvisors(advisors.filter((advisor) => advisor.id!== id));
        } else {
          message.error("删除失败");
        }
      })
     .catch((error) => console.error("Error deleting advisor:", error));
  };

  // 取消删除操作的提示函数
  const cancel = () => {
    message.error("取消删除");
  };

  // 显示新增客户经理模态框的函数
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 处理新增客户经理表单提交的函数
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post(
        `${API_BASE_URL}/advisors`,
        {
          headers: {
            'Authorization': localStorage.getItem("token")
          }
        },
        values
      );
      if (response.data.code === 200) {
        message.success("添加客户经理成功");
        setIsModalVisible(false);
        form.resetFields();
        fetchAdvisors();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding advisor:", error);
      message.error("添加客户经理时出现错误，请稍后重试");
    }
  };

  // 关闭新增客户经理模态框并重置表单的函数
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 定义表格列
  const columns = [
    {
      title: "客户经理ID",
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
      title: "证件号码",
      dataIndex: "idNumber",
      key: "idNumber",
    },
    {
      title: "账号",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "电子邮件",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "手机号码",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个客户经理吗？"
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
            <Option value="idNumber">证件号码</Option>
          </Select>
          <Input.Search
            placeholder={`输入${
              searchType === "idNumber"? "证件号码" : "姓名"
            }进行搜索`}
            onSearch={(value) => setSearchText(value)}
            enterButton={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <button onClick={showModal}>新增客户经理</button>
        </Space>
        <Table
          columns={columns}
          dataSource={advisors}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Space>
      <Modal
        title="新增客户经理"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addAdvisorForm"
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
            label="证件号码"
            name="idNumber"
            rules={[{ required: true, message: "请输入证件号码" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: "请输入账号" }]}
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
            label="电子邮件"
            name="email"
            rules={[{ required: true, message: "请输入电子邮件" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="phone"
            rules={[{ required: true, message: "请输入手机号码" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: "请输入角色" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdvisorManagement;