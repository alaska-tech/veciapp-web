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
  AppstoreOutlined,
  DollarOutlined,
  HomeOutlined,
  LogoutOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import type { BreadcrumbProps, MenuProps } from "antd";
import Link from "next/link";
import AuthVerifier, { RoleType } from "../auth/AuthVerifier";

const siderWidthCollapsed = 80;
const siderWidthExpanded = 200;

const lateralMenuItems: Record<string, MenuProps["items"]> = {
  "(admin)": [
    {
      key: `/(admin)/home`,
      icon: React.createElement(HomeOutlined),
      label: <Link href="/(admin)/home">Inicio</Link>,
      children: undefined,
    },
    {
      key: `sub-users`,
      label: "Usuarios",
      type: "group",
      children: [
        {
          key: `/(admin)/vendors`,
          icon: React.createElement(ShopOutlined),
          label: <Link href="/(admin)/vendors">Proveedores</Link>,
          children: undefined,
        },
        {
          key: `/(admin)/users`,
          icon: React.createElement(TeamOutlined),
          label: <Link href="/(admin)/users">Clientes</Link>,
          children: undefined,
        },
      ],
    },
    {
      key: `sub-management`,
      label: "Gestión",
      type: "group",
      children: [
        {
          key: `/(admin)/payments`,
          icon: React.createElement(DollarOutlined),
          label: <Link href="/(admin)/payments">Pagos</Link>,
          children: undefined,
        },
        {
          key: `/(admin)/conciliations`,
          icon: React.createElement(ReconciliationOutlined),
          label: <Link href="/(admin)/conciliations">Conciliaciones</Link>,
          children: undefined,
        },
        {
          key: `/(admin)/branches`,
          icon: React.createElement(AppstoreOutlined),
          label: <Link href="/(admin)/branches">Sucursales</Link>,
          children: undefined,
        },
      ],
    },
    {
      key: `sub-configuration`,
      label: "Configuración",
      type: "group",
      children: [
        {
          key: `/(admin)/configuration`,
          icon: React.createElement(SettingOutlined),
          label: <Link href="/(admin)/configuration">Parámetros</Link>,
          children: undefined,
        },
      ],
    },
  ],
  "(vendor)": [
    {
      key: `/(vendor)/home`,
      icon: React.createElement(HomeOutlined),
      label: <Link href="/(vendor)/home">Inicio</Link>,
      children: undefined,
    },
  ],
};

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { Header, Content, Sider, Footer } = Layout;
  const { Text, Title } = Typography;
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState<boolean>(false);

  return (
    <AuthVerifier
      requireAuth={false}
      roles={[router.pathname.split("/")[1] as RoleType[number]]}
    >
      <Layout>
        <Sider
          collapsible
          onCollapse={(collapsed) => setSideMenuCollapsed(collapsed)}
          theme="light"
          width={siderWidthExpanded}
          style={{
            overflow: "auto",
            height: "calc(100vh - 50px)",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <div>
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
              items={lateralMenuItems[router.pathname.split("/")[1]]}
              selectedKeys={[router.pathname.split("/").slice(0, 3).join("/")]}
            />
          </div>
          <ProfileButton
            width={sideMenuCollapsed ? siderWidthCollapsed : siderWidthExpanded}
          />
        </Sider>
        <Layout
          style={{
            padding: "16px",
            marginLeft: sideMenuCollapsed
              ? siderWidthCollapsed
              : siderWidthExpanded,
            width: "100%",
          }}
        >
          <Header
            style={{
              backgroundColor: "transparent",
              height: "auto",
              lineHeight: "36px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <AutoBreadcrumb />
              <AutoTitle />
            </div>
          </Header>
          <Content
            style={{
              padding: "12px 50px",
              overflow: "auto",
              alignSelf: "center",
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <Title level={5}>Alaska Tech</Title>
            <Text type="secondary">
              Creamos soluciones de software personalizadas que impulsan el
              crecimiento de tu negocio.
            </Text>
          </Footer>
        </Layout>
      </Layout>
    </AuthVerifier>
  );
}

export default DashboardLayout;

const ProfileButton = (props: { width: number }) => {
  const router = useRouter();
  const {
    token: { borderRadiusLG, colorBgElevated, boxShadowSecondary },
  } = theme.useToken();
  const contentStyle = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };
  const isCollapsed = props.width < 90;
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "profile",
            label: "Configuración",
            icon: <SettingOutlined />,
            onClick: () => {
              router.push(`/${router.pathname.split("/")[1]}/profile`);
              //signOut!()
            },
          },
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
            <Typography.Text type="secondary">
              julianangulop@gmail.com
            </Typography.Text>
          </Space>
          <Divider style={{ margin: 0 }} />
          {React.cloneElement(menu as React.ReactElement)}
        </div>
      )}
    >
      <Button
        size="large"
        type="text"
        icon={<Avatar icon={<UserOutlined />} />}
        style={{
          width: props.width,
          position: "fixed",
          bottom: 48,
          overflow: "hidden",
          height: 64,
        }}
      >
        <Typography.Text
          type="secondary"
          style={{
            overflow: "hidden",
            display: isCollapsed ? "none" : "inherit",
          }}
        >
          Julian Angulo
        </Typography.Text>
      </Button>
    </Dropdown>
  );
};

interface TreeStruct {
  key: string;
  value: any;
  children?: TreeStruct[];
}
const breadcrumItemTree: TreeStruct[] = [
  {
    key: "(admin)",
    value: null,
    children: [
      {
        key: "home",
        value: "Inicio",
      },
      {
        key: "profile",
        value: "Perfil de usuario",
      },
      {
        key: "users",
        value: "Clientes",
        children: [
          {
            key: "newUser",
            value: "Nuevo cliente",
          },
          {
            key: "[id]",
            value: "[{id}]",
          },
        ],
      },
      {
        key: "vendors",
        value: "Proveedores",
        children: [
          {
            key: "[id]",
            value: "[{id}]",
          },
          {
            key: "newVendor",
            value: "Nuevo proveedor",
          },
        ],
      },
      {
        key: "branches",
        value: "Sucursales",
        children: [
          {
            key: "[id]",
            value: "[{id}]",
          },
          {
            key: "newBranch",
            value: "Nueva tienda",
          },
        ],
      },
      {
        key: "payments",
        value: "Pagos",
      },
      {
        key: "conciliations",
        value: "Conciliaciones",
      },
      {
        key: "configuration",
        value: "Parámetros",
      },
    ],
  },
  {
    key: "(vendor)",
    value: null,
    children: [
      {
        key: "home",
        value: "Inicio",
      },
      {
        key: "profile",
        value: "Perfil de usuario",
      },
    ],
  },
];

const AutoBreadcrumb = () => {
  const router = useRouter();
  const getBreadcrumItems = (): BreadcrumbProps["items"] => {
    const pathSegments = router.pathname.split("/").slice(1);
    const items = pathSegments.map((segment, index, segments) => {
      if (segment.startsWith("(") && segment.endsWith(")")) return null;
      let currentBreadcrumbBranch = breadcrumItemTree;
      for (let count = 0; count < index; count++) {
        const newBreadcrumbBranch = currentBreadcrumbBranch.find(
          (item) => item.key === segments[count]
        );
        currentBreadcrumbBranch = newBreadcrumbBranch?.children || [];
      }
      const isDynamicSegment = segment.startsWith("[") && segment.endsWith("]");
      const dynamicSegmentKey = isDynamicSegment ? segment.slice(1, -1) : null;
      const dynamicSegmentValue = dynamicSegmentKey
        ? router.query[dynamicSegmentKey]
        : null;
      const path = `${router.pathname
        .split("/")
        .slice(0, index + 2)
        .map((value) =>
          value.startsWith("[") && value.endsWith("]")
            ? router.query[value.slice(1, -1)]
            : value
        )
        .join("/")}`;

      const label =
        currentBreadcrumbBranch.find((item) => item.key === segment)?.value ||
        segment ||
        null;
      if (!label) return null;
      return {
        key: path,
        title: (
          <Link href={path}>
            {isDynamicSegment ? dynamicSegmentValue : label}
          </Link>
        ),
      };
    });
    return items.filter((item) => !!item) as BreadcrumbProps["items"];
  };
  return (
    <>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={getBreadcrumItems()}
      ></Breadcrumb>
    </>
  );
};

const titles: Record<string, string> = {
  "/(admin)/home": "Bienvenido",
  "/(admin)/profile": "Perfil de usuario",
  "/(admin)/users": "Clientes",
  "/(admin)/users/newUser": "Nuevo usuario",
  "/(admin)/branches": "Sucursales",
  "/(admin)/vendors": "Vendedores",
  "/(admin)/configuration": "Parámetros",
  "/(admin)/conciliations": "Conciliaciones",
  "/(admin)/payments": "Pagos",
  "/(vendor)/home": "Dashboard",
  "/(vendor)/profile": "Perfil de usuario",
};
const subtitles: Record<string, string> = {
  "/(admin)/home": "Resumen general",
  "/(admin)/profile": "Esta es la pagina de perfil de usuario",
  "/(admin)/users": "Esta es la pagina de Clientes",
  "/(admin)/users/newUser": "Esta es la pagina de Nuevo usuario",
  "/(admin)/branches": "Esta es la pagina de sucursales",
  "/(admin)/vendors": "Esta es la pagina de vendedores",
  "/(admin)/configuration": "Esta es la pagina de Parámetros",
  "/(admin)/conciliations": "Esta es la pagina de conciliaciones",
  "/(admin)/payments": "Esta es la pagina de pagos",
  "/(vendor)/home": "Esta es la pagina de Inicio",
  "/(vendor)/profile": "Esta es la pagina de perfil de usuario",
};
const AutoTitle = () => {
  const router = useRouter();
  return (
    <>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {titles[router.pathname]}
      </Typography.Title>
      <Typography.Text type="secondary">
        {subtitles[router.pathname]}
      </Typography.Text>
    </>
  );
};
