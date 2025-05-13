import React, { useEffect, useState } from "react";
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
import GoBackButton from "../pure/goBackButton";
import { subtitles, titles } from "@/constants/titles";
import { breadcrumItemTree } from "@/constants/breadcrumbItems";
import {
  clearAllInfoFromLocalStorage,
  useLocalStorageAction,
} from "@/actions/localStorage.actions";
import { AutoBreadcrumb } from "../pure/AutoBreadcrumb";
import { AutoTitle } from "../pure/AutoTitle";

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

interface DashboardLayoutProps {
  children: React.ReactNode;
  backButton?: boolean;
}
function DashboardLayout({
  children,
  backButton = false,
}: DashboardLayoutProps) {
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
  const localStorageActions = useLocalStorageAction();
  useEffect(() => {
    localStorageActions.refreshCurrentToken();  //TODO: Preguntar al tocayo por que falla, si esta bien autenticado
  }, []);

  return (
    <AuthVerifier
      requireAuth={primaryUrlSegment !== "p"}
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
              <AutoBreadcrumb breadcrumItemTree={breadcrumItemTree} />
              {backButton && <GoBackButton />}
              <AutoTitle titles={titles} subtitles={subtitles} />
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
            },
          },
          {
            key: "logout",
            label: "Cerrar sesión",
            icon: <LogoutOutlined />,
            onClick: () => {
              logout.mutateAsync({ body: null }).finally(() => {
                clearAllInfoFromLocalStorage();
                router.push("/");
              });
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



