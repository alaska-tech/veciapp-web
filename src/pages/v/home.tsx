import DashboardLayout from '@/components/layout/DashboardLayout';
import { Row, Col, Card, Divider, Typography, Statistic, Button, Alert, Badge, Table, Tag } from 'antd';
import React, { ReactElement, useState, useEffect } from 'react'
import { color, motion } from "framer-motion";
import { useProductServiceAction } from "@/actions/productservice.action";
import { useBranchAction } from "@/actions/branch.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import { useStatisticAction } from "@/actions/statistics.action";
import { Rocket, ShoppingCart, Store, DollarSign } from "lucide-react";
import { useRouter } from 'next/router';

const { Title, Paragraph } = Typography;

interface Transaction {
  id: string;
  amount: number;
  state: string;
  provider: string;
  type: string;
  createdAt: string;
}

interface VendorSummary {
  totalSales: number;
  salesToday: number;
  salesLast7Days: number;
}

interface VendorStatisticResponse {
  summary: VendorSummary;
  recentTransactions?: Transaction[];
}

const Home = () => {
  const router = useRouter();
  const user = getUserInfo();
  const productServiceActions = useProductServiceAction();
  const branchActions = useBranchAction();
  const [summary, setSummary] = useState<VendorSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);



  // Obtener estadísticas del dashboard
  const { getVendorStatistic } = useStatisticAction();
  const dashboardQuery = getVendorStatistic({ 
    vendorId: user?.foreignPersonId 
  });

  useEffect(() => {
    if (dashboardQuery.data?.data) {
      setSummary(dashboardQuery.data.data.summary);
      setTransactions(dashboardQuery.data.data.recentTransactions || []);
    }
  }, [dashboardQuery.data]);

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      maxWidth: '100%',
      gap: '24px',
      margin: '0 auto'
    }}>
      {/* Banner Informativo */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }} 
      >
        <Alert
          message={(
            <Row align="middle" gutter={[16, 8]}>
              {/* Columna icono */}
              <Col xs={4} sm={3} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Rocket size={64} color="#175FBE" />
              </Col>

              {/* Columna contenido */}
              <Col xs={20} sm={21} md={22}>
                <div>
                  <Title level={4} style={{ margin: 0, color: '#175FBE' }}>
                    ¡Completa tu perfil para empezar a vender!
                  </Title>
                  <Paragraph style={{ margin: '6px 0 0 0', color: '#175FBE' }}>
                    Accede a todas las herramientas para administrar tus tiendas, productos y operaciones diarias.
                  </Paragraph>

                  {/* Botones dentro del banner */}
                  <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Button
                      type="default"
                      shape="round"
                      onClick={() => router.push('/v/products')}
                      aria-label="Agregar productos"
                    >
                      Agregar Productos
                    </Button>

                    <Button
                      type="default"
                      shape="round"
                      onClick={() => router.push('/v/profile')}
                      aria-label="Completar perfil"
                    >
                      Completar Perfil
                    </Button>

                    <Button
                      type="default"
                      shape="round"
                      onClick={() => router.push('/v/branches')}
                      aria-label="Crear sucursal"
                    >
                      Crear Sucursal
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
          type="info"
          showIcon={false}
          style={{
            backgroundColor: '#3385f01a',
            border: '1px solid #175FBE',
            borderRadius: '12px',
            padding: 16
          }}
        />
      </motion.div>

      {/* Cards Container - con animacion hover - TODO: crear componente cardAnimada  */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <motion.div
            whileHover={{ scale: 1.01, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <Card style={{ borderRadius: "12px", overflow: "hidden" }}>
              <Statistic
                title={<span style={{ color: "#000" }}>Ventas Totales</span>}
                value={totalProducts}
                prefix={<ShoppingCart />}
                valueStyle={{
                  color: "#35B675",
                  fontSize: "32px",
                  fontWeight: "700"
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <motion.div
            whileHover={{ scale: 1.01, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <Card style={{ borderRadius: "12px", overflow: "hidden" }}>
              <Statistic
                title={<span style={{ color: "#000" }}>Transacciones</span>}
                value={totalBranches}
                prefix={<Store />}
                valueStyle={{
                  color: "#35B675",
                  fontSize: "32px",
                  fontWeight: "700"
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <motion.div
            whileHover={{ scale: 1.01, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <Card style={{ borderRadius: "12px", overflow: "hidden" }}>
              <Statistic
                title={<span style={{ color: "#000" }}>Ventas hoy</span>}
                value={summary?.salesToday || 0}
                suffix="COP"
                prefix={<DollarSign />}
                valueStyle={{
                  color: "#35B675",
                  fontSize: "32px",
                  fontWeight: "700"
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <motion.div
            whileHover={{ scale: 1.01, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <Card style={{ borderRadius: "12px", overflow: "hidden" }}>
              <Statistic
                title={<span style={{ color: "#000" }}>Últimos 7 días</span>}
                value={summary?.salesLast7Days || 0}
                valueStyle={{
                  color: "#35B675",
                  fontSize: "32px",
                  fontWeight: "700"
                }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row> 
          <Title level={4} style={{ marginBottom: 16, color: '#175FBE' }}>
            Transacciones Recientes
          </Title>

      <Card 
        style={{
          
          borderRadius: "12px",
          overflow: "hidden" 
        }}
        bodyStyle={{ padding: 0 }}
      >
        {dashboardQuery.isLoading && <p>Cargando transacciones...</p>}
        {!dashboardQuery.isLoading && transactions.length === 0 && <p>No hay transacciones recientes</p>}
        {!dashboardQuery.isLoading && transactions.length > 0 && (
          <Table
            dataSource={transactions.map(tx => ({
              key: tx.id,
              id: tx.id,
              customer: tx.provider,
              status: tx.state.charAt(0).toUpperCase() + tx.state.slice(1),
              amount: `$${tx.amount.toLocaleString('es-CO')}`,
              date: new Date(tx.createdAt).toLocaleDateString('es-CO'),
              type: tx.type
            }))}
            columns={[
              { 
                title: 'ID Transacción', 
                dataIndex: 'id', 
                key: 'id',
                width: 140 
              },
              { 
                title: 'Tienda/Sucursal', 
                dataIndex: 'customer', 
                key: 'customer' 
              },
              { 
                title: 'Tipo', 
                dataIndex: 'type', 
                key: 'type' 
              },
              { 
                title: 'Estado', 
                dataIndex: 'status', 
                key: 'status',
                render: (status: string) => (
                  <Tag 
                    color={
                      status === 'Completed' ? 'success' : 
                      status === 'Pending' ? 'warning' : 'error'
                    }
                  >
                    {status}
                  </Tag>
                )
              },
              { 
                title: 'Monto', 
                dataIndex: 'amount', 
                key: 'amount',
                align: 'right' as const
              },
              { 
                title: 'Fecha', 
                dataIndex: 'date', 
                key: 'date',
                width: 120
              }
            ]}
            pagination={{ pageSize: 5 }}
            rowKey="id"
          />
        )}
      </Card>

    </div>
  )
}

export default Home

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};