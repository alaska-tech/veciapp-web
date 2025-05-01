import {
  Select,
  Form,
  InputNumber,
  Switch,
  Radio,
  Button,
  App,
  Input,
  Typography,
  Space,
} from "antd";
import React, { ReactElement } from "react";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import { Parameter } from "@models";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useParameterAction } from "@/actions/parameter.action";

const Index = () => {
  const parameterActions = useParameterAction();
  const parameters = parameterActions.getParameters();
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button href="/(admin)/newParameter" icon={<AppstoreAddOutlined />}>
          Nuevo parámetro
        </Button>
      </Space>
      {parameters.isLoading && <div>Cargando...</div>}
      {parameters.isError && <div>Error al cargar los parámetros</div>}
      {parameters.isSuccess && parameters.data && parameters.data.length > 0 ? (
        JSON.stringify(parameters.data, null, 2)
      ) : (
        <div>No hay parámetros disponibles</div>
      )}
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
