import { useRouter } from "next/router";
import { Card, Typography, Descriptions, Button, Space, Tag, Divider, Spin } from "antd";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReactElement } from "react";
import { useChangeRequestAction } from "@/actions/changeRequest.action";
import type { DescriptionsProps } from 'antd';

const { Title, Text } = Typography;

const ChangeRequestDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const { getChangeRequests, approveChangeRequest, rejectChangeRequest } = useChangeRequestAction();
  
  // Traer los change requests filtrando por ID
  const requestQuery = getChangeRequests({ id: id as string });
  const approve = approveChangeRequest();
  const reject = rejectChangeRequest();

  if (requestQuery.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Buscar el request específico en los resultados
  const request = requestQuery.data?.data.data?.find((r: any) => r.id === id);

  if (!request) {
    return <Card>No se encontró la solicitud</Card>;
  }

  const oldValues = request.requestedChanges.oldValues;
  const newValues = request.requestedChanges.newValues;

  // Obtener todas las claves
  const allKeys = Array.from(new Set([...Object.keys(oldValues), ...Object.keys(newValues)]));

  // Crear items para Descriptions
  const comparisonItems: DescriptionsProps['items'] = allKeys.map((key, index) => {
    const oldValue = oldValues[key];
    const newValue = newValues[key];
    const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);

    return {
      key: index.toString(),
      label: key,
      span: 3,
      children: (
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ 
            flex: 1,
            padding: '8px 12px', 
            background: hasChanged ? '#fff1f0' : '#fafafa',
            borderRadius: '4px',
            border: hasChanged ? '1px solid #ffccc7' : '1px solid #d9d9d9'
          }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Anterior:</Text>
            <br />
            <Text delete={hasChanged}>
              {typeof oldValue === 'object' ? JSON.stringify(oldValue) : (oldValue || '-')}
            </Text>
          </div>
          <div style={{ 
            flex: 1,
            padding: '8px 12px', 
            background: hasChanged ? '#f6ffed' : '#fafafa',
            borderRadius: '4px',
            border: hasChanged ? '1px solid #b7eb8f' : '1px solid #d9d9d9'
          }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Nuevo:</Text>
            <br />
            <Text strong={hasChanged} style={{ color: hasChanged ? '#52c41a' : 'inherit' }}>
              {typeof newValue === 'object' ? JSON.stringify(newValue) : (newValue || '-')}
            </Text>
          </div>
        </div>
      )
    };
  });

  const handleApprove = async () => {
    await approve.mutateAsync({ 
      id: id as string, 
      body: { reason: "Aprobado por el administrador" } 
    });
    router.push('/a/change-requests');
  };

  const handleReject = async () => {
    await reject.mutateAsync({ 
      id: id as string, 
      body: { reason: "Rechazado por el administrador" } 
    });
    router.push('/a/change-requests');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              Solicitud de Cambio #{id}
            </Title>
            <Tag color={request.status === 'PENDING' ? 'orange' : request.status === 'APPROVED' ? 'green' : 'red'}>
              {request.status}
            </Tag>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          <Descriptions 
            title="Comparación de Cambios"
            bordered
            layout="vertical"
            items={comparisonItems}
          />

          {request.status === 'PENDING' && (
            <Space style={{ marginTop: 24, width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => router.back()}>
                Volver
              </Button>
              <Button 
                danger 
                onClick={handleReject}
                loading={reject.isPending}
              >
                Rechazar
              </Button>
              <Button 
                type="primary" 
                onClick={handleApprove}
                loading={approve.isPending}
              >
                Aprobar
              </Button>
            </Space>
          )}
        </Space>
      </Card>
    </div>
  );
};

ChangeRequestDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton>{page}</DashboardLayout>;
};

export default ChangeRequestDetailPage;