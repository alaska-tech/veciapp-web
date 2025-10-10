import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Typography, Descriptions, Button, Space } from 'antd';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';


const { Title } = Typography;

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // <- Aquí llega el id del pedido (ej: ORD-001)

  // Por ahora mock (después conectamos a API)
  const order = {
    id: id,
    customer: "Juan Pérez",
    status: "Completado",
    amount: "$50.000",
    date: "2025-09-20",
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button 
          icon={<ArrowLeft size={16} />} 
          onClick={() => router.push('/v/orders')}
          type="link"
          style={{ paddingLeft: 0 }}
        >
          Regresar a Pedidos
        </Button>

        <Card>
          <Title level={3}>Detalle del Pedido {order.id}</Title>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Cliente">{order.customer}</Descriptions.Item>
          <Descriptions.Item label="Estado">{order.status}</Descriptions.Item>
          <Descriptions.Item label="Monto">{order.amount}</Descriptions.Item>
          <Descriptions.Item label="Fecha">{order.date}</Descriptions.Item>
        </Descriptions>
      </Card>
      </Space>
    </div>
  );
};

OrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OrderDetailPage;