import { useRouter } from "next/router";
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

const ChangeRequestDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actions = useChangeRequestAction();
  const requestQuery = actions.getChangeRequstById(id as string);
  const request: ChangeRequest | undefined = requestQuery.data;

  if (!request) {
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
              <span
                style={{
                  color:
                    request.status === "APPROVED"
                      ? "green"
                      : request.status === "REJECTED"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                }}
              >
                {request.status === "APPROVED"
                  ? "Aprobado"
                  : request.status === "REJECTED"
                  ? "Rechazado"
                  : "Pendiente"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Solicitante">
              {request.createdBy}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha de Solicitud">
              {new Date(request.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Entidad" span={2}>
              {request.entityType === "STORE"
                ? "Tienda"
                : request.entityType === "VENDOR_PROFILE"
                ? "Perfil de Vendedor"
                : "Producto o Servicio"}
            </Descriptions.Item>
            <Descriptions.Item label="ID de Entidad">
              {request.entityId}
            </Descriptions.Item>
            <Descriptions.Item label="ID de Vendedor">
              {request.vendorId}
            </Descriptions.Item>
            {request.adminId && (
              <Descriptions.Item label="Administrador que procesó">
                {request.adminId}
              </Descriptions.Item>
            )}
            {request.reason && (
              <Descriptions.Item label="Razón" span={2}>
                {request.reason}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        <Card title="Cambios Solicitados">
          <div style={{ marginBottom: "20px" }}>
            <Title level={5}>Comparación de Valores</Title>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #f0f0f0",
                      backgroundColor: "#fafafa",
                      width: "20%",
                    }}
                  >
                    Campo
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #f0f0f0",
                      backgroundColor: "#fafafa",
                      width: "40%",
                    }}
                  >
                    Valor Anterior
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      border: "1px solid #f0f0f0",
                      backgroundColor: "#fafafa",
                      width: "40%",
                    }}
                  >
                    Valor Nuevo
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(request.requestedChanges.newValues).map((key) => (
                  <tr key={key}>
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #f0f0f0",
                        fontWeight: "bold",
                      }}
                    >
                      {key}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #f0f0f0" }}>
                      {typeof request.requestedChanges.oldValues[key] ===
                      "object"
                        ? JSON.stringify(
                            request.requestedChanges.oldValues[key],
                            null,
                            2
                          )
                        : String(
                            request.requestedChanges.oldValues[key] || "-"
                          )}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #f0f0f0" }}>
                      {typeof request.requestedChanges.newValues[key] ===
                      "object"
                        ? JSON.stringify(
                            request.requestedChanges.newValues[key],
                            null,
                            2
                          )
                        : String(
                            request.requestedChanges.newValues[key] || "-"
                          )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

ChangeRequestDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton>{page}</DashboardLayout>;
};

export default ChangeRequestDetailPage;
