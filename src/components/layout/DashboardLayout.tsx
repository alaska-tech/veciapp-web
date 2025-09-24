import React, { useState } from "react";
import { useRouter } from "next/router";
import { Layout, theme, Typography, Button, Drawer } from "antd";
import {
  AppleOutlined,
  AppstoreOutlined,
  DollarOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  PullRequestOutlined,
  ReconciliationOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Home,
  PackageOpen, 
  ShoppingCart,
  Store,

} from "lucide-react";
import Image from "next/image";
import type { MenuProps } from "antd";
import Link from "next/link";
import AuthVerifier from "../auth/AuthVerifier";
import useAuthAction from "@/actions/auth.action";
import { User } from "@/constants/models";
import GoBackButton from "../pure/goBackButton";
import { subtitles, titles } from "@/constants/titles";
import {
  clearAllInfoFromLocalStorage,
} from "@/actions/localStorage.actions";
import { AutoTitle } from "../pure/AutoTitle";
import { AutoMenu } from "../pure/AutoMenu";
import { ProfileButton } from "../pure/ProfileButton";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { motion } from "framer-motion";

export const SIDER_WIDTH = {
  COLLAPSED: 80,
  EXPANDED: 200,
} as const;

export const SCREEN_BREAKPOINTS = {
  MOBILE: 768,
} as const;

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
      label: "Veciproveedores",
      type: "group",
      children: [
        {
          key: `/a/vendors`,
          icon: React.createElement(ShopOutlined),
          label: <Link href="/a/vendors">Proveedores</Link>,
          children: undefined,
        },
        {
          key: `/a/branches`,
          icon: React.createElement(AppstoreOutlined),
          label: <Link href="/a/branches">Tiendas</Link>,
          children: undefined,
        },
        {
          key: `/a/products`,
          icon: React.createElement(AppleOutlined),
          label: <Link href="/a/products">Productos y servicios</Link>,
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
          key: `/a/users`,
          icon: React.createElement(TeamOutlined),
          label: <Link href="/a/users">Clientes</Link>,
          children: undefined,
        },
        {
          key: `/a/serviceOrders`,
          icon: React.createElement(ShoppingOutlined),
          label: <Link href="/a/serviceOrders">Pedidos</Link>,
          children: undefined,
        },
        {
          key: `/a/payments`,
          icon: React.createElement(DollarOutlined),
          label: <Link href="/a/payments">Pagos</Link>,
          children: undefined,
        },
        {
          key: `/a/change-requests`,
          disabled: true,
          icon: React.createElement(PullRequestOutlined),
          label: <Link href="/a/change-requests">Solicitudes de cambio</Link>,
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
      icon: React.createElement(Home),
      label: <Link href="/v/home">Inicio</Link>
    },
    {
      key: `sub-management`,
      label: "Gestión",
      type: "group",
      children: [
        {
          key: `/v/orders`,
          icon: React.createElement(ShoppingCart),
          label: <Link href="/v/orders">Pedidos</Link>
        },
        {
          key: `/v/products`,
          icon: React.createElement(PackageOpen),
          label: <Link href="/v/products">Productos y servicios</Link>
        },
        {
          key: `/v/branches`,
          icon: React.createElement(Store),
          label: <Link href="/v/branches">Tiendas</Link>
        }
      ],
    },
  ],
};

const roleLabels: Record<string, string> = {
  a: "Administrador",
  v: "Veciproveedor",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  backButton?: boolean;
}

const { Header, Content, Sider, Footer } = Layout;
const { Text, Title } = Typography;

