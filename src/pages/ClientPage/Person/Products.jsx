import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Spin, message, Modal } from 'antd';

const { Option } = Select;

const Products = () => {
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

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // 每天零点更新日期
        const timer = setInterval(() => {
          const now = new Date();
          if (now.toDateString() !== currentDate.toDateString()) {
            setCurrentDate(now);
          }
        }, 60000); // 每分钟检查一次
      
        return () => clearInterval(timer);
      }, [currentDate]);

      

    const fetchProducts = async () => {
        setLoading(true);
        try {
          let url;
          const params = new URLSearchParams({
            page: pagination.current,
            size: pagination.pageSize,
          });
      
          // 根据搜索类型构造请求参数
          if (searchType === "groupId") {
            message.error("暂不支持按产品ID查询");
            return;
          } else if (searchType === "groupName") {
            url = `http://localhost:9002/api/products/type`;
            params.append("type", searchValue);
          } else if (searchType === "all") {
            url = `http://localhost:9002/api/products/search`; 
            params.append("name", "");
          } else {
            url = `http://localhost:9002/api/products/search`;
            params.append("name", searchValue);
          }
      
          const response = await fetch(`${url}?${params}`);
          if (!response.ok) throw new Error("请求失败");
          
          const result = await response.json();
          if (result.code !== 200) throw new Error(result.msg);
      
          setProductItems(result.data.content);
          setPagination({
            ...pagination,
            total: result.data.totalElements,
          });
        } catch (error) {
          message.error(error.message);
        } finally {
          setLoading(false);
        }
      };


    const handleSearch = async () => {
        try {
            const values = await searchForm.validateFields();
            setSearchValue(values.searchValue);
            setPagination({ ...pagination, current: 1 });
            fetchProducts();
        } catch (error) {
            message.error('请输入查询值');
        }
    };

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
        fetchProducts();
    };

    const columns = [
        {
            title: '产品 ID',
            dataIndex: 'productId',
            key: 'productId'
        },
        {
            title: '产品类型',
            dataIndex: 'productType',
            key: 'productType'
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: '今日市值',
            dataIndex: 'netValue',
            key: 'netValue'
        },
        {
            title: '今日浮动比率',
            dataIndex: 'floatRate',
            key: 'floatRate'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        }
    ];

    return (
        <div>
            <h4>金融 &gt; 产品展示</h4>
            <Form form={searchForm} layout="inline" style={{ margin: '20px 0' }}>
                <Form.Item label="查询类型">
                    <Select value={searchType} onChange={(value) => setSearchType(value)}>
                        <Option value="all">显示所有信息</Option>
                        <Option value="groupId">按产品 ID 查询</Option>
                        <Option value="groupName">按产品类型查询</Option>
                    </Select>
                </Form.Item>
                {searchType !== 'all' && (
                    <Form.Item name="searchValue" rules={[{ required: true, message: '请输入查询值' }]}>
                        <Input placeholder="请输入查询值" />
                    </Form.Item>
                )}
                <Form.Item>
                    <Button type="primary" onClick={handleSearch}>
                        查询
                    </Button>
                </Form.Item>

                {/* 新增日期显示 */}
                <Form.Item style={{ marginLeft: 'auto', padding: '0 16px' }}>
                    <span style={{ fontSize: 14 }}>
                        今日日期：{currentDate.toLocaleDateString('zh-CN')}
                    </span>
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
        </div>
    );
};

export default Products;
