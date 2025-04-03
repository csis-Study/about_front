// import React, { useEffect, useState } from 'react';
// import { Space, Table, Popconfirm, message, Select, Input } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import API_BASE_URL from '../../../api/config.js'

// const { Option } = Select;

// export default function AdminManage() {
//   const [admins, setAdmins] = useState([]);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 7, total: 0 });
//   const [searchType, setSearchType] = useState('name'); // 默认搜索类型为姓名
//   const [searchText, setSearchText] = useState(''); // 搜索文本

//   useEffect(() => {        
//     fetchAdmins();
//   }, [pagination.current, pagination.pageSize, searchType, searchText]);

//   const fetchAdmins = () => {
//     const url = searchText 
//       ? `${API_BASE_URL}/admins/${searchType === 'username'? 'username' : 'name'}/${searchText}?page=${pagination.current}&pageSize=${pagination.pageSize}`
//       : `${API_BASE_URL}/admins?page=${pagination.current}&pageSize=${pagination.pageSize}`;
  
//     fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         if (data.code === 200) {
//           if (searchType === 'username') {
//             // 修正用户名查询时的数据处理
//             setAdmins(Array.isArray(data.data) ? data.data : [data.data]);
//           } else {
//             setAdmins(data.data);
//           }
//           setPagination({...pagination, total: data.total });
//         } else if (searchType === 'username' && data.code === 404) {
//           setAdmins([]);
//           setPagination({...pagination, total: 0 });
//         }
//       })
//       .catch(error => console.error('Error fetching admins:', error));
//   };

//   const handleTableChange = (newPagination) => {
//     setPagination({ ...pagination, current: newPagination.current, pageSize: newPagination.pageSize });
//   };

//   const handleDelete = (id) => {
//     fetch(`${API_BASE_URL}/admins/${id}`, {
//       method: 'DELETE',
//     })
//       .then(response => {
//         if (response.status === 204) {
//           message.success("删除成功");
//           // 更新管理员列表
//           setAdmins(admins.filter(admin => admin.id !== id));
//           return;  // 204 状态码没有响应体，直接返回
//         }
//         return response.json();  // 其他状态码需要解析 JSON
//       })
//       .then(data => {
//         if (data && data.code === 204) {
//           message.success("删除成功");
//           // 更新管理员列表
//           setAdmins(admins.filter(admin => admin.id !== id));
//         } else if (data) {
//           message.error(data.message);
//         }
//       })
//       .catch(error => console.error('Error deleting admin:', error));
//   };

//   const cancel = () => {
//     message.error('取消删除');
//   };

