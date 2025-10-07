import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, Typography } from "antd";
import { ReactElement } from "react";

const { Title } = Typography;

const ChangeRequests = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Mis Solicitudes de Cambio</Title>
      <Card>
        <p>Aquí verás todas tus solicitudes de cambio pendientes</p>
      </Card>
    </div>
  );
};

export default ChangeRequests;

ChangeRequests.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};