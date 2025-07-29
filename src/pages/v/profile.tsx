import useAuthAction from "@/actions/auth.action";
import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Vendor } from "@/constants/models";
import {
  Card,
  Avatar,
  Tag,
  Image,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Button,
  Collapse,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  TrophyOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  EyeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import React, { ReactElement, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Index = () => {
  const genderMap = {
    M: "Hombre",
    F: "Mujer",
    O: "Otro",
  };
  
  const authActions = useAuthAction();
  const user = authActions.userSession;
  const vendorActions = useVendorAction();
  const { data } = vendorActions.getVendorById(
    user.data?.foreignPersonId as string
  );
  const userData = (data as unknown as Vendor) ?? ({} as Vendor);
  const [isEditing, setIsEditing] = useState(false);

  const InfoCard = ({ 
    title, 
    icon, 
    children, 
    color = "#35b675",
    description
  }: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
    color?: string;
    description?: string;
  }) => (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        border: "none",
        marginBottom: 16,
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
            {title}
          </Title>
          {description && (
            <Text style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
              {description}
            </Text>
          )}
        </div>
      </div>
      {children}
    </Card>
  );

  const InfoItem = ({ 
    label, 
    value, 
    icon, 
    status,
    editable = false,
    onEdit
  }: { 
    label: string; 
    value: string | React.ReactNode; 
    icon?: React.ReactNode; 
    status?: "success" | "warning" | "error" | "default";
    editable?: boolean;
    onEdit?: () => void;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {icon && (
          <span style={{ marginRight: 12, color: "#666", fontSize: 16 }}>
            {icon}
          </span>
        )}
        <div style={{ flex: 1 }}>
          <Text style={{ color: "#666", fontWeight: 500, fontSize: 14 }}>
            {label}
          </Text>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ textAlign: "right", flex: 1 }}>
          {status ? (
            <Tag color={status}>
              {value}
            </Tag>
          ) : (
            <Text strong style={{ color: "#1f1f1f", fontSize: 14 }}>
              {value}
            </Text>
          )}
        </div>
        {editable && onEdit && (
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={onEdit}
              style={{ color: "#35b675" }}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );

  const handleEditField = (field: string) => {
    console.log(`Editando campo: ${field}`);
    // Aquí implementarías la lógica de edición
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Row gutter={[24, 24]}>
        {/* Profile Header Card */}
        <Col xs={24} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "none",
              textAlign: "center",
              background: "linear-gradient(135deg, #35b675 0%, #35b675 100%)",
              color: "white",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            bodyStyle={{ 
              padding: 32,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between"
            }}
          >
            <div>
              <Avatar
                size={120}
                src={userData.avatar}
                icon={<UserOutlined />}
                style={{ 
                  border: "4px solid white",
                  marginBottom: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                }}
              />
              <Title level={2} style={{ color: "white", marginBottom: 8 }}>
                {userData.fullName || "Usuario"}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                {userData.email}
              </Text>
            </div>
            
            <Divider style={{ borderColor: "rgba(255,255,255,0.2)", margin: "24px 0" }} />
            
            <div>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: "center" }}>
                    <Title level={4} style={{ color: "white", margin: 0 }}>
                      {userData.isActive ? "Activo" : "Inactivo"}
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>Estado</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: "center" }}>
                    <Title level={4} style={{ color: "white", margin: 0 }}>
                      {userData.isEmailVerified ? "Verificado" : "Pendiente"}
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>Email</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: "center" }}>
                    <Title level={4} style={{ color: "white", margin: 0 }}>
                      {userData.isHabeasDataConfirm ? "Confirmado" : "Pendiente"}
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>Habeas Data</Text>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        {/* Personal Information */}
        <Col xs={24} lg={16}>
          <InfoCard 
            title="Información Personal" 
            icon={<UserOutlined style={{ color: "white" }} />}
            description="Datos personales y de contacto de tu perfil. Puedes editar la información marcada con el ícono de editar."
          >
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              {!isEditing ? (
                <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                  Editar perfil
                </Button>
              ) : (
                <Space>
                  <Button type="primary" onClick={() => { setIsEditing(false); /* Aquí lógica de guardar */ }}>
                    Guardar
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </Space>
              )}
            </div>
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <InfoItem
                  label="Nombre completo"
                  value={userData.fullName || "No disponible"}
                  icon={<UserOutlined />}
                  editable={isEditing}
                  onEdit={() => handleEditField("fullName")}
                />
                <InfoItem
                  label="E-mail"
                  value={userData.email || "No disponible"}
                  icon={<MailOutlined />}
                  editable={isEditing}
                  onEdit={() => handleEditField("email")}
                />
                <InfoItem
                  label="Género"
                  value={genderMap[userData.gender as keyof typeof genderMap] || "No especificado"}
                  icon={<UserOutlined />}
                  editable={isEditing}
                  onEdit={() => handleEditField("gender")}
                />
                <InfoItem
                  label="Habeas Data confirmado"
                  value={userData.isHabeasDataConfirm ? "Si" : "No"}
                  status={userData.isHabeasDataConfirm ? "success" : "warning"}
                  icon={<SafetyCertificateOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <InfoItem
                  label="Número de identidad"
                  value={userData.identification || "No disponible"}
                  icon={<IdcardOutlined />}
                />
                <InfoItem
                  label="Teléfono celular"
                  value={userData.cellphone ? `+${userData.cellphone}` : "No disponible"}
                  icon={<PhoneOutlined />}
                  editable={isEditing}
                  onEdit={() => handleEditField("cellphone")}
                />
                <InfoItem
                  label="Biografía"
                  value={userData.bio || "No disponible"}
                  icon={<GlobalOutlined />}
                  editable={isEditing}
                  onEdit={() => handleEditField("bio")}
                />
                <InfoItem
                  label="Estado"
                  value={userData.isActive ? "Activo" : "Inactivo"}
                  status={userData.isActive ? "success" : "error"}
                  icon={<CheckCircleOutlined />}
                />
              </Col>
            </Row>
            
            <Divider style={{ margin: "24px 0" }} />
            
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <InfoItem
                  label="Código de identificación"
                  value={userData.internalCode || "No disponible"}
                  icon={<IdcardOutlined />}
                />
                <InfoItem
                  label="Dirección"
                  value={userData.address || "No disponible"}
                  icon={<HomeOutlined />}
                  editable={isEditing}
                  onEdit={() => handleEditField("address")}
                />
                <InfoItem
                  label="Email verificado"
                  value={userData.isEmailVerified ? "Si" : "No"}
                  status={userData.isEmailVerified ? "success" : "warning"}
                  icon={<CheckCircleOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <InfoItem
                  label="Avatar"
                  value={
                    userData.avatar ? (
                      <Image
                        src={userData.avatar}
                        alt="Avatar"
                        style={{ width: 60, height: 60, borderRadius: 8 }}
                      />
                    ) : (
                      "No disponible"
                    )
                  }
                  icon={<UserOutlined />}
                  editable={isEditing}
                  onEdit={() => handleEditField("avatar")}
                />
              </Col>
            </Row>
          </InfoCard>
        </Col>

        {/* Financial Information */}
        <Col xs={24}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              border: "none",
              marginBottom: 16,
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Collapse 
              defaultActiveKey={[]} 
              ghost
              style={{ border: "none" }}
            >
              <Panel
                header={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#52c41a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <LockOutlined style={{ color: "white" }} />
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
                        Información Financiera
                      </Title>
                      <Text style={{ color: "#666", fontSize: 14 }}>
                        Datos bancarios y comerciales
                      </Text>
                    </div>
                  </div>
                }
                key="financial"
                style={{ border: "none" }}
              >
                <div style={{ padding: "0 24px 24px" }}>
                  <Paragraph style={{ color: "#666", marginBottom: 16 }}>
                    Esta información es sensible y se mantiene segura. Solo se muestra cuando es necesario para transacciones.
                  </Paragraph>
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={8}>
                      <InfoItem
                        label="Registro comercial"
                        value={userData.commercialRegistry || "No disponible"}
                        icon={<TrophyOutlined />}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <InfoItem
                        label="RUT"
                        value={userData.rut || "No disponible"}
                        icon={<IdcardOutlined />}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <InfoItem
                        label="Banco"
                        value={
                          userData.bankAccount
                            ? `${userData.bankAccount.entity} ${userData.bankAccount.type} ${userData.bankAccount.number}`
                            : "No disponible"
                        }
                        icon={<BankOutlined />}
                      />
                    </Col>
                  </Row>
                </div>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