//   const columns = [
//     {
//       title: '管理员ID',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: '姓名',
//       dataIndex: 'name',
//       key: 'name',
//       render: text => <a>{text}</a>,
//     },
//     {
//       title: '性别',
//       dataIndex: 'gender',
//       key: 'gender',
//       render: text => text === 'M' ? '男' : '女',
//     },
//     {
//       title: '出生日期',
//       dataIndex: 'birthday',
//       key: 'birthday',
//     },
//     {
//       title: '手机号码',
//       dataIndex: 'phoneNumber',
//       key: 'phoneNumber',
//     },
//     {
//       title: '电子邮件',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: '用户名',
//       dataIndex: 'username',
//       key: 'username',
//     },
//     {
//       title: '国籍',
//       dataIndex: 'nationality',
//       key: 'nationality',
//     },
//     {
//       title: '状态',
//       dataIndex: 'status',
//       key: 'status',
//       render: text => text === 1 ? '在职' : '离职',
//     },
//     {
//       title: '操作',
//       key: 'action',
//       render: (_, record) => (
//         <Space size="middle">
//           <Popconfirm
//             title="确定要删除这个管理员吗？"
//             onConfirm={() => handleDelete(record.id)}
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
//       <Space direction="vertical" style={{ width: '100%' }}>
//         <Space style={{ marginBottom: 16 }} size="middle">
//           <Select style={{ width: 120 }} value={searchType} onChange={value => setSearchType(value)}>
//             <Option value="name">姓名</Option>
//             <Option value="username">用户名</Option>
//           </Select>
//           <Input.Search
//             placeholder={`输入${searchType === 'username' ? '用户名' : '姓名'}进行搜索`}
//             onSearch={value => setSearchText(value)}
//             enterButton={<SearchOutlined />}
//             style={{ width: 200 }}
//           />
//         </Space>
//         <Table columns={columns} dataSource={admins} rowKey="id" pagination={pagination} onChange={handleTableChange} />
//       </Space>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { Space, Table, Popconfirm, message, Select, Input, Modal, Form, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import API_BASE_URL from '../../../api/config.js';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AdminManage() {
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7, total: 0 });
  const [searchType, setSearchType] = useState('name'); // 默认搜索类型为姓名
  const [searchText, setSearchText] = useState(''); // 搜索文本
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true); // 新增 loading 状态

  useEffect(() => {
    fetchAdmins();
  }, [pagination.current, pagination.pageSize, searchType, searchText]);

  const fetchAdmins = () => {
    setLoading(true); // 开始加载
    const url = searchText
      ? `${API_BASE_URL}/admins/${searchType === 'username' ? 'username' : 'name'}/${searchText}?page=${pagination.current}&pageSize=${pagination.pageSize}`
      : `${API_BASE_URL}/admins?page=${pagination.current}&pageSize=${pagination.pageSize}`;

    fetch(url, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 200) {
          if (searchType === 'username') {
            setAdmins(Array.isArray(data.data) ? data.data : [data.data]);
          } else {
            setAdmins(data.data);
          }
          setPagination({ ...pagination, total: data.total });
        } else if (searchType === 'username' && data.code === 404) {
          setAdmins([]);
          setPagination({ ...pagination, total: 0 });
        }
        setLoading(false); // 加载完成
      })
      .catch(error => {
        console.error('Error fetching admins:', error);
        message.error('获取管理员列表时出现错误，请稍后重试');
        setLoading(false); // 加载完成，即使出错
      });
  };

  const handleTableChange = (newPagination) => {
    setPagination({ ...pagination, current: newPagination.current, pageSize: newPagination.pageSize });
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.status === 204) {
          message.success("删除成功");
          setAdmins(admins.filter(admin => admin.id !== id));
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data && data.code === 204) {
          message.success("删除成功");
          setAdmins(admins.filter(admin => admin.id !== id));
        } else if (data) {
          message.error(data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting admin:', error);
        message.error('删除管理员时出现错误，请稍后重试');
      });
  };

  const cancel = () => {
    message.error('取消删除');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`${API_BASE_URL}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null // 确保 birthday 不为 undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code === 200) {
        message.success("新增管理员成功");
        setIsModalVisible(false);
        form.resetFields();
        fetchAdmins();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Error adding admin:', error.message);
      message.error('新增管理员时出现错误，请稍后重试');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: '管理员ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: text => text === 'M' ? '男' : '女',
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '电子邮件',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '国籍',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => text === 1 ? '在职' : '离职',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个管理员吗？"
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
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ marginBottom: 16 }} size="middle">
          <Select style={{ width: 120 }} value={searchType} onChange={value => setSearchType(value)}>
            <Option value="name">姓名</Option>
            <Option value="username">用户名</Option>
          </Select>
          <Input.Search
            placeholder={`输入${searchType === 'username' ? '用户名' : '姓名'}进行搜索`}
            onSearch={value => setSearchText(value)}
            enterButton={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <button onClick={showModal}>新增管理员</button>
        </Space>
        {loading ? (
          <div>加载中...</div>
        ) : (
          <Table columns={columns} dataSource={admins} rowKey="id" pagination={pagination} onChange={handleTableChange} />
        )}
      </Space>
      <Modal
        title="新增管理员"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addAdminForm"
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
            rules={[{ required: true, message: "请选择出生日期" }]}
          >
            <DatePicker />
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
            label="国籍"
            name="nationality"
            rules={[{ required: true, message: "请输入国籍" }]}
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
            label="状态"
            name="status"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select>
              <Option value={1}>在职</Option>
              <Option value={0}>离职</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
