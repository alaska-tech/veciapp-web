import DashboardLayout from '@/components/layout/DashboardLayout';
import { Row, Col, Card, Space, Typography, Statistic, Button, Alert } from 'antd';
import React, { ReactElement } from 'react'
import { motion } from "framer-motion";
import { useProductServiceAction } from "@/actions/productservice.action";
import { useBranchAction } from "@/actions/branch.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import {
  RocketOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  UserOutlined,
  ShopOutlined
} from "@ant-design/icons";
import { useRouter } from 'next/router';
import { useStatisticAction } from '@/actions/statistics.action';

const { Title, Paragraph } = Typography;


const data = {
          "summary": {
            "totalSales": 378000,
            "totalTransactions": 12,
            "salesToday": 31500,
            "salesLast7Days": 252000
          },
          "recentTransactions": [
            {
              "id": "c526114d-b235-4eb7-abee-e35e39b735ce",
              "orderId": "83c9198c-d200-498e-b327-2fe1ecbbc38a",
              "customerId": "4586145e-e7a3-45e5-95f2-7a0c49f974fa",
              "vendorId": "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
              "paymentReference": "ORDER_83c9198c-d200-498e-b327-2fe1ecbbc38a_1756860965895_9",
              "provider": "wompi",
              "state": "completed",
              "amount": "31500.00",
              "currency": "COP",
              "type": "credit_card",
              "transactionId": "1681812-1756861004-29195",
              "receiptUrl": "dqOSdQBGys",
              "failureReason": null,
              "paymentDate": null,
              "metadata": {
                "commission": 150000,
                "orderAmount": 3000000,
                "customerEmail": "contact.alaskatech@gmail.com"
              },
              "service_fee_details": null,
              "createdAt": "2025-09-03T01:25:12.279Z",
              "updatedAt": "2025-09-03T01:25:12.279Z"
            }
          ]
      }
const Home = () => {
  const router = useRouter();
  const user = getUserInfo();
  const productServiceActions = useProductServiceAction();
  const branchActions = useBranchAction();
  const statisticActions = useStatisticAction();
  const statisticQuery = statisticActions.getVendorStatistic({vendorId: user?.id || ""});

  // Obtener datos de productos del vendor actual
  const productsQuery = productServiceActions.getProductServicesPaginated({
    limit: 1,
    page: 0,
    vendorId: user?.id
  });
  const totalProducts = productsQuery.data?.data.meta.total || 0;

  // Obtener datos de tiendas del vendor
  const branchesQuery = branchActions.getBranchesByVendorIdPaginated({
    limit: 1,
    page: 0,
    vendorId: user?.foreignPersonId
  });
  const totalBranches = branchesQuery.data?.data.meta.total || 0;

  // Datos quemados para métricas no implementadas
  const totalOrders = 120; // TODO: Implementar cuando esté disponible
  const monthlySales = 5000000; // 5M COP - TODO: Implementar cuando esté disponible
  const lowStockProducts = 3; // TODO: Implementar filtro de productos con stock < 5

  const dashboardCards = [
    {
      title: "Productos y Servicios",
      value: totalProducts,
      icon: <ShoppingOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
      loading: productsQuery.isLoading
    },
    {
      title: "Tiendas Activas",
      value: totalBranches,
      icon: <ShopOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1',
      loading: branchesQuery.isLoading
    },
    {
      title: "Pedidos Recibidos",
      value: totalOrders,
      icon: <AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff',
      loading: false
    },
    {
      title: "Ventas este mes",
      value: monthlySales,
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
      loading: false,
      suffix: " COP"
    },
    {
      title: "Productos en Stock Bajo",
      value: lowStockProducts,
      icon: <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />,
      color: '#ff4d4f',
      loading: false
    },
    {
      title: "Prueba Estática",
      value: 12345,
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#ff9900' }} />,
      color: '#ff9900',
      loading: false,
      suffix: " COP"
    }
  ];

  return (
    <div style={{
      padding: '24px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Banner Informativo */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ marginBottom: '32px' }}
      >
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RocketOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <div>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  ¡Centro de gestión de tu operación!
                </Title>
                <Paragraph style={{ margin: '4px 0 0 0', color: '#1890ff' }}>
                  Accede a todas las herramientas para administrar tus tiendas, productos y operaciones diarias.
                </Paragraph>
              </div>
            </div>
          }
          style={{
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '12px'
          }}
          showIcon={false}
        />

        {/* Botones de acción */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => router.push('/v/products')}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              height: '40px'
            }}
          >
            Agregar Productos
          </Button>
          <Button
            type="default"
            icon={<UserOutlined />}
            onClick={() => router.push('/v/profile')}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              height: '40px'
            }}
          >
            Completar Perfil
          </Button>
          <Button
            type="default"
            icon={<ShopOutlined />}
            onClick={() => router.push('/v/branches')}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              height: '40px'
            }}
          >
            Crear Sucursal
          </Button>
        </div>
      </motion.div>

      {/* Cards Container - Responsive layout */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Productos Activos"
              value={45}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tiendas Activas"
              value={4}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ventas este mes"
              value={5000000}
              suffix="COP"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Pedidos Recibidos" value={120} />
          </Card>
        </Col>
      </Row>

      <div style={{
        display: 'flex',
        marginTop: '2rem',
        justifyContent: 'center',
        width: '100%'
      }}>
        <Space
          size={[16, 24]}
          wrap
          style={{
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {dashboardCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeInOut" }}
              whileHover={{ scale: 1.03, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.98 }}
              style={{ width: 'clamp(280px, calc(100vw - 48px), 320px)', minWidth: '280px' }}
            >
              <Card
                loading={card.loading}
                style={{
                  width: '100%',
                  border: `1px solid ${card.color}20`,
                  borderRadius: '12px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  {card.icon}
                  <Title level={4} style={{ margin: '0 0 0 12px', color: card.color }}>
                    {card.title}
                  </Title>
                </div>
                <Statistic
                  value={card.value}
                  valueStyle={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: card.color
                  }}
                  suffix={card.suffix || ""}
                />
                <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                  {card.loading ? "Cargando..." : "Actualizado recientemente"}
                </Paragraph>
              </Card>
            </motion.div>
          ))}
        </Space>
      </div>
    </div>
  )
}

export default Home

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};