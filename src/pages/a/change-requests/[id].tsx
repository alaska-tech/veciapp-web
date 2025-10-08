import { useRouter } from "next/router";
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Space,
  Modal,
  Input,
  Tag,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReactElement, useState } from "react";
import { useChangeRequestAction } from "@/actions/changeRequest.action";
import { ChangeRequest } from "@/constants/models";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ChangeRequestDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actions = useChangeRequestAction();
  const rejectMutation = actions.rejectChangeRequest();
  const approveMutation = actions.approveChangeRequest();
  const requestQuery = actions.getChangeRequests({ id: id as string });
  
  const request: ChangeRequest | undefined = requestQuery.data?.data.data?.find((r: any) => r.id === id);

  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    if (!reason.trim()) {
      message.warning("Por favor escribe una razón para la aprobación");
      return;
    }
    
    try {
      await approveMutation.mutateAsync({
        id: id as string,
        body: { reason: reason.trim() },
      });
      message.success("✅ Solicitud aprobada exitosamente");
      setApproveModalVisible(false);
      setReason("");
      setTimeout(() => router.push('/a/change-requests'), 1000);
    } catch (error) {
      message.error("Error al aprobar la solicitud");
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      message.warning("Por favor escribe una razón para el rechazo");
      return;
    }
    
    try {
      await rejectMutation.mutateAsync({
        id: id as string,
        body: { reason: reason.trim() },
      });
      message.success("❌ Solicitud rechazada");
      setRejectModalVisible(false);
      setReason("");
      setTimeout(() => router.push('/a/change-requests'), 1000);
    } catch (error) {
      message.error("Error al rechazar la solicitud");
    }
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
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <ClockCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />
        <Title level={4} style={{ marginTop: 16 }}>Cargando solicitud...</Title>
      </div>
    );
  }

  if (!request) {
    return (
      <Card>
        <Title level={4}>Solicitud no encontrada</Title>
        <Button onClick={() => router.back()}>Volver</Button>
      </Card>
    );
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'APPROVED':
        return { color: 'success', icon: <CheckCircleOutlined />, text: 'Aprobado' };
      case 'REJECTED':
        return { color: 'error', icon: <CloseCircleOutlined />, text: 'Rechazado' };
      default:
        return { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pendiente' };
    }
  };

  const statusConfig = getStatusConfig(request.status);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Solicitud de Cambio</Text>
              <Title level={2} style={{ margin: 0 }}>#{request.id.slice(0, 8)}</Title>
            </Space>
          </Col>
          <Col>
            <Tag 
              icon={statusConfig.icon} 
              color={statusConfig.color} 
              style={{ fontSize: 16, padding: '8px 16px' }}
            >
              {statusConfig.text}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* Información General */}
      <Card 
        title="Información General" 
        style={{ marginBottom: 24, borderRadius: 12 }}
      >
        <Descriptions column={{ xs: 1, sm: 2, md: 2 }} bordered>
          <Descriptions.Item label="Tipo de Entidad">
            <Tag color="blue">
              {request.entityType === 'STORE' ? '🏪 Tienda' : 
               request.entityType === 'VENDOR_PROFILE' ? '👤 Perfil de Vendedor' : 
               '📦 Producto o Servicio'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Solicitud">
            {new Date(request.createdAt).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Descriptions.Item>
          <Descriptions.Item label="ID de Entidad">{request.entityId}</Descriptions.Item>
          <Descriptions.Item label="ID de Vendedor">{request.vendorId}</Descriptions.Item>
          {request.adminId && (
            <Descriptions.Item label="Procesado por" span={2}>
              Admin: {request.adminId}
            </Descriptions.Item>
          )}
          {request.reason && (
            <Descriptions.Item label="Razón" span={2}>
              <Text italic>{request.reason}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Comparación de Cambios */}
      <Card 
        title={
          <Space>
            <span>Comparación de Cambios</span>
            <Tag color="orange">{Object.keys(request.requestedChanges.newValues).length} campos modificados</Tag>
          </Space>
        }
        style={{ marginBottom: 24, borderRadius: 12 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {Object.keys(request.requestedChanges.newValues).map((key) => {
            const oldValue = request.requestedChanges.oldValues[key];
            const newValue = request.requestedChanges.newValues[key];
            const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);

            return (
              <Card
                key={key}
                size="small"
                style={{ 
                  background: hasChanged ? '#fffbe6' : '#fafafa',
                  border: hasChanged ? '1px solid #ffe58f' : '1px solid #d9d9d9'
                }}
              >
                <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
                  📝 {key}
                </Title>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <div style={{
                      padding: 12,
                      background: '#fff1f0',
                      borderRadius: 8,
                      border: '1px solid #ffccc7'
                    }}>
                      <Text type="secondary" strong style={{ fontSize: 12 }}>
                        ❌ ANTERIOR
                      </Text>
                      <Divider style={{ margin: '8px 0' }} />
                      <Text delete={hasChanged} style={{ fontSize: 14 }}>
                        {typeof oldValue === 'object' 
                          ? JSON.stringify(oldValue, null, 2) 
                          : String(oldValue || '-')}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{
                      padding: 12,
                      background: '#f6ffed',
                      borderRadius: 8,
                      border: '1px solid #b7eb8f'
                    }}>
                      <Text type="secondary" strong style={{ fontSize: 12 }}>
                        ✅ NUEVO
                      </Text>
                      <Divider style={{ margin: '8px 0' }} />
                      <Text strong style={{ fontSize: 14, color: '#52c41a' }}>
                        {typeof newValue === 'object' 
                          ? JSON.stringify(newValue, null, 2) 
                          : String(newValue || '-')}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Space>
      </Card>

      {/* Botones de Acción */}
      {request.status === 'PENDING' && (
        <Card style={{ borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong>¿Qué deseas hacer con esta solicitud?</Text>
            </Col>
            <Col>
              <Space size="middle">
                <Button onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button 
                  danger 
                  icon={<CloseCircleOutlined />}
                  onClick={showRejectModal}
                  size="large"
                >
                  Rechazar
                </Button>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={showApproveModal}
                  size="large"
                >
                  Aprobar
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* Modal Aprobar */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
            <span>Aprobar Solicitud</span>
          </Space>
        }
        open={approveModalVisible}
        onOk={handleApprove}
        confirmLoading={approveMutation.isPending}
        onCancel={handleCancel}
        okText="Confirmar Aprobación"
        cancelText="Cancelar"
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>Al aprobar esta solicitud, los cambios se aplicarán inmediatamente.</Text>
          <TextArea
            rows={4}
            placeholder="Escribe una razón o comentario (requerido)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            showCount
          />
        </Space>
      </Modal>

      {/* Modal Rechazar */}
      <Modal
        title={
          <Space>
            <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
            <span>Rechazar Solicitud</span>
          </Space>
        }
        open={rejectModalVisible}
        onOk={handleReject}
        confirmLoading={rejectMutation.isPending}
        onCancel={handleCancel}
        okText="Confirmar Rechazo"
        okButtonProps={{ danger: true, size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
        cancelText="Cancelar"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text strong>¿Por qué rechazas esta solicitud?</Text>
          <TextArea
            rows={4}
            placeholder="Explica el motivo del rechazo (obligatorio)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            showCount
            status={!reason.trim() && rejectMutation.isPending ? "error" : ""}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            El vendedor verá este mensaje para entender por qué fue rechazado.
          </Text>
        </Space>
      </Modal>
    </div>
  );
};

ChangeRequestDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton>{page}</DashboardLayout>;
};

export default ChangeRequestDetailPage;