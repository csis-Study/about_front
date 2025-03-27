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

const ProductManage = () => {
  // 存储产品数据
  const [products, setProducts] = useState([]);
  // 存储搜索类型（名称、类型）
  const [searchType, setSearchType] = useState("name");
  // 存储搜索文本
  const [searchText, setSearchText] = useState("");
  // 存储当前页码
  const [page, setPage] = useState(1);
  // 存储每页数量
  const [pageSize, setPageSize] = useState(10);
  // 控制新增产品模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 表单实例
  const [form] = Form.useForm();

  // 生命周期函数，在组件挂载或相关依赖项变化时获取产品数据
  useEffect(() => {
    fetchProducts();
  }, [searchType, searchText, page, pageSize]);

  // 获取产品数据的函数
  const fetchProducts = () => {
    const url = searchText
     ? searchType === "name"
        ? `${API_BASE_URL}/products/search?name=${searchText}&page=${page}&size=${pageSize}`
         : `${API_BASE_URL}/products/type?type=${searchText}&page=${page}&size=${pageSize}`
      : `${API_BASE_URL}/products`;

    axios
     .post(url)
     .then((response) => {
        if (response.data.code === 200) {
          setProducts(response.data.data?.content || response.data.data);
        }
      })
     .catch((error) => console.error("Error fetching products:", error));
  };

  // 删除产品的函数
  const handleDelete = (id) => {
    axios
     .delete(`${API_BASE_URL}/products/${id}`)
     .then((response) => {
        if (response.status === 204) {
          message.success("删除成功");
          fetchProducts();
        } else {
          message.error("删除失败");
        }
      })
     .catch((error) => console.error("Error deleting product:", error));
  };

  // 取消删除操作的提示函数
  const cancel = () => {
    message.error("取消删除");
  };

  // 显示新增产品模态框的函数
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 处理新增产品表单提交的函数
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        values
      );
      if (response.data.code === 200) {
        message.success("添加产品成功");
        setIsModalVisible(false);
        form.resetFields();
        fetchProducts();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("添加产品时出现错误，请稍后重试");
    }
  };

  // 关闭新增产品模态框并重置表单的函数
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 定义表格列
  const columns = [
    {
      title: "产品ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "产品名称",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "产品类型",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "净值",
      dataIndex: "netValue",
      key: "netValue",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个产品吗？"
            onConfirm={() => handleDelete(record.productId)}
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
      <h1>产品管理</h1>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ marginBottom: 16 }} size="middle">
          <Select
            style={{ width: 120 }}
            value={searchType}
            onChange={(value) => setSearchType(value)}
          >
            <Option value="name">名称</Option>
            <Option value="type">类型</Option>
          </Select>
          <Input.Search
            placeholder={`输入${searchType === "name"? "名称" : "类型"}进行搜索`}
            onSearch={(value) => setSearchText(value)}
            enterButton={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <button onClick={showModal}>新增产品</button>
        </Space>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="productId"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: products.length,
            onChange: (newPage) => setPage(newPage),
            onShowSizeChange: (_, newPageSize) => setPageSize(newPageSize),
          }}
        />
      </Space>
      <Modal
        title="新增产品"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addProductForm"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="产品名称"
            name="productName"
            rules={[{ required: true, message: "请输入产品名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="产品类型"
            name="productType"
            rules={[{ required: true, message: "请输入产品类型" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="净值"
            name="netValue"
            rules={[{ required: true, message: "请输入净值" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: "请输入状态" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManage;