import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, Typography, Statistic, Row, Col, Button } from "antd";
import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import { useDashboardAdminAction } from "@/actions/dashboardAdmin.action";
import { useChangeRequestAction } from "@/actions/changeRequest.action";
import {
  ShopOutlined,
  TeamOutlined,
  AppstoreOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Bell } from "lucide-react";
import { useRouter } from "next/router";

const { Title, Paragraph } = Typography;

const Home = () => {
  const router = useRouter();
  const { getDashboardStats } = useDashboardAdminAction();
  const changeRequestActions = useChangeRequestAction();

  const statsQuery = getDashboardStats();
  const stats = statsQuery.data?.data;

  const changeRequestsQuery = changeRequestActions.getChangeRequests({
    status: "PENDING",
    limit: 10,
    page: 1,
  });
  const pendingChangesCount = changeRequestsQuery.data?.data.meta.total || 0;

  const dashboardCards = [
    {
      title: "Total Vecis",
      value: stats?.vendors.total ?? 0,
      icon: <ShopOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      color: "#1890ff",
      loading: statsQuery.isLoading,
    },
    {
      title: "Total Clientes",
      value: stats?.customers.total ?? 0,
      icon: <TeamOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      color: "#52c41a",
      loading: statsQuery.isLoading,
    },
    {
      title: "Tiendas Activas",
      value: stats?.branches.active ?? 0,
      icon: <AppstoreOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
      color: "#722ed1",
      loading: statsQuery.isLoading,
    },
    {
      title: "Pagos Procesados",
      value: stats?.orders.completed ?? 0,
      icon: <DollarOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />,
      color: "#fa8c16",
      loading: statsQuery.isLoading,
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      {pendingChangesCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ marginBottom: "24px" }}
        >
          <Card
            loading={changeRequestsQuery.isLoading}
            style={{
              backgroundColor: "#fef9f3",
              border: "1px solid #ffd6a5",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Row align="middle" gutter={[16, 16]}>
              <Col
                xs={24}
                sm={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div
                  style={{
                    backgroundColor: "#ffe4c4",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bell size={24} color="#ff8c42" />
                </div>
              </Col>
              <Col xs={24} sm={22}>
                <Title level={4} style={{ margin: 0, color: "#333" }}>
                  {pendingChangesCount}{" "}
                  {pendingChangesCount === 1
                    ? "cambio pendiente"
                    : "cambios pendientes"}{" "}
                  para revisar
                </Title>
                <Paragraph style={{ margin: "8px 0 16px 0", color: "#666" }}>
                  Haz clic aquí para revisar y aprobar los cambios enviados por
                  los vecis.
                </Paragraph>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#ff8c42",
                    color: "#fff",
                    border: "none",
                    fontWeight: "600",
                  }}
                  onClick={() => router.push("/a/changeRequests")}
                >
                  Revisar Cambios
                </Button>
              </Col>
            </Row>
          </Card>
        </motion.div>
      )}
      <Title level={4} style={{ marginBottom: "24px" }}>
        Resumen General
      </Title>
      <Row gutter={[16, 16]}>
        {dashboardCards.map((card, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <motion.div
              whileHover={{
                scale: 1.01,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <Card
                loading={card.loading}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: `1px solid ${card.color}20`,
                  height: "100%",
                }}
              >
                <Statistic
                  title={<span style={{ color: "#000" }}>{card.title}</span>}
                  value={card.value}
                  prefix={card.icon}
                  valueStyle={{
                    color: card.color,
                    fontSize: "32px",
                    fontWeight: "700",
                  }}
                  suffix=""
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