function DashboardLayout({
  children,
  backButton = false,
}: DashboardLayoutProps) {
  const router = useRouter();
  const authActions = useAuthAction();
  const { userSession } = authActions;
  const logout = authActions.logOut();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState<boolean>(false);
  const primaryUrlSegment = router.pathname.split("/")[1];
  /* const localStorageActions = useLocalStorageAction(); */
  const { width } = useWindowSize();
  const isSmallScreen = width < SCREEN_BREAKPOINTS["MOBILE"];
  /*   useEffect(() => {
    localStorageActions.refreshCurrentToken(); //TODO: Preguntar al tocayo por que falla, si esta bien autenticado
  }, []); */
  const dropdownMenu = {
    items: [
      userSession.data?.role === "vendor"
        ? {
            key: "profile",
            label: "Perfil de usuario",
            icon: <SettingOutlined />,
            onClick: () => {
              router.push(`/${router.pathname.split("/")[1]}/profile`);
            },
          }
        : null,
      {
        key: "logout",
        label: "Cerrar sesión",
        icon: <LogoutOutlined />,
        onClick: async () => {
          await logout.mutateAsync({ body: null });
          router.push("/");
          clearAllInfoFromLocalStorage();
        },
      },
    ],
  };
  const footer = (
    <Footer style={{ textAlign: "center" }}>
      <Title level={5}>Alaska Tech</Title>
      <Text type="secondary">
        Creamos soluciones de software personalizadas que impulsan el
        crecimiento de tu negocio.
      </Text>
    </Footer>
  );
  const desktopLayout = (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={sideMenuCollapsed}
        theme="light"
        width={SIDER_WIDTH["EXPANDED"]}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          minWidth: 120,
          zIndex: 1000,
        }}
      >
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px',
            gap: '8px'
          }}>
            <Image
              src={"/images/logo.png"}
              alt={"veciapp-logo"}
              width={100}
              height={60}
              style={{
                width: "auto",
                objectFit: "cover",
                height: "40px"
              }}
            />
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setSideMenuCollapsed(prev => !prev)}
              style={{ padding: 0 }}
            />
          </div>
          {!sideMenuCollapsed && (
            <Typography.Title
              level={3}
              style={{ textAlign: "center", color: colorPrimary }}
            >
              {roleLabels[primaryUrlSegment]}
            </Typography.Title>
          )}
          <AutoMenu items={lateralMenuItems[router.pathname.split("/")[1]]} />
        </div>
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0,
          width: '100%', 
          padding: '16px',
          background: 'white',
          borderTop: '1px solid #f0f0f0'
        }}>
          <ProfileButton
            width={
              sideMenuCollapsed
                ? SIDER_WIDTH["COLLAPSED"]
                : SIDER_WIDTH["EXPANDED"]
            }
            user={userSession.data || ({} as User)}
            dropdownProps={{
              menu: dropdownMenu,
            }}
          />
        </div>
      </Sider>
      <Layout
        style={{
          padding: "16px",
          marginLeft: sideMenuCollapsed
            ? SIDER_WIDTH["COLLAPSED"]
            : SIDER_WIDTH["EXPANDED"],
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
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* <AutoBreadcrumb breadcrumItemTree={breadcrumItemTree} /> */}
            {backButton && <GoBackButton />}
            <AutoTitle titles={titles} subtitles={subtitles} />
          </div>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ minHeight: 360 }}
          >
            {children}
          </motion.div>
        </Content>
        {footer}
      </Layout>
    </Layout>
  );
  function toogleSideMenuCollapsed() {
    setSideMenuCollapsed((prev) => !prev);
  }
  const mobileLayout = (
    <Layout>
      <Drawer
        open={sideMenuCollapsed}
        onClose={toogleSideMenuCollapsed}
        placement="left"
        width={"auto"}
        styles={{
          body: { padding: 0 },
        }}
      >
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
            color: colorPrimary,
            lineBreak: "auto",
          }}
        >
          {roleLabels[primaryUrlSegment]}
        </Typography.Title>
       
        <AutoMenu
          items={lateralMenuItems[router.pathname.split("/")[1]]}
          style={{ width: "240px" }}
        />
      </Drawer>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "0 0 0 15%",
          background: "linear-gradient(to bottom, #FFF5B0, #FFD100)",
        }}
      >
        <Button
          icon={<MenuOutlined />}
          type="text"
          onClick={toogleSideMenuCollapsed}
        />
        <Image
          src={"/images/logo.png"}
          alt={"veciapp-logo"}
          width={100}
          height={100}
          style={{
            height: "4vh",
            width: "auto",
            objectFit: "cover",
          }}
        ></Image>
        <ProfileButton
          width={91}
          user={userSession.data || ({} as User)}
          buttonProps={{ style: {}, children: <></> }}
          dropdownProps={{
            menu: dropdownMenu,
          }}
        />
      </Header>
      <Content style={{ padding: "0 4px" }}>
        {/* <AutoBreadcrumb breadcrumItemTree={breadcrumItemTree} /> */}
        {backButton && <GoBackButton />}
        <AutoTitle titles={titles} subtitles={subtitles} />
        {children}
      </Content>
      {footer}
    </Layout>
  );
  return (
    <AuthVerifier
      requireAuth={true}
      roles={["admin", "vendor"]}
      user={userSession.data || undefined}
      isLoading={userSession.isLoading}
    >
      {isSmallScreen ? mobileLayout : desktopLayout}
    </AuthVerifier>
  );
}

export default DashboardLayout;
