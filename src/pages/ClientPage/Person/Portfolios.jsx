import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Spin, message, Modal } from 'antd';

const { Option } = Select;

const Portfolios = () => {
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

    // const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchPortfolios();
    }, []);

    

    const fetchPortfolios = async () => {
        setLoading(true);
        try {
          let url;
          const params = new URLSearchParams({
            page: pagination.current,
            size: pagination.pageSize,
          });
      
          // 根据搜索类型构造请求
          if (searchType === "all") {
            url = "http://localhost:9002/api/product-items";
          } else if (searchType === "groupId") {
            url = "http://localhost:9002/api/product-items/group-id";
            params.append("groupId", searchValue);
          } else if (searchType === "groupName") {
            url = "http://localhost:9002/api/product-items/group-name";
            params.append("name", searchValue);
          }
      
          const response = await fetch(`${url}?${params}`);
          if (!response.ok) throw new Error("请求失败");
          
          const result = await response.json();
          if (result.code !== 200) throw new Error(result.msg);
      
          // 处理嵌套的产品数据
          const formattedData = result.data.content.map(item => ({
            ...item,
            "product.productId": item.product?.productId,
            "product.productName": item.product?.productName
          }));
      
          setProductItems(formattedData);
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
            fetchPortfolios();
        } catch (error) {
            message.error('请输入查询值');
        }
    };

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
        fetchPortfolios();
    };

    const columns = [
        {
            title: '组合项 ID',
            dataIndex: 'productItemId',
            key: 'productItemId'
        },
        {
            title: '组合 ID',
            dataIndex: 'productGroupId',
            key: 'productGroupId'
        },
        {
            title: '组合名称',
            dataIndex: 'productGroupName',
            key: 'productGroupName'
        },
        {
            title: '关联产品id',
            dataIndex: 'product.productId',
            key: 'product.productId'
        },
        {
            title: '关联产品名称',
            dataIndex: 'product.productName',
            key: 'product.productName'
        },
        {
            title: '数量',
            dataIndex: 'amount',
            key: 'amount'
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        }
    ];

    return (    
        <div>
            <h4>金融 &gt; 投资组合</h4>
            <Form form={searchForm} layout="inline" style={{ margin: '20px 0' }}>
                <Form.Item label="查询类型">
                    <Select value={searchType} onChange={(value) => setSearchType(value)}>
                        <Option value="all">显示所有信息</Option>
                        <Option value="groupId">按组合名称查询</Option>
                        <Option value="groupName">按产品名称查询</Option>
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
                {/* <Form.Item style={{ marginLeft: 'auto', padding: '0 16px' }}>
                    <span style={{ fontSize: 14 }}>
                        今日日期：{currentDate.toLocaleDateString('zh-CN')}
                    </span>
                </Form.Item> */}
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

export default Portfolios;
