import { useRouter } from "next/router";
import { Card, Typography, Descriptions, Button, Space, message } from "antd";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReactElement } from "react";

const { Title } = Typography;

const ChangeRequestDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // 🔹 Datos quemados por ahora (ejemplo)
  const request = {
    id,
    vendorName: "Tienda Ejemplo",
    type: "Creación de Tienda",
    status: "Pendiente",
    submittedAt: "2025-09-20",
    details: {
      nombre: "Super Tienda VeciApp",
      dirección: "Calle 123 #45-67",
      teléfono: "3001234567",
      email: "tienda@ejemplo.com",
    },
  };

  const handleApprove = () => {
    message.success("Solicitud aprobada ✅");
  };

  const handleReject = () => {
    message.error("Solicitud rechazada ❌");
  };

  return (
    <Card style={{ background: "#fff" }}>
      <Title level={3}>Detalle de Solicitud</Title>

      <Descriptions bordered column={1} style={{ marginTop: 16 }}>
        <Descriptions.Item label="ID">{request.id}</Descriptions.Item>
        <Descriptions.Item label="Vendedor">
          {request.vendorName}
        </Descriptions.Item>
        <Descriptions.Item label="Tipo">{request.type}</Descriptions.Item>
        <Descriptions.Item label="Estado">{request.status}</Descriptions.Item>
        <Descriptions.Item label="Fecha">{request.submittedAt}</Descriptions.Item>
        <Descriptions.Item label="Nombre Tienda">
          {request.details.nombre}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección">
          {request.details.dirección}
        </Descriptions.Item>
        <Descriptions.Item label="Teléfono">
          {request.details.teléfono}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {request.details.email}
        </Descriptions.Item>
      </Descriptions>

      <Space style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleApprove}>
          Aprobar
        </Button>
        <Button danger onClick={handleReject}>
          Rechazar
        </Button>
        <Button onClick={() => router.back()}>Volver</Button>
      </Space>
    </Card>
  );
};

ChangeRequestDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton>{page}</DashboardLayout>;
};

export default ChangeRequestDetailPage;