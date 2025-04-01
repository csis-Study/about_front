import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { TeamOutlined, SolutionOutlined, TransactionOutlined } from "@ant-design/icons";
import Logout from '../../components/Logout'
import ProductManage from '../AdvisorPage/Products/ProductManage';
import ProductItem from '../AdvisorPage/Products/ProductItem';
import ClientManage from '../AdvisorPage/Clients/ClientManage';
import CreateRecommendation from '../AdvisorPage/Products/CreateRecommendation';

const { Header, Content, Sider } = Layout;

const roleModules = {
    advisor: {
        menus: [
            {
                key: "clients",
                icon: <TeamOutlined />,
                label: "客户管理",
                children: [
                    { key: "profile", label: "客户档案" },
                    { key: "analysis", label: "资产分析" },
                ],
            },
            {
                key: "plans",
                icon: <SolutionOutlined />,
                label: "推荐方案",
                children: [
                    { key: "create", label: "新建方案" },
                    { key: "template", label: "客户推荐" },
                ],
            },
            {
                key: "advisor-transactions",
                icon: <TransactionOutlined />,
                label: "委托交易",
                children: [
                    { key: "execute", label: "发起交易" },
                    { key: "approvals", label: "待审批交易" },
                ],
            },
            {
                key: "product",
                icon: <TransactionOutlined />,
                label: "产品管理",
                children: [
                    { key: "plists", label: "产品组合" },
                    { key: "pdetails", label: "产品详情" },
                ],
            },
        ],
        contentHeader: "客户经理工作台",
    },
};

const AdvisorHome = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKeys, setSelectedKeys] = React.useState(["1"]);

    const renderContent = () => {
        const moduleMap = {
            profile: <div><ClientManage /></div>,
            analysis: <div>资产分析内容...</div>,
            create:<div><CreateRecommendation /></div>,
            plists: <div><ProductManage></ProductManage></div>,
            pdetails: <div><ProductItem /></div>,
            default: <div>请选择功能模块</div>,
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
                            label: roleModules.advisor.contentHeader,
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
                        items={roleModules.advisor.menus}
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

export default AdvisorHome;