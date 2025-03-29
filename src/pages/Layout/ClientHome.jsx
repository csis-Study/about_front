import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { PieChartOutlined, SolutionOutlined, TransactionOutlined, NotificationOutlined } from "@ant-design/icons";
import Logout from '../../components/Logout'
import PersonIndex from '../ClientPage/Person/PersonIndex'

const { Header, Content, Sider } = Layout;

const roleModules = {
    client: {
        menus: [
            {
                key: "homepage",
                icon: <NotificationOutlined />,
                label: "客户首页",
                // children: [
                //     { key: "unread", label: "未读消息" },
                //     { key: "all", label: "全部通知" },
                // ],
            },
            {
                key: "assets",
                icon: <PieChartOutlined />,
                label: "个人中心",
                children: [
                    { key: "balance", label: "账户总览" },
                    { key: "portfolio", label: "投资组合" },
                    { key: "details", label: "资产明细" },
                ],
            },
            {
                key: "recommendations",
                icon: <SolutionOutlined />,
                label: "推荐方案",
                children: [
                    { key: "current", label: "推荐组合" },
                    { key: "history", label: "历史方案" },
                ],
            },
            {
                key: "transactions",
                icon: <TransactionOutlined />,
                label: "交易中心",
                children: [
                    // { key: "new", label: "新建交易" },
                    { key: "records", label: "交易记录" },
                ],
            },
            {
                key: "financial",
                icon: <TransactionOutlined />,
                label: "金融",// 投资组合、投资推荐、产品
                children: [
                    { key: "investment", label: "投资组合" },
                    { key: "recommendations", label: "投资推荐" },
                    { key: "products", label: "产品" },
                ],
            },
        ],
        contentHeader: "客户工作台",
    },
};

const ClientHome = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKeys, setSelectedKeys] = React.useState(["1"]);

    const renderContent = () => {
        const moduleMap = {
            balance: <div>账户余额内容...</div>,
            portfolio: <div>投资组合分析...</div>,
            // ...
            default: <div><PersonIndex></PersonIndex></div>,
        };

        return moduleMap[selectedKeys[0]] || moduleMap.default;
    };

    return (
        <Layout>
            <Header className="header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={[
                        {
                            key: "dashboard",
                            label: roleModules.client.contentHeader,
                        },
                    ]}
                />
                <div className="logout-container">
                    <Logout />
                </div>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        selectedKeys={selectedKeys}
                        style={{ height: "100%", borderRight: 0 }}
                        items={roleModules.client.menus}
                        onSelect={({ key }) => setSelectedKeys([key])}
                    />
                </Sider>
                <Layout style={{ padding: "24px" }}>
                    <Content
                        style={{
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ClientHome;