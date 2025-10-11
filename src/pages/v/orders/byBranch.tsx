import DashboardLayout from '@/components/layout/DashboardLayout';
import { Typography } from 'antd';
import { ReactElement } from 'react';

const { Title } = Typography;

const OrdersByBranchPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Pedidos por Sucursal</Title>
      <p>Aquí puedes mostrar los pedidos filtrados por sucursal.</p>
    </div>
  );
};

OrdersByBranchPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OrdersByBranchPage;