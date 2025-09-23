import React, { ReactElement, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Row, Col, Card, Statistic, Table, Input, Typography } from "antd";

const { Title ,  } = Typography;

const OrdersPage = () => {
  const [search, setSearch] = useState("");

  // 🔹 Datos de ejemplo (luego los cambias por los del API)
  const statsData = {
    totalSales: 378000,
    completedOrders: 3,
    pendingOrders: 1,
    cancelledOrders: 1,
  };

  const ordersData = [
    { id: "PED-1001", client: "Noraldo Iriarte", products: "2 Artículos", total: 20000, status: "En Proceso", createdAt: "2024-10-03" },
    { id: "PED-1002", client: "Kevin Florez", products: "Producto A", total: 10000, status: "Pendiente", createdAt: "2024-10-03" },
    { id: "PED-1003", client: "Eddy Jay", products: "Producto B", total: 20000, status: "Completado", createdAt: "2024-10-03" },
    { id: "PED-1004", client: "Mr Black", products: "Producto C", total: 15000, status: "Completado", createdAt: "2024-10-03" },
    { id: "PED-1005", client: "Lilibeth Cervantes", products: "Producto D", total: 50000, status: "Completado", createdAt: "2024-10-03" },
  ];

  const filteredOrders = ordersData.filter(order =>
    order.client.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "ID Pedido", dataIndex: "id", key: "id" },
    { title: "Cliente", dataIndex: "client", key: "client" },
    { title: "Producto(s)", dataIndex: "products", key: "products" },
    { title: "Total", dataIndex: "total", key: "total", render: (val: number) => `$${val.toLocaleString()}` },
    { title: "Estado", dataIndex: "status", key: "status" },
    { title: "Fecha Creación", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "24px",
      padding: '24px',
      maxWidth: '100%',
      margin: '0 auto'
        }}> 

      {/* Cards de estadísticas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Ventas Totales" value={statsData.totalSales} prefix="$" /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Completados" value={statsData.completedOrders} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Pendientes" value={statsData.pendingOrders} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Cancelados" value={statsData.cancelledOrders} /></Card>
        </Col>
      </Row>

      {/* Tabla de pedidos */}
      <Card style={{ borderRadius: 12 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Pedidos Recientes</Title>
          </Col>
          <Col>
            <Input.Search
              placeholder="Buscar pedido o cliente"
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OrdersPage;