import React, { useState } from 'react'
import { useRouter } from 'next/router'
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
} from 'antd'
import {
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Image from 'next/image'
import type { BreadcrumbProps, MenuProps } from 'antd'
import Link from 'next/link'

const lateralMenuItems: MenuProps['items'] = [
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
]
interface TreeStruct {
  key: string
  value: any
  children?: TreeStruct[]
}
const breadcrumItemTree: TreeStruct = {
  key: '(admin)',
  value: null,
  children: [
    {
      key: 'home',
      value: 'Inicio',
    },
    {
      key: 'users',
      value: 'Usuarios',
      children: [
        {
          key: '[id]',
          value: '[{id}]',
        },
      ],
    },
    {
      key: 'configuration',
      value: 'Configuración',
    },
  ]
}
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorBgElevated,
      boxShadowSecondary,
    },
  } = theme.useToken()
  const contentStyle = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  }
  const router = useRouter()
  const { Header, Content, Sider, Footer } = Layout
  const { Text, Title } = Typography
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState<boolean>(false)

  const getBreadcrumItems = (): BreadcrumbProps['items'] => {
    const pathSegments = router.pathname.split('/').slice(2);

    return pathSegments.map((segment, index) => {
      const isDynamicSegment = segment.startsWith('[') && segment.endsWith(']');
      const dynamicSegmentKey = isDynamicSegment ? segment.slice(1, -1) : null;
      const dynamicSegmentValue = dynamicSegmentKey ? router.query[dynamicSegmentKey] : null;

      const path = `/${router.pathname
        .split('/')
        .slice(0, index + 3)
        .map((value) => (value.startsWith('[') && value.endsWith(']') ? router.query[value.slice(1, -1)] : value))
        .join('/')}`;

      const label =
        breadcrumItemTree.children?.find((item) => item.key === segment)?.value ||
        (index === pathSegments.length - 1 ? segment : null);

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
    <Layout>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="demo-logo">
          <Image
            alt="logo"
            src="/images/logo.png"
            width={100}
            height={60}
            style={{
              width: 'auto',
              objectFit: 'cover',
              display: 'flex',
            }}
          />
        </div>
        <div className="user-options">
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  label: 'Cerrar sesión',
                  icon: <LogoutOutlined />,
                  onClick: () => {
                    router.push('/')
                    //signOut!()
                  },
                },
              ],
            }}
            trigger={['click']}
            dropdownRender={(menu) => (
              <div style={contentStyle}>
                <Space
                  style={{
                    padding: 8,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Title
                    level={5}
                    style={{ marginBottom: '-8px' }}
                  >
                    John Doe
                  </Title>
                  <Text type="secondary">Compañia ABCDF</Text>
                </Space>
                <Divider style={{ margin: 0 }} />
                {React.cloneElement(menu as React.ReactElement)}
              </div>
            )}
          >
            <Button
              size="large"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Avatar icon={<UserOutlined />} />
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Layout
        hasSider
        style={{ marginTop: '64px' }}
      >
        <Sider
          collapsible
          onCollapse={(collapsed) => setSideMenuCollapsed(collapsed)}
          theme="light"
          width={200}
          style={{
            overflow: 'auto',
            height: '100vh',
            background: colorBgContainer,
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}
        >
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            items={lateralMenuItems}
            selectedKeys={[router.pathname.split('/').slice(0, 3).join('/')]}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            marginLeft: sideMenuCollapsed ? 80 : 200,
          }}
        >
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={getBreadcrumItems()}
          ></Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              overflow: 'initial',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <Title level={5}>Alaska Tech</Title>
            <Text type="secondary">Secure your journey with us</Text>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout
