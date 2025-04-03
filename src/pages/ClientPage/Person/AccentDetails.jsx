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
    }, [user]);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h3 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">个人中心&gt;资产明细</h3>
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
