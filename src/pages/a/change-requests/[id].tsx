import { useRouter } from "next/router";
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Space,
  Modal,
  Input,
} from "antd";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReactElement, useState } from "react";
import { useChangeRequestAction } from "@/actions/changeRequest.action";
import { ChangeRequest } from "@/constants/models";

const { Title } = Typography;
const { TextArea } = Input;

const ChangeRequestDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actions = useChangeRequestAction();
  const rejectMutation = actions.rejectChangeRequest();
  const approveMutation = actions.approveChangeRequest();
  const requestQuery = actions.getChangeRequests({ id: id as string });
  
  // Buscar el request específico en los resultados
  const request: ChangeRequest | undefined = requestQuery.data?.data.data?.find((r: any) => r.id === id);

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
    router.push('/a/change-requests');
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync({
      id: id as string,
      body: { reason },
    });
    setRejectModalVisible(false);
    setReason("");
    router.push('/a/change-requests');
  };

  const showApproveModal = () => {
    setReason("");
    setApproveModalVisible(true);
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

  if (requestQuery.isLoading) {
    return <div>Cargando...</div>;
  }

  if (!request) {
    return <div>Solicitud no encontrada</div>;
  }

  return (
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
  );
};

ChangeRequestDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton>{page}</DashboardLayout>;
};

export default ChangeRequestDetailPage;