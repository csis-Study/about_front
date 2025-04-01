import React from "react";
import { Layout, Menu, theme } from "antd";
import {
  TeamOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import AdminManage from "../AdminPage/UserManage/AdminManage";
import ComplianceManage from "../AdminPage/UserManage/ComplianceManage";
import RiskeManage from "../AdminPage/UserManage/RiskeManage";
import AdvisorManage from "../AdminPage/UserManage/AdvisorManage";
import { RoleConfiguration, AccessControl, RunningStatus, SystemLogs } from "../AdminPage/RoleConfiguration/RoleConfiguration";
import Logout from "../../components/Logout";

const { Header, Content, Sider } = Layout;

const roleModules = {
  admin: {
    menus: [
      {
        key: "users",
        icon: <TeamOutlined />,
        label: "用户管理",
        children: [
          { key: "adminList", label: "管理员列表" },
          { key: "complianceList", label: "合规人员列表" },
          { key: "riskList", label: "风控人员列表" },
          { key: "advisorList", label: "客户经理列表" },
        ],
      },
      {
        key: "permissions",
        icon: <SettingOutlined />,
        label: "权限管理",
        children: [
          { key: "roles", label: "角色配置" },
          { key: "access", label: "访问控制" },
        ],
      },
      {
        key: "monitoring",
        icon: <DashboardOutlined />,
        label: "系统监控",
        children: [
          { key: "status", label: "运行状态" },
          { key: "logs", label: "系统日志" },
        ],
      },
    ],
    contentHeader: "系统管理控制台",
  },
};

const AdminHome = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedKeys, setSelectedKeys] = React.useState(["1"]);

  const renderContent = () => {
    const moduleMap = {
      adminList: (
        <div>
          <AdminManage></AdminManage>
        </div>
      ),
      complianceList: (
        <div>
          <ComplianceManage></ComplianceManage>
        </div>
      ),
      riskList: (
        <div>
          <RiskeManage></RiskeManage>
        </div>
      ),
      advisorList: (
        <div>
          <AdvisorManage></AdvisorManage>
        </div>
      ),
      roles: (
        <div>
          <RoleConfiguration></RoleConfiguration>
        </div>
      ),
      access: (
        <div>
          <AccessControl></AccessControl>
        </div>
      ),
      status: (
        <div>
          <RunningStatus></RunningStatus>
        </div>
      ),
      logs: (
        <div>
          <SystemLogs></SystemLogs>
        </div>
      ),
      // ...
      default: <div>请选择功能模块</div>,
    };

    return moduleMap[selectedKeys[0]] || moduleMap.default;
  };

  return (
    <Layout>
      <Header className="header">
        <div className="left-wrap">
          <div className="title">私⼈银⾏管理平台</div>
          <Menu
            theme="dark"
            mode="horizontal"
            items={[
              {
                key: "dashboard",
                label: roleModules.admin.contentHeader,
              },
            ]}
          />
        </div>
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
            items={roleModules.admin.menus}
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

export default AdminHome;
