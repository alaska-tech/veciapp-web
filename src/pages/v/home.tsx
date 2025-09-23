import DashboardLayout from '@/components/layout/DashboardLayout';
import { Row, Col, Card, Divider, Typography, Statistic, Button, Alert, Badge } from 'antd';
import React, { ReactElement, useState, useEffect } from 'react'
import { color, motion } from "framer-motion";
import { useProductServiceAction } from "@/actions/productservice.action";
import { useBranchAction } from "@/actions/branch.action";
import { getUserInfo } from "@/actions/localStorage.actions";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/v1/payments/dashboard/vendor/08f6ec09-0db8-4e7a-a0f3-209f16f4ee20', {
      headers: {
        Authorization: 'Bearer TU_TOKEN_AQUI'
      }
    })
      .then(res => res.json())
      .then((data: VendorStatisticResponse) => {
        setSummary(data.summary);
        setTransactions(data.recentTransactions || []);
      })
      .catch(() => {
        setSummary(null);
        setTransactions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

      <Card style={{ borderRadius: "12px", overflow: "hidden" }}>
        <Title level={4} style={{ marginBottom: 16, color: '#175FBE' }}>
          Transacciones Recientes
        </Title>
        {loading && <p>Cargando transacciones...</p>}
        {!loading && transactions.length === 0 && <p>No hay transacciones recientes</p>}
        {!loading && transactions.length > 0 && (
          <Row gutter={[16, 16]}>
            {transactions.map(tx => (
              <Col xs={24} sm={12} md={8} key={tx.id}>
                <Card size="small" bordered={true} style={{ borderRadius: '8px' }}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                    <Col>
                      <Statistic
                        value={tx.amount}
                        prefix={<DollarSign />}
                        valueStyle={{ color: '#35B675', fontWeight: '700' }}
                        suffix="COP"
                      />
                    </Col>
                    <Col>
                      <Badge
                        status={tx.state === 'completed' ? 'success' : tx.state === 'pending' ? 'warning' : 'default'}
                        text={tx.state.charAt(0).toUpperCase() + tx.state.slice(1)}
                      />
                    </Col>
                  </Row>
                  <Divider style={{ margin: '8px 0' }} />
                  <Paragraph style={{ margin: 0 }}>
                    <strong>Proveedor:</strong> {tx.provider}
                  </Paragraph>
                  <Paragraph style={{ margin: 0 }}>
                    <strong>Tipo:</strong> {tx.type}
                  </Paragraph>
                  <Paragraph style={{ margin: 0, fontSize: 12, color: '#888' }}>
                    {new Date(tx.createdAt).toLocaleString()}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

    </div>
  )
}

export default Home

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};