import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { AuditOutlined, UserSwitchOutlined } from "@ant-design/icons";
import Logout from '../../components/Logout'

const { Header, Content, Sider } = Layout;

const roleModules = {
    complianceOfficer: {
        menus: [
            {
                key: "compliance-review",
                icon: <AuditOutlined />,
                label: "合规审批",
                children: [
                    { key: "pending", label: "待审交易" },
                    { key: "policies", label: "合规政策" },
                ],
            },
            {
                key: "audit",
                icon: <UserSwitchOutlined />,
                label: "合规审计",
                children: [
                    { key: "logs", label: "操作日志" },
                    { key: "reports", label: "审计报告" },
                ],
            },
        ],
        contentHeader: "合规⼈员工作台",
    },
};

const ComplianceOfficerHome = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKeys, setSelectedKeys] = React.useState(["1"]);

    const renderContent = () => {
        const moduleMap = {
            pending: <div>待审交易内容...</div>,
            policies: <div>合规政策内容...</div>,
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
                            label: roleModules.complianceOfficer.contentHeader,
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
                        items={roleModules.complianceOfficer.menus}
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

export default ComplianceOfficerHome;