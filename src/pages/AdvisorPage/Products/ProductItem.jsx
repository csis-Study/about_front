// import React, { useEffect, useState } from "react";
// import {
//   Space,
//   Table,
//   Popconfirm,
//   message,
//   Select,
//   Input,
//   Modal,
//   Form,
// } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import API_BASE_URL from '../../../api/config.js'
// import axios from "axios";

// const { Option } = Select;

// const ProductItemManage = () => {
//   // 存储产品项数据
//   const [productItems, setProductItems] = useState([]);
//   // 存储搜索类型（组名、组ID）
//   const [searchType, setSearchType] = useState("groupName");
//   // 存储搜索文本
//   const [searchText, setSearchText] = useState("");
//   // 存储当前页码
//   const [page, setPage] = useState(1);
//   // 存储每页数量
//   const [pageSize, setPageSize] = useState(10);
//   // 控制新增产品项模态框的显示与隐藏
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   // 表单实例
//   const [form] = Form.useForm();

//   // 生命周期函数，在组件挂载或相关依赖项变化时获取产品项数据
//   useEffect(() => {
//     fetchProductItems();
//   }, [searchType, searchText, page, pageSize]);

//   // 获取产品项数据的函数
//   const fetchProductItems = () => {
//     const url = searchText
//      ? searchType === "groupName"
//         ? `${API_BASE_URL}/product-items/group-name?name=${searchText}&page=${page}&size=${pageSize}`
//          : `${API_BASE_URL}/product-items/group-id?groupId=${searchText}&page=${page}&size=${pageSize}`
//       : `${API_BASE_URL}/product-items`;

//     axios
//      .get(url)
//      .then((response) => {
//         if (response.data.code === 200) {
//           setProductItems(response.data.data);
//         }
//       })
//      .catch((error) => console.error("Error fetching product items:", error));
//   };

//   // 删除产品项的函数
//   const handleDelete = (id) => {
//     axios
//      .delete(`${API_BASE_URL}/product-items/${id}`)
//      .then((response) => {
//         if (response.data.code === 204) {
//           message.success("删除成功");
//           fetchProductItems();
//         } else {
//           message.error("删除失败");
//         }
//       })
//      .catch((error) => console.error("Error deleting product item:", error));
//   };

//   // 取消删除操作的提示函数
//   const cancel = () => {
//     message.error("取消删除");
//   };

//   // 显示新增产品项模态框的函数
//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   // 处理新增产品项表单提交的函数
//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       const response = await axios.post(
//         `${API_BASE_URL}/product-items`,
//         values
//       );
//       if (response.data.code === 200) {
//         message.success("添加产品项成功");
//         setIsModalVisible(false);
//         form.resetFields();
//         fetchProductItems();
//       } else {
//         message.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error adding product item:", error);
//       message.error("添加产品项时出现错误，请稍后重试");
//     }
//   };

//   // 关闭新增产品项模态框并重置表单的函数
//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   // 定义表格列
//   const columns = [
//     {
//       title: "产品项ID",
//       dataIndex: "productItemId",
//       key: "productItemId",
//     },
//     {
//       title: "产品组ID",
//       dataIndex: "productGroupId",
//       key: "productGroupId",
//     },
//     {
//       title: "产品组名称",
//       dataIndex: "productGroupName",
//       key: "productGroupName",
//     },
//     {
//       title: "产品",
//       dataIndex: "product",
//       key: "product",
//     },
//     {
//       title: "创建时间",
//       dataIndex: "createdAt",
//       key: "createdAt",
//     },
//     {
//       title: "操作",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Popconfirm
//             title="确定要删除这个产品项吗？"
//             onConfirm={() => handleDelete(record.productItemId)}
//             onCancel={cancel}
//             okText="确定"
//             cancelText="取消"
//           >
//             <a>删除</a>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <h1>产品项管理</h1>
//       <Space direction="vertical" style={{ width: "100%" }}>
//         <Space style={{ marginBottom: 16 }} size="middle">
//           <Select
//             style={{ width: 120 }}
//             value={searchType}
//             onChange={(value) => setSearchType(value)}
//           >
//             <Option value="groupName">组名</Option>
//             <Option value="groupId">组ID</Option>
//           </Select>
//           <Input.Search
//             placeholder={`输入${searchType === "groupName"? "组名" : "组ID"}进行搜索`}
//             onSearch={(value) => setSearchText(value)}
//             enterButton={<SearchOutlined />}
//             style={{ width: 200 }}
//           />
//           <button onClick={showModal}>新增产品项</button>
//         </Space>
//         <Table
//           columns={columns}
//           dataSource={productItems}
//           rowKey="productItemId"
//           pagination={{
//             current: page,
//             pageSize: pageSize,
//             total: productItems.length,
//             onChange: (newPage) => setPage(newPage),
//             onShowSizeChange: (_, newPageSize) => setPageSize(newPageSize),
//           }}
//         />
//       </Space>
//       <Modal
//         title="新增产品项"
//         visible={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <Form
//           form={form}
//           name="addProductItemForm"
//           layout="vertical"
//           initialValues={{ remember: true }}
//         >
//           <Form.Item
//             label="产品项ID"
//             name="productItemId"
//             rules={[{ required: true, message: "请输入产品项ID" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="产品组ID"
//             name="productGroupId"
//             rules={[{ required: true, message: "请输入产品组ID" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="产品组名称"
//             name="productGroupName"
//             rules={[{ required: true, message: "请输入产品组名称" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="产品"
//             name="product"
//             rules={[{ required: true, message: "请输入产品" }]}
//           >
//             <Input />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ProductItemManage;