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
import AuthVerifier from "../auth/AuthVerifier";
import useAuthAction from "@/actions/auth.action";
import { UserRoleType } from "@/constants/models";

const siderWidthCollapsed = 80;
const siderWidthExpanded = 200;

const lateralMenuItems: Record<string, MenuProps["items"]> = {
  a: [
    {
      key: `/a/home`,
      icon: React.createElement(HomeOutlined),
      label: <Link href="/a/home">Inicio</Link>,
      children: undefined,
    },
    {
      key: `sub-users`,
      label: "Usuarios",
      type: "group",
      children: [
        {
          key: `/a/vendors`,
          icon: React.createElement(ShopOutlined),
          label: <Link href="/a/vendors">Proveedores</Link>,
          children: undefined,
        },
        {
          key: `/a/users`,
          icon: React.createElement(TeamOutlined),
          label: <Link href="/a/users">Clientes</Link>,
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
          key: `/a/payments`,
          icon: React.createElement(DollarOutlined),
          label: <Link href="/a/payments">Pagos</Link>,
          children: undefined,
        },
        {
          key: `/a/conciliations`,
          icon: React.createElement(ReconciliationOutlined),
          label: <Link href="/a/conciliations">Conciliaciones</Link>,
          children: undefined,
        },
        {
          key: `/a/branches`,
          icon: React.createElement(AppstoreOutlined),
          label: <Link href="/a/branches">Tiendas</Link>,
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
          key: `/a/configuration`,
          icon: React.createElement(SettingOutlined),
          label: <Link href="/a/configuration">Parámetros</Link>,
          children: undefined,
        },
      ],
    },
  ],
  v: [
    {
      key: `/v/home`,
      icon: React.createElement(HomeOutlined),
      label: <Link href="/v/home">Inicio</Link>,
      children: undefined,
    },
    {
      key: `sub-management`,
      label: "Gestión",
      type: "group",
      children: [
        {
          key: `/v/branches`,
          icon: React.createElement(AppstoreOutlined),
          label: <Link href="/v/branches">Tiendas</Link>,
          children: undefined,
        },
      ],
    },
  ],
};

const roleKeyMap: Record<string, string> = {
  a: "admin",
  v: "vendor",
};

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authActions = useAuthAction();
  const { userSession } = authActions;
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { Header, Content, Sider, Footer } = Layout;
  const { Text, Title } = Typography;
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState<boolean>(false);
  const primaryUrlSegment = router.pathname.split("/")[1];
  const rolesAllowed = roleKeyMap[primaryUrlSegment] || undefined;
  return (
    <AuthVerifier
      requireAuth={false}
      //requireAuth={primaryUrlSegment !== "p"}
      roles={[rolesAllowed as UserRoleType[number]]}
      user={userSession.data || undefined}
      isLoading={userSession.isLoading}
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
            <Typography.Title
              level={3}
              style={{ textAlign: "center", color: colorPrimary }}
            >
              VeciApp {roleKeyMap[primaryUrlSegment]}
            </Typography.Title>
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
  const authActions = useAuthAction();
  const currentUser = authActions.userSession;
  const logout = authActions.logOut();
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
              logout.mutateAsync({ body: null });
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
              {currentUser.data?.email || "Email desconocido"}
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
          {currentUser.data?.fullName || "Usuario desconocido"}
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
    key: "a",
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
        value: "Tiendas",
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
    key: "v",
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
        key: "branches",
        value: "Tiendas",
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
    ],
  },
];

const AutoBreadcrumb = () => {
  const router = useRouter();
  const getBreadcrumItems = (): BreadcrumbProps["items"] => {
    const pathSegments = router.pathname.split("/").slice(1);
    const items = pathSegments.map((segment, index, segments) => {
      if (index === 0) return null;
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
  "/a/home": "Bienvenido",
  "/a/profile": "Perfil de usuario",
  "/a/users": "Clientes",
  "/a/users/newUser": "Nuevo usuario",
  "/a/branches": "Tiendas",
  "/a/branches/newBranch": "Crear nueva tienda",
  "/a/vendors": "Vendedores",
  "/a/configuration": "Parámetros",
  "/a/conciliations": "Conciliaciones",
  "/a/payments": "Pagos",
  "/b/home": "Dashboard",
  "/b/profile": "Perfil de usuario",
  "/v/home": "Bienvenido",
  "/v/profile": "Perfil de usuario",
  "/v/branches": "Tiendas",
};
const subtitles: Record<string, string> = {
  "/a/home": "Resumen general",
  "/a/profile": "Esta es la pagina de perfil de usuario",
  "/a/users": "Esta es la pagina de Clientes",
  "/a/users/newUser": "Esta es la pagina de Nuevo usuario",
  "/a/branches": "Esta es la pagina de tiendas",
  "/a/branches/newBranch": "Esta es la pagina para crear una nueva tienda",
  "/a/vendors": "Esta es la pagina de vendedores",
  "/a/configuration": "Esta es la pagina de Parámetros",
  "/a/conciliations": "Esta es la pagina de conciliaciones",
  "/a/payments": "Esta es la pagina de pagos",
  "/v/home": "Esta es la pagina de Inicio",
  "/v/profile": "Esta es la pagina de perfil de usuario",
  "/v/branches": "Esta es la pagina de tiendas",
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
