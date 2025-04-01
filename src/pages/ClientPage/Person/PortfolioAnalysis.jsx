import React, { useState, useEffect} from 'react';
import { Table, Card, Select, Button, message, Spin} from 'antd';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const PortfolioAnalysis = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [metricType, setMetricType] = useState('floatRate');
  const RADIAN = Math.PI / 180;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const { Option } = Select;

  // 模拟产品数据
  const [products,setProducts] = useState([
    {
      id: '1',
      productType: '基金',
      productName: '华夏成长',
      netValue: 50000,
      floatRate: 15.0,
      BuyDate: '2023-01-01',
      status: '有效',
      amount: 150
    },
    // 更多模拟数据...
    {
      id: '2',
      productType: '股票',
      productName: '腾讯控股',
      netValue: 35000,
      floatRate: 26.8,
      BuyDate: '2023-02-15',
      status: '有效',
      amount: 100
    },
    {
      id: '3',
      productType: '理财',
      productName: '余额宝',
      netValue: 10000,
      floatRate: 0.3,
      BuyDate: '2023-03-10',
      status: '有效',
      amount: 150
    },
    {
      id: '4',
      productType: '基金',
      productName: '易方达蓝筹',
      netValue: 21000,
      floatRate: 3.2,
      BuyDate: '2023-04-05',
      status: '无效',
      amount: 100
    },
    {
      id: '5',
      productType: '股票',
      productName: '贵州茅台',
      netValue: 185000,
      floatRate: 1.5,
      BuyDate: '2023-05-20',
      status: '有效',
      amount: 150
    },
    {
      id: '6',
      productType: '理财',
      productName: '招行日日欣',
      netValue: 98000,
      floatRate: 0.15,
      BuyDate: '2023-06-01',
      status: '有效',
      amount: 200
    }
  ]);


  // 模拟历史数据（按产品ID存储）
  const historyDataMap = {
    '1': [
      { recordDate: '2023-01-01', floatRate: 15.0, netValue: 57500 },
      { recordDate: '2023-01-08', floatRate: 20, netValue: 69000 },
      { recordDate: '2023-01-15', floatRate: -5, netValue: 65550 },
      { recordDate: '2023-01-22', floatRate: -26.3, netValue: 48310.35 },
      { recordDate: '2023-01-29', floatRate: 11.7, netValue: 53962.66 }
    ],
    '2': [
      { recordDate: '2023-02-15', floatRate: -62, netValue: 13300 },
      { recordDate: '2023-02-20', floatRate: 36, netValue: 18088 },
      { recordDate: '2023-02-27', floatRate: -54, netValue: 8320.48 },
      { recordDate: '2023-03-06', floatRate: -21, netValue: 6573.18 },
      { recordDate: '2023-03-13', floatRate: 66, netValue: 10911.48 }
    ],
    '3': [
      { recordDate: '2023-03-10', floatRate: 0.28, netValue: 10028 },
      { recordDate: '2023-03-17', floatRate: 2.34, netValue: 10262.66 },
      { recordDate: '2023-03-24', floatRate: 1.62, netValue: 10428.91 },
      { recordDate: '2023-03-31', floatRate: 4.55, netValue: 10903.43 },
      { recordDate: '2023-04-07', floatRate: 3.78, netValue: 11315.58 }
    ],
    '4': [
      { recordDate: '2023-04-05', floatRate: 11.2, netValue: 23352 },
      { recordDate: '2023-04-12', floatRate: -23.7, netValue: 18051.10 },
      { recordDate: '2023-04-19', floatRate: -16.7, netValue: 15108.77 },
      { recordDate: '2023-04-26', floatRate: 26.4, netValue: 19097.48 },
      { recordDate: '2023-04-29', floatRate: 18.6, netValue: 22649.61 }
    ],
    '5': [
      { recordDate: '2023-05-20', floatRate: 16.8, netValue: 216080 },
      { recordDate: '2023-05-27', floatRate: 33.4, netValue: 288250.72 },
      { recordDate: '2023-06-03', floatRate: -11.2, netValue: 255966.64 },
      { recordDate: '2023-06-10', floatRate: 29.7, netValue: 331988.73 }
    ],
    '6': [
      { recordDate: '2023-06-01', floatRate: 0.12, netValue: 98117.6 },
      { recordDate: '2023-06-08', floatRate: 2.98, netValue: 101041.50 },
      { recordDate: '2023-06-15', floatRate: 3.01, netValue: 104082.85 },
      { recordDate: '2023-06-22', floatRate: 1.26, netValue: 105394.29 }
    ]
  };

  const PortfolioAnalysis = () => {
    // 状态定义保持不变...
    const [loading, setLoading] = useState(false);
  
    // 获取产品列表数据
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:9002/api/products?page=1&size=100');
        const result = await response.json();
        if (result.code === 200) {
          setProducts(result.data.content.map(p => ({
            ...p,
            BuyDate: p.createdAt // 假设后端返回创建时间字段
          })));
        }
      } catch (error) {
        message.error('获取产品失败');
      } finally {
        setLoading(false);
      }
    };
  
    // 获取单个产品历史数据
    const fetchHistoryData = async (productId) => {
      try {
        const response = await fetch(`http://localhost:9002/api/product-items/history/${productId}`);
        const result = await response.json();
        if (result.code === 200) {
          return result.data.map(d => ({
            ...d,
            recordDate: d.date // 假设后端返回日期字段
          }));
        }
        return [];
      } catch (error) {
        message.error('获取历史数据失败');
        return [];
      }
    };
  
    // 修改后的查询函数
    const handleQuery = async () => {
      if (selectedRowKeys.length === 0) return;
      
      setLoading(true);
      try {
        const historyData = await fetchHistoryData(selectedRowKeys[0]);
        setChartData(historyData.sort((a, b) =>
          new Date(a.recordDate) - new Date(b.recordDate)
        ));
      } finally {
        setLoading(false);
      }
    };
  
    // 初始化加载产品数据
    useEffect(() => {
      fetchProducts();
    }, []);
  
    // 其他逻辑保持不变...
    
    return (
      <div style={{ padding: 24 }}>
        <Spin spinning={loading}>
          {/* 原有Card和Table组件 */}
          <Card
            title="产品列表"
            style={{ marginBottom: 24 }}
            extra={
              <Button
                type="primary"
                onClick={handleQuery}
                disabled={!selectedRowKeys.length}
              >
                查询历史数据
              </Button>
            }
          >
            {/* 在Table中添加loading状态 */}
            <Table
              rowKey="productId"  // 修改为后端返回的字段
              columns={columns}
              dataSource={products}
              rowSelection={rowSelection}
              pagination={false}
              bordered
              loading={loading}
            />
          </Card>
  
          {/* 其他图表组件保持不变... */}
        </Spin>
      </div>
    );
  };

  //添加自定义标签渲染函数
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, value, name
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(1)}%\n(${value}份)`}
      </text>
    );
  };

  // 饼图数据计算逻辑
  const totalAmount = products.reduce((sum, p) => sum + p.amount, 0);
  const pieData = [
    {
      name: '基金',
      value: products
        .filter(p => p.productType === '基金')
        .reduce((sum, p) => sum + p.amount, 0),
      percentage: ((products
        .filter(p => p.productType === '基金')
        .reduce((sum, p) => sum + p.amount, 0) / totalAmount * 100).toFixed(1) + '%')
    },
    {
      name: '股票',
      value: products
        .filter(p => p.productType === '股票')
        .reduce((sum, p) => sum + p.amount, 0),
      percentage: ((products
        .filter(p => p.productType === '股票')
        .reduce((sum, p) => sum + p.amount, 0) / totalAmount * 100).toFixed(1) + '%')
    },
    {
      name: '理财',
      value: products
        .filter(p => p.productType === '理财')
        .reduce((sum, p) => sum + p.amount, 0),
      percentage: ((products
        .filter(p => p.productType === '理财')
        .reduce((sum, p) => sum + p.amount, 0) / totalAmount * 100).toFixed(1) + '%')
    },
  ];


  // 表格列配置
  const columns = [
    { title: '产品类型', dataIndex: 'productType' },
    { title: '产品名称', dataIndex: 'productName' },
    {
      title: '今日总市值',
      dataIndex: 'netValue',
      render: value => `${value}元`
    },
    {
      title: '涨跌比率',
      dataIndex: 'floatRate',
      render: value => `${value}%`
    },
    {
      title: '持有数量',
      dataIndex: 'amount',
      render: value => `${value}份`  // 新增数量列
    },
    { title: '购入时间', dataIndex: 'BuyDate' },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => (
        <span style={{ color: status === '有效' ? 'green' : 'red' }}>
          {status}
        </span>
      )
    }
  ];

  // // 查询历史数据
  // const handleQuery = () => {
  //   if (selectedRowKeys.length === 0) {
  //     return;
  //   }
  //   // 实际开发中这里应调用API
  //   setChartData(mockHistoryData);
  // };

  // 修改后的查询函数
  const handleQuery = () => {
    if (selectedRowKeys.length === 0) return;

    const productId = selectedRowKeys[0];
    const historyData = historyDataMap[productId] || [];

    setChartData(historyData.sort((a, b) =>
      new Date(a.recordDate) - new Date(b.recordDate)
    ));
  };

  // 行选择配置
  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: keys => setSelectedRowKeys(keys)
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 产品列表 */}
      <Card
        title="产品列表"
        style={{ marginBottom: 24 }}
        extra={
          <Button
            type="primary"
            onClick={handleQuery}
            disabled={!selectedRowKeys.length}
          >
            查询历史数据
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          rowSelection={rowSelection}
          pagination={false}
          bordered
        />
      </Card>

      {/* 图表区域 */}
      <div style={{ display: 'flex', gap: 24 }}>
        {/* 折线图 */}
        <Card title="产品历史趋势" style={{ flex: 2 }}>
          <div style={{ marginBottom: 16 }}>
            <Select
              defaultValue="floatRate"
              onChange={setMetricType}
              style={{ width: 120 }}
            >
              <Option value="floatRate">涨跌比率</Option>
              <Option value="netValue">净值</Option>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="recordDate"
                tickFormatter={date => date.split('-').slice(1).join('/')}
              />
              <YAxis
                domain={metricType === 'floatRate' ? [-100, 100] : [0, 10000]}
                tickFormatter={value =>
                  metricType === 'floatRate' ? `${value}%` : `${value}元`
                }
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={metricType}
                stroke="#1890ff"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 饼图 */}
        <Card title="产品类型分布" style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Legend
                formatter={(value) => {
                  const item = pieData.find(d => d.name === value);
                  return `${value} ${item?.percentage}`;
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value}份 (${pieData.find(d => d.name === name)?.percentage})`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioAnalysis;
