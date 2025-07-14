import useAuthAction from "@/actions/auth.action";
import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Vendor } from "@/constants/models";
import {
  Descriptions,
  Tag,
  Image,
} from "antd";
import React, { ReactElement } from "react";

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
  return (
    <div>
      <Descriptions title="Información personal">
        <Descriptions.Item label="Nombre completo">
          {userData.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Número de identidad">
          {userData.identification}
        </Descriptions.Item>
        <Descriptions.Item label="Código de identificación">
          {userData.internalCode}
        </Descriptions.Item>
        <Descriptions.Item label="E-mail">{userData.email}</Descriptions.Item>

        <Descriptions.Item label="Teléfono celular">
          +{userData.cellphone}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección">
          {userData.address}
        </Descriptions.Item>
        <Descriptions.Item label="Género">
          {genderMap[userData.gender as keyof typeof genderMap]}
        </Descriptions.Item>
        <Descriptions.Item label="Biografía">{userData.bio}</Descriptions.Item>
        <Descriptions.Item label="Email verificado">
          <Tag color={userData.isEmailVerified ? "default" : "warning"}>
            {userData.isEmailVerified ? "Si" : "No"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Habeas Data confirmado">
          <Tag color={userData.isHabeasDataConfirm ? "default" : "warning"}>
            {userData.isHabeasDataConfirm ? "Si" : "No"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Tag color={userData.isActive ? "default" : "error"}>
            {userData.isActive ? "Activo" : "Inactivo"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Avatar">
          {userData.avatar ? (
            <Image
              src={userData.avatar}
              alt="Avatar"
              style={{ width: 100, height: 100 }}
            />
          ) : (
            "No disponible"
          )}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title="Información financiera" style={{ marginTop: 20 }}>
        <Descriptions.Item label="Registro comercial">
          {userData.commercialRegistry}
        </Descriptions.Item>
        <Descriptions.Item label="RUT">{userData.rut}</Descriptions.Item>
        <Descriptions.Item label="Banco">
          {userData.bankAccount?.entity} {userData.bankAccount?.type}{" "}
          {userData.bankAccount?.number}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default Index;
Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
