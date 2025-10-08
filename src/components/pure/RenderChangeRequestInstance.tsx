// 1. Primero, extrae el componente RenderChangeRequestInstance a un archivo separado
// Crea un nuevo archivo: src/components/pure/RenderChangeRequestInstance.tsx

import { Space, Typography } from "antd";
import { ChangeRequest } from "@/constants/models";
import dynamic from "next/dynamic";

const { Title } = Typography;

const NewBranchFormDynamic = dynamic(
  () => import("@/components/forms/newBranchForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const RenderChangeRequestInstance = (prop: {
  type: ChangeRequest["entityType"];
  value: ChangeRequest["requestedChanges"];
  vendorId: ChangeRequest["vendorId"];
}) => {
  const { type, value, vendorId } = prop;
  const { oldValues, newValues } = value;
  
  if (type === "STORE") {
    return (
      <Space>
        <Space direction="vertical" style={{ textAlign: "center" }}>
          <Title level={4}>Valores Antiguos</Title>
          <NewBranchFormDynamic
            key={`${type}-${vendorId}-old`}
            vendorId={vendorId}
            initialValues={oldValues as any}
            autoHideEmptyFields={true}
          />
        </Space>
        <Space direction="vertical" style={{ textAlign: "center" }}>
          <Title level={4}>Valores Nuevos</Title>
          <NewBranchFormDynamic
            key={`${type}-${vendorId}-new`}
            vendorId={vendorId}
            initialValues={newValues as any}
            autoHideEmptyFields={true}
          />
        </Space>
      </Space>
    );
  }
  
  return null;
};

export default RenderChangeRequestInstance;