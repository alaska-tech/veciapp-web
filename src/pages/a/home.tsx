import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, Space, Typography, Statistic, Row, Col } from "antd";
import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import { useVendorAction } from "@/actions/vendor.action";
import { useCustomerAction } from "@/actions/customer.action";
import { useBranchAction } from "@/actions/branch.action";
import { 
  ShopOutlined, 
  TeamOutlined, 
  AppstoreOutlined, 
  DollarOutlined 
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Home = () => {
  const vendorActions = useVendorAction();
  const customerActions = useCustomerAction();
  const branchActions = useBranchAction();

  // Obtener datos de proveedores
  const vendorsQuery = vendorActions.getVendors({ limit: 1, page: 0 });
  const totalVendors = vendorsQuery.data?.data.meta.total || 0;

  // Obtener datos de clientes
  const customersQuery = customerActions.getCustomers();
  const totalCustomers = customersQuery.data?.data.meta.total || 0;

  // Obtener datos de tiendas
  const branchesQuery = branchActions.getBranchesPaginated({ limit: 1, page: 0 });
  const totalBranches = branchesQuery.data?.data.meta.total || 0;

  // Datos de pagos (placeholder por ahora)
  const totalPayments = 0; // TODO: Implementar cuando esté disponible

  const dashboardCards = [
    {
      title: "Total Proveedores",
      value: totalVendors,
      icon: <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff',
      loading: vendorsQuery.isLoading
    },
    {
      title: "Total Clientes", 
      value: totalCustomers,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
      loading: customersQuery.isLoading
    },
    {
      title: "Tiendas Activas",
      value: totalBranches,
      icon: <AppstoreOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1',
      loading: branchesQuery.isLoading
    },
    {
      title: "Pagos Procesados",
      value: totalPayments,
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      color: '#fa8c16',
      loading: false
    }
  ];

  return (
    <div style={{ 
      padding: '24px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Cards Container - Responsive layout */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <Space 
          size={[16, 24]} 
          wrap 
          style={{
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1200px'
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
                  suffix={card.title === "Pagos Procesados" ? " COP" : ""}
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
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
