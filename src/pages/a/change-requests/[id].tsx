import { useRouter } from "next/router";
<<<<<<< HEAD
import { Card, Typography, Descriptions, Button, Space, Tag, Divider, Spin } from "antd";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReactElement } from "react";
import { useChangeRequestAction } from "@/actions/changeRequest.action";
import type { DescriptionsProps } from 'antd';

const { Title, Text } = Typography;
=======
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Space,
  message,
  Modal,
  Input,
} from "antd";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReactElement, useState } from "react";
import { useChangeRequestAction } from "@/actions/changeRequest.action";
import { ChangeRequest } from "@/constants/models";

const { Title } = Typography;
const { TextArea } = Input;
>>>>>>> 71c1b63d50bed433e798d2ab1980de30ab1837e9

const ChangeRequestDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
<<<<<<< HEAD
  
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
=======
  const actions = useChangeRequestAction();
  const rejectMutation = actions.rejectChangeRequest();
  const approveMutation = actions.approveChangeRequest();
  const requestQuery = actions.getChangeRequstById(id as string);
  const request: ChangeRequest | undefined = requestQuery.data;

  // Estados para los modales
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      id: id as string,
      body: { reason },
    });
    setApproveModalVisible(false);
    setReason("");
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync({
      id: id as string,
      body: { reason },
    });
    setRejectModalVisible(false);
    setReason("");
  };

  const showApproveModal = () => {
    setReason("");
    setApproveModalVisible(true);
>>>>>>> 71c1b63d50bed433e798d2ab1980de30ab1837e9
  };

  const showRejectModal = () => {
    setReason("");
    setRejectModalVisible(true);
  };

  const handleCancel = () => {
    setApproveModalVisible(false);
    setRejectModalVisible(false);
    setReason("");
  };

  if (!request) {
    return <div>Cargando...</div>;
  }
  if (!request) {
    return <div>Solicitud no encontrada</div>;
  }
  return (
<<<<<<< HEAD
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
=======
    <>
      <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
        <Card>
          <Title level={4}>Detalles de la Solicitud de Cambio</Title>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID">{request.id}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              <span style={{ 
                color: request.status === 'APPROVED' ? 'green' : 
                       request.status === 'REJECTED' ? 'red' : 'orange',
                fontWeight: 'bold'
              }}>
                {request.status === 'APPROVED' ? 'Aprobado' : 
                 request.status === 'REJECTED' ? 'Rechazado' : 'Pendiente'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Solicitante">{request.createdBy}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Solicitud">
              {new Date(request.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Entidad" span={2}>
              {request.entityType === 'STORE' ? 'Tienda' : 
               request.entityType === 'VENDOR_PROFILE' ? 'Perfil de Vendedor' : 
               'Producto o Servicio'}
            </Descriptions.Item>
            <Descriptions.Item label="ID de Entidad">{request.entityId}</Descriptions.Item>
            <Descriptions.Item label="ID de Vendedor">{request.vendorId}</Descriptions.Item>
            {request.adminId && (
              <Descriptions.Item label="Administrador que procesó">{request.adminId}</Descriptions.Item>
            )}
            {request.reason && (
              <Descriptions.Item label="Razón" span={2}>{request.reason}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        <Card title="Cambios Solicitados">
          <div style={{ marginBottom: '20px' }}>
            <Title level={5}>Comparación de Valores</Title>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px', border: '1px solid #f0f0f0', backgroundColor: '#fafafa', width: '20%' }}>Campo</th>
                  <th style={{ padding: '8px', border: '1px solid #f0f0f0', backgroundColor: '#fafafa', width: '40%' }}>Valor Anterior</th>
                  <th style={{ padding: '8px', border: '1px solid #f0f0f0', backgroundColor: '#fafafa', width: '40%' }}>Valor Nuevo</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(request.requestedChanges.newValues).map((key) => (
                  <tr key={key}>
                    <td style={{ padding: '8px', border: '1px solid #f0f0f0', fontWeight: 'bold' }}>{key}</td>
                    <td style={{ padding: '8px', border: '1px solid #f0f0f0' }}>
                      {typeof request.requestedChanges.oldValues[key] === 'object' 
                        ? JSON.stringify(request.requestedChanges.oldValues[key], null, 2) 
                        : String(request.requestedChanges.oldValues[key] || '-')}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #f0f0f0' }}>
                      {typeof request.requestedChanges.newValues[key] === 'object' 
                        ? JSON.stringify(request.requestedChanges.newValues[key], null, 2) 
                        : String(request.requestedChanges.newValues[key] || '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {request.status === 'PENDING' && (
            <Space>
              <Button type="primary" onClick={showApproveModal}>
                Aprobar
              </Button>
              <Button danger onClick={showRejectModal}>
                Rechazar
              </Button>
            </Space>
          )}
        </Card>
      </div>
      {/* Modal para aprobar solicitud */}
      <Modal
        title="Aprobar Solicitud"
        open={approveModalVisible}
        onOk={handleApprove}
        confirmLoading={approveMutation.isPending}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro que deseas aprobar esta solicitud?</p>
        <TextArea
          rows={4}
          placeholder="Escribe la razón de aprobación (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ marginTop: 16 }}
        />
      </Modal>

      {/* Modal para rechazar solicitud */}
      <Modal
        title="Rechazar Solicitud"
        open={rejectModalVisible}
        onOk={handleReject}
        confirmLoading={rejectMutation.isPending}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro que deseas rechazar esta solicitud?</p>
        <TextArea
          rows={4}
          placeholder="Escribe la razón de rechazo"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ marginTop: 16 }}
          required
        />
      </Modal>
    </>
>>>>>>> 71c1b63d50bed433e798d2ab1980de30ab1837e9
  );
};

ChangeRequestDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton>{page}</DashboardLayout>;
};

export default ChangeRequestDetailPage;
