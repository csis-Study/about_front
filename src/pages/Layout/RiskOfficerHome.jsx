import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { SafetyCertificateOutlined, AuditOutlined } from "@ant-design/icons";
import Logout from '../../components/Logout'

const { Header, Content, Sider } = Layout;

const roleModules = {
    riskOfficer: {
        menus: [
            {
                key: "kyc",
                icon: <SafetyCertificateOutlined />,
                label: "KYC评估",
                children: [
                    { key: "pending", label: "待评估客户" },
                    { key: "history", label: "评估记录" },
                ],
            },
            {
                key: "risk-review",
                icon: <AuditOutlined />,
                label: "风险审批",
                children: [
                    { key: "pending", label: "待审批交易" },
                    { key: "rules", label: "风控规则" },
                ],
            },
        ],
        contentHeader: "⻛控⼈员工作台",
    },
};

const RiskOfficerHome = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKeys, setSelectedKeys] = React.useState(["1"]);

    const renderContent = () => {
        const moduleMap = {
            pending: <div>待评估客户内容...</div>,
            history: <div>评估记录内容...</div>,
            // ...
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
                            label: roleModules.riskOfficer.contentHeader,
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
                        items={roleModules.riskOfficer.menus}
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

export default RiskOfficerHome;