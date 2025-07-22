import React, { useEffect, useState } from "react";
import {
  AreaChartOutlined,
  BankOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(["1"]);

  const location = useLocation();

  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const path = location.pathname;


    if (path === "/dashboard") setSelectedPage(["1"]);
    else if (path === "/warehouses") setSelectedPage(["2.1"]);
    else if (path === "/warehouses/report") setSelectedPage(["2.2"]);
    else if (path === "/users") setSelectedPage(["3"]);
  }, [location.pathname]);

  const handleLogout = () => {
    setIsLoggingOut(true);

    localStorage.clear();
    // Use setTimeout to ensure cleanup is complete and UI updates before navigation
    setTimeout(() => {
      navigate("/login");
      setIsLoggingOut(false); 
    }, 100);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={siderStyle} trigger={null} theme="light" collapsible collapsed={collapsed}>
        <div
          className={`capitalize font-bold p-4 text-sm text-slate-900 flex items-center justify-center ${
            !collapsed ? "whitespace-nowrap" : ""
          }`}
        >
          {!collapsed ? "warehouse admin system" : "WAS"}
        </div>
        <Menu
          className="!border-none"
          theme="light"
          mode="inline"
          selectedKeys={selectedPage}
          items={[
            {
              key: "1",
              icon: <AreaChartOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <BankOutlined />,
              label: "Warehouses",
              children: [
                { key: "2.1", icon: <TableOutlined />, label: "List" },
              ],
            },
            {
              key: "3",
              icon: <TeamOutlined />,
              label: "Users",
            },
            {
              key: "logout",
              icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
              label: <span className="text-base font-bold" style={{ color: '#ff4d4f' }}>Logout</span>,
            }
          ]}
          onClick={({ key }) => {
            if (key === "1") navigate("/dashboard");
            else if (key === "2.1") navigate("/warehouses");
            else if (key === "3") navigate("/users");
            else if (key === "logout") {
              handleLogout();
            }
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
