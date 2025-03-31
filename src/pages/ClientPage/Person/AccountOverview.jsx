// import React, { useState, useContext, useEffect } from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { UserContext } from '../../../context/store';

// const AssetVisualization = () => {
//     const [assets, setAssets] = useState([]);
//     const { user } = useContext(UserContext); // 从 UserContext 中获取用户信息
//     console.log('user.id',user.id);
    

//     useEffect(() => {
//         if (user && user.id) { // 检查用户信息和用户 id 是否存在
//             const fetchAssets = async () => {
//                 try {
//                     const response = await fetch(`http://localhost:9001/api/assets/clients/${user.id}`);
//                     const data = await response.json();
//                     if (data.code === 200) {
//                         setAssets(data.data);
//                     } else {
//                         console.error('查询失败:', data.message);
//                     }
//                 } catch (error) {
//                     console.error('网络错误:', error);
//                 }
//             };
//             fetchAssets();
//         }
//     }, [user]); // 当 user 变化时重新执行 useEffect

//     return (
//         <div className="p-8">
//             <h1 className="text-3xl font-bold mb-4">客户资产信息可视化</h1>
//             {assets.length > 0 && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-white p-4 rounded shadow">
//                         <h2 className="text-xl font-bold mb-2">资产信息表格</h2>
//                         <table className="w-full border-collapse">
//                             <thead>
//                                 <tr>
//                                     <th className="border px-4 py-2">记录日期</th>
//                                     <th className="border px-4 py-2">利润率</th>
//                                     <th className="border px-4 py-2">产品类型</th>
//                                     <th className="border px-4 py-2">产品 ID</th>
//                                     <th className="border px-4 py-2">购买比例</th>
//                                     <th className="border px-4 py-2">日总价值</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {assets.map((asset, index) => (
//                                     <tr key={index}>
//                                         <td className="border px-4 py-2">{asset.record_date}</td>
//                                         <td className="border px-4 py-2">{asset.profit_rate}</td>
//                                         <td className="border px-4 py-2">{asset.product_type}</td>
//                                         <td className="border px-4 py-2">{asset.product_id}</td>
//                                         <td className="border px-4 py-2">{asset.purchase_ratio}</td>
//                                         <td className="border px-4 py-2">{asset.daily_total_value}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                     <div className="bg-white p-4 rounded shadow">
//                         <h2 className="text-xl font-bold mb-2">利润率柱状图</h2>
//                         <BarChart
//                             width={500}
//                             height={300}
//                             data={assets}
//                             margin={{
//                                 top: 20,
//                                 right: 30,
//                                 left: 20,
//                                 bottom: 5
//                             }}
//                         >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="record_date" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="profit_rate" fill="#8884d8" />
//                         </BarChart>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AssetVisualization;

import React, { useState, useContext, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Scatter,
    ScatterChart
} from 'recharts';
import { UserContext } from '../../../context/store';

const AssetVisualization = () => {
    const staticAssets = [
        {
            record_date: '2024-01-01',
            profit_rate: 0.05,
            product_type: '股票',
            product_id: 'P001',
            purchase_ratio: 0.2,
            daily_total_value: 10000
        },
        {
            record_date: '2024-01-02',
            profit_rate: 0.03,
            product_type: '基金',
            product_id: 'P002',
            purchase_ratio: 0.3,
            daily_total_value: 15000
        },
        {
            record_date: '2024-01-03',
            profit_rate: 0.02,
            product_type: '债券',
            product_id: 'P003',
            purchase_ratio: 0.5,
            daily_total_value: 20000
        },
        {
            record_date: '2024-01-04',
            profit_rate: 0.01,
            product_type: '股票',
            product_id: 'P001',
            purchase_ratio: 0.1,
            daily_total_value: 8000
        },
        {
            record_date: '2024-01-05',
            profit_rate: 0.04,
            product_type: '债券',
            product_id: 'P003',
            purchase_ratio: 0.2,
            daily_total_value: 25000
        },
        {
            record_date: '2024-01-06',
            profit_rate: 0.06,
            product_type: '基金',
            product_id: 'P002',
            purchase_ratio: 0.4,
            daily_total_value: 30000
        }
    ];

    const [assets, setAssets] = useState(staticAssets);
    const { user } = useContext(UserContext);
    console.log('user.id', user.id);

    useEffect(() => {
        // 可按需添加其他副作用逻辑
    }, [user]);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">客户资产利润率趋势</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-center">
                    <LineChart
                        width={800}
                        height={500}
                        data={assets}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="record_date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="profit_rate" stroke="#3b82f6" />
                        <Scatter data={assets} fill="#ef4444">
                            <ScatterChart width={800} height={500}>
                                <XAxis dataKey="record_date" />
                                <YAxis />
                                <Tooltip />
                            </ScatterChart>
                        </Scatter>
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default AssetVisualization;
    