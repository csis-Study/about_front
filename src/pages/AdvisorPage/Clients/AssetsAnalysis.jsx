import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// 模拟资产数据
const mockAssetData = [
    {
        assetType: "股票",
        percentage: 40,
    },
    {
        assetType: "基金",
        percentage: 30,
    },
    {
        assetType: "理财",
        percentage: 20,
    },
    {
        assetType: "股票",
        percentage: 10,
    },
];

const AssetAnalysis = () => {
    const [assetData, setAssetData] = useState(mockAssetData);

    useEffect(() => {
        // 这里可以替换为从后端获取数据的逻辑
        // 例如使用 axios 进行数据请求
        // const fetchData = async () => {
        //     try {
        //         const response = await axios.get('/api/asset-data');
        //         setAssetData(response.data);
        //     } catch (error) {
        //         console.error('数据获取失败:', error);
        //     }
        // };
        // fetchData();
    }, []);

    return (
        <Card
            title="资产分析"
            bordered={true}
            style={{ width: 800, margin: "0 auto" }}
        >
            <BarChart
                width={700}
                height={400}
                data={assetData}
                margin={{
                    top: 50,
                    right: 30,
                    left: 20,
                    bottom: 50,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assetType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" fill="#8884d8" />
            </BarChart>
            <div style={{ textAlign: "center", marginTop: 20 }}>
                <Button type="primary">查看详细分析</Button>
            </div>
        </Card>
    );
};

export default AssetAnalysis;