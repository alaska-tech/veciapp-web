import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  Layout,
  theme,
  Menu,
  Avatar,
  Typography,
  Dropdown,
  Divider,
  Space,
  Button,
} from "antd";
import {
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import type { BreadcrumbProps, MenuProps } from "antd";
import Link from "next/link";

const lateralMenuItems: MenuProps["items"] = [
  {
    key: `/(admin)/home`,
    icon: React.createElement(HomeOutlined),
    label: <Link href="/(admin)/home">Inicio</Link>,
    children: undefined,
  },
  {
    key: `/(admin)/users`,
    icon: React.createElement(UserOutlined),
    label: <Link href="/(admin)/users">Usuarios</Link>,
    children: undefined,
  },
  {
    key: `/(admin)/configuration`,
    icon: React.createElement(SettingOutlined),
    label: <Link href="/(admin)/configuration">Configuración</Link>,
    children: undefined,
  },
];

const siderWidthCollapsed = 80;
const siderWidthExpanded = 200;

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    token: { borderRadiusLG, colorBgElevated, boxShadowSecondary },
  } = theme.useToken();
  const contentStyle = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };
  const { Header, Content, Sider, Footer } = Layout;
  const { Text, Title } = Typography;
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState<boolean>(false);

  const getBreadcrumItems = (): BreadcrumbProps["items"] => {
    const pathSegments = router.pathname.split("/").slice(2);

    return pathSegments.map((segment, index) => {
      const isDynamicSegment = segment.startsWith("[") && segment.endsWith("]");
      const dynamicSegmentKey = isDynamicSegment ? segment.slice(1, -1) : null;
      const dynamicSegmentValue = dynamicSegmentKey
        ? router.query[dynamicSegmentKey]
        : null;

      const path = `/${router.pathname
        .split("/")
        .slice(0, index + 3)
        .map((value) =>
          value.startsWith("[") && value.endsWith("]")
            ? router.query[value.slice(1, -1)]
            : value
        )
        .join("/")}`;

      const label =
        breadcrumItemTree.children?.find((item) => item.key === segment)
          ?.value || (index === pathSegments.length - 1 ? segment : null);

      return {
        key: path,
        title: (
          <Link href={path}>
            {isDynamicSegment ? dynamicSegmentValue : label}
          </Link>
        ),
      };
    });
  };

  return (
    <Layout style={{}}>
      <Sider
        collapsible
        onCollapse={(collapsed) => setSideMenuCollapsed(collapsed)}
        theme="light"
        width={siderWidthExpanded}
        style={{
          overflow: "auto",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Image
          src={"/images/logo.png"}
          alt={"veciapp-logo"}
          width={100}
          height={60}
          style={{
            width: "auto",
            objectFit: "cover",
            display: "flex",
            margin: "16px auto",
          }}
        ></Image>
        <Menu
          mode="inline"
          items={lateralMenuItems}
          selectedKeys={[router.pathname.split("/").slice(0, 3).join("/")]}
        />
      </Sider>
      <Layout
        style={{
          padding: "16px",
          marginLeft: sideMenuCollapsed
            ? siderWidthCollapsed
            : siderWidthExpanded,
        }}
      >
        <Header
          style={{
            backgroundColor: "transparent",
            height: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    label: "Cerrar sesión",
                    icon: <LogoutOutlined />,
                    onClick: () => {
                      router.push("/");
                      //signOut!()
                    },
                  },
                ],
              }}
              trigger={["click"]}
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  <Space
                    style={{
                      padding: 8,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Avatar icon={<UserOutlined />} />
                    <Typography.Paragraph
                      strong
                      style={{ fontSize: "18px", marginBottom: 0 }}
                    >
                      John Doe
                    </Typography.Paragraph>
                    <Text type="secondary">Compañia ABCDF</Text>
                  </Space>
                  <Divider style={{ margin: 0 }} />
                  {React.cloneElement(menu as React.ReactElement)}
                </div>
              )}
            >
              <Button
                size="large"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Avatar icon={<UserOutlined />} />
                <DownOutlined />
              </Button>
            </Dropdown>
            <AutoBreadcrumb />
          </div>
          <AutoTitle />
        </Header>
        <Content style={{ padding: "0px 50px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          <Title level={5}>Alaska Tech</Title>
          <Text type="secondary">
            Creamos soluciones de software personalizadas que impulsan el
            crecimiento de tu negocio.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;

interface TreeStruct {
  key: string;
  value: any;
  children?: TreeStruct[];
}
const breadcrumItemTree: TreeStruct = {
  key: "(admin)",
  value: null,
  children: [
    {
      key: "home",
      value: "Inicio",
    },
    {
      key: "users",
      value: "Usuarios",
      children: [
        {
          key: "[id]",
          value: "[{id}]",
        },
      ],
    },
    {
      key: "configuration",
      value: "Configuración",
    },
  ],
};

const AutoBreadcrumb = () => {
  const router = useRouter();
  const getBreadcrumItems = (): BreadcrumbProps["items"] => {
    const pathSegments = router.pathname.split("/").slice(2);
    return pathSegments.map((segment, index) => {
      const isDynamicSegment = segment.startsWith("[") && segment.endsWith("]");
      const dynamicSegmentKey = isDynamicSegment ? segment.slice(1, -1) : null;
      const dynamicSegmentValue = dynamicSegmentKey
        ? router.query[dynamicSegmentKey]
        : null;
      const path = `/${router.pathname
        .split("/")
        .slice(0, index + 3)
        .map((value) =>
          value.startsWith("[") && value.endsWith("]")
            ? router.query[value.slice(1, -1)]
            : value
        )
        .join("/")}`;

      const label =
        breadcrumItemTree.children?.find((item) => item.key === segment)
          ?.value || (index === pathSegments.length - 1 ? segment : null);
      return {
        key: path,
        title: (
          <Link href={path}>
            {isDynamicSegment ? dynamicSegmentValue : label}
          </Link>
        ),
      };
    });
  };
  return (
    <Breadcrumb
      style={{ margin: "16px 0" }}
      items={getBreadcrumItems()}
    ></Breadcrumb>
  );
};

const titles: Record<string, string> = {
  "/(admin)/home": "Dashboard",
  "/(admin)/users": "Usuarios",
  "/(admin)/configuration": "Configuración",
};
const subtitles: Record<string, string> = {
  "/(admin)/home": "Esta es la pagina de Inicio",
  "/(admin)/users": "Esta es la pagina de Usuarios",
  "/(admin)/configuration": "Esta es la pagina de Configuración",
};
const AutoTitle = () => {
  const router = useRouter();
  return (
    <>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {titles[router.pathname]}
      </Typography.Title>
      <Typography.Text type="secondary" style={{ margin: "0 0 16px 0" }}>
        {subtitles[router.pathname]}
      </Typography.Text>
    </>
  );
};
