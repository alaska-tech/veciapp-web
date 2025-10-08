import useAuthAction from "@/actions/auth.action";
import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Vendor } from "@/constants/models";
import {
  Card,
  Avatar,
  Tag,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Button,
  Collapse,
  Form,
  Input,
  Radio,
  App,
  Modal,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
  BankOutlined,
  CheckCircleOutlined,
  EditOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import React, { ReactElement, useState } from "react";
import {
  VENDOR_IS_ACTIVE_LABELS,
  VENDOR_IS_EMAIL_VERIFIED_LABELS,
  VENDOR_IS_HABEAS_DATA_LABELS,
  VENDOR_STATE_LABELS,
} from "@/constants/labels";
import CreateChangeRequestInfoModal from "@/components/pure/CreateChangeRequestInfoModal";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { modal } = App.useApp();

const Index = () => {
  const genderMap = {
    M: "Hombre",
    F: "Mujer",
    O: "Otro",
  };
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const authActions = useAuthAction();
  const user = authActions.userSession;
  const vendorActions = useVendorAction();
  const { data } = vendorActions.getVendorById(
    user.data?.foreignPersonId as string
  );
  const userData = (data as unknown as Vendor) ?? ({} as Vendor);
  const updateVendorMutation = vendorActions.updateVendor({
    onSuccess: (data) => {
      modal.success({
        title: "Solicitud de cambios registrada exitosamente",
        content: `Los cambios en el veci se han registrado y están pendientes de aprobación por el administrador.`,
        okText: "Entendido",
        centered: true,
      });
      setIsEditing(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Error al enviar la solicitud de cambio de información");
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showChangeRequestModal, closeChangeRequestModal] =
    CreateChangeRequestInfoModal();
  const handleSubmit = (values: any) => {
    showChangeRequestModal({
      onOk: () => {
        const values = form.getFieldsValue();
        return updateVendorMutation.mutate({
          id: userData.id,
          body: values,
        });
      },
    });
  };
  const InfoCard = ({
    title,
    icon,
    children,
    color = "#35b675",
    description,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    color?: string;
    description?: string;
  }) => (
    <Card
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
    label = "",
    value,
    icon,
    status,
    editable = false,
    formFieldName,
    inputType,
    options,
    fallbackValue,
  }: {
    label?: string;
    value: string | React.ReactNode;
    formFieldName?: string;
    inputType?: "text" | "radio" | "textarea";
    options?: { label: string; value: string }[];
    icon?: React.ReactNode;
    status?: "success" | "warning" | "error" | "default";
    editable?: boolean;
    fallbackValue?: string;
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
        {editable && formFieldName ? (
          <Form.Item name={formFieldName} noStyle initialValue={value}>
            {inputType === "text" ? (
              <Input size="small" />
            ) : inputType === "textarea" ? (
              <Input.TextArea size="small" rows={3} />
            ) : (
              <Radio.Group
                options={options}
                size="small"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              />
            )}
          </Form.Item>
        ) : (
          <div style={{ textAlign: "right", flex: 1 }}>
            {status ? (
              <Tag color={status}>
                {value?.toString().trim() ? value : fallbackValue}
              </Tag>
            ) : (
              <Text strong style={{ color: "#1f1f1f", fontSize: 14 }}>
                {value?.toString().trim() ? value : fallbackValue}
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Form form={form} onFinish={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          {!isEditing ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            >
              Editar perfil
            </Button>
          ) : (
            <Space>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  form.resetFields();
                }}
              >
                Cancelar
              </Button>
            </Space>
          )}
        </div>
        <Row gutter={[24, 24]}>
          {/* Profile Header Card */}
          <Col xs={24} lg={8}>
            <Card
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
                justifyContent: "space-between",
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                />
                <Title level={2} style={{ color: "white", marginBottom: 8 }}>
                  {userData.fullName || "Usuario"}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                  {userData.email}
                </Text>
              </div>

              <Divider
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  margin: "24px 0",
                }}
              />
              <Space
                wrap
                style={{ width: "100%", justifyContent: "center", gap: 24 }}
              >
                <div style={{ textAlign: "center" }}>
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    {
                      VENDOR_IS_ACTIVE_LABELS[
                        (userData.isActive || "false").toString()
                      ]
                    }
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Activación
                  </Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    {VENDOR_STATE_LABELS[userData.state]}
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>Estado</Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    {
                      VENDOR_IS_EMAIL_VERIFIED_LABELS[
                        (userData.isEmailVerified || "false").toString()
                      ]
                    }
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>Email</Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Title level={4} style={{ color: "white", margin: 0 }}>
                    {
                      VENDOR_IS_HABEAS_DATA_LABELS[
                        (userData.isHabeasDataConfirm || "false").toString()
                      ]
                    }
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Habeas Data
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Personal Information */}
          <Col xs={24} lg={16}>
            <InfoCard
              title="Información Personal"
              icon={<UserOutlined style={{ color: "white" }} />}
              description="Datos personales y de contacto de tu perfil. Puedes editar la información marcada con el ícono de editar."
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <InfoItem
                    label="Nombre completo"
                    value={userData.fullName || "No disponible"}
                    icon={<UserOutlined />}
                    editable={isEditing}
                  />
                  <InfoItem
                    label="E-mail"
                    value={userData.email || "No disponible"}
                    icon={<MailOutlined />}
                    editable={isEditing}
                  />
                  <InfoItem
                    label="Género"
                    value={genderMap[userData.gender as keyof typeof genderMap]}
                    fallbackValue="No disponible"
                    formFieldName="gender"
                    inputType="radio"
                    options={Object.entries(genderMap).map(([key, value]) => ({
                      label: value,
                      value: key,
                    }))}
                    icon={<UserOutlined />}
                    editable={isEditing}
                  />
                  <InfoItem
                    label="Activación"
                    value={
                      VENDOR_IS_ACTIVE_LABELS[
                        (userData.isActive || "false").toString()
                      ]
                    }
                    status={userData.isActive ? "success" : "error"}
                    icon={<CheckCircleOutlined />}
                  />
                  <InfoItem
                    label="Estado"
                    value={VENDOR_STATE_LABELS[userData.state]}
                    status={
                      userData.state !== "suspended" ? "success" : "error"
                    }
                    icon={<CheckCircleOutlined />}
                  />
                  <InfoItem
                    label="Email verificado"
                    value={
                      VENDOR_IS_EMAIL_VERIFIED_LABELS[
                        (userData.isEmailVerified || "false").toString()
                      ]
                    }
                    status={userData.isEmailVerified ? "success" : "warning"}
                    icon={<CheckCircleOutlined />}
                  />
                  <InfoItem
                    label="Habeas Data confirmado"
                    value={
                      VENDOR_IS_HABEAS_DATA_LABELS[
                        (userData.isHabeasDataConfirm || "false").toString()
                      ]
                    }
                    status={
                      userData.isHabeasDataConfirm ? "success" : "warning"
                    }
                    icon={<SafetyCertificateOutlined />}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <InfoItem
                    label="Número de identidad"
                    value={userData.identification || "No disponible"}
                    formFieldName="identification"
                    inputType="text"
                    icon={<IdcardOutlined />}
                  />

                  <InfoItem
                    label="Código de identificación"
                    value={userData.internalCode || "No disponible"}
                    icon={<IdcardOutlined />}
                  />
                  <InfoItem
                    label="Teléfono celular"
                    value={
                      userData.cellphone
                        ? `+${userData.cellphone}`
                        : "No disponible"
                    }
                    formFieldName="cellphone"
                    inputType="text"
                    icon={<PhoneOutlined />}
                    editable={isEditing}
                  />
                  <InfoItem
                    label="Biografía"
                    value={userData.bio}
                    fallbackValue="No disponible"
                    formFieldName="bio"
                    inputType="textarea"
                    icon={<GlobalOutlined />}
                    editable={isEditing}
                  />
                  <InfoItem
                    label="Dirección"
                    value={userData.address || "No disponible"}
                    icon={<HomeOutlined />}
                    editable={isEditing}
                    formFieldName="address"
                    inputType="textarea"
                  />
                </Col>
              </Row>
            </InfoCard>
          </Col>

          {/* Financial Information */}
          <Col xs={24}>
            <Card
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
                defaultActiveKey={["financial"]}
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
                        <Title
                          level={4}
                          style={{ margin: 0, color: "#1f1f1f" }}
                        >
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
                      Esta información es sensible y se mantiene segura. Solo se
                      muestra cuando es estrictamente necesario para
                      transacciones.
                    </Paragraph>
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <InfoItem
                          label="Registro comercial"
                          value={userData.commercialRegistry}
                          fallbackValue="No disponible"
                          icon={<TrophyOutlined />}
                          editable={isEditing}
                          formFieldName="commercialRegistry"
                          inputType="text"
                        />
                        <InfoItem
                          label="RUT"
                          value={userData.rut}
                          fallbackValue="No disponible"
                          icon={<IdcardOutlined />}
                          editable={isEditing}
                          formFieldName="rut"
                          inputType="text"
                        />
                      </Col>
                      <Col xs={24} md={12}>
                        <InfoItem
                          label="Banco"
                          value={userData.bankAccount?.entity}
                          formFieldName="bankAccount.entity"
                          icon={<BankOutlined />}
                          fallbackValue="No disponible"
                          editable={isEditing}
                          inputType="text"
                        />
                        <InfoItem
                          label="Tipo de cuenta"
                          value={userData.bankAccount?.type}
                          formFieldName="bankAccount.type"
                          fallbackValue="No disponible"
                          editable={isEditing}
                          inputType="text"
                        />
                        <InfoItem
                          label="Número de cuenta"
                          value={userData.bankAccount?.number}
                          formFieldName="bankAccount.number"
                          fallbackValue="No disponible"
                          editable={isEditing}
                          inputType="text"
                        />
                      </Col>
                    </Row>
                  </div>
                </Panel>
              </Collapse>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Index;
Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
