import React, { ReactElement, useState } from "react";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import { AppstoreAddOutlined, SaveOutlined } from "@ant-design/icons";
import { useParameterAction } from "@/actions/parameter.action";
import { Button, Card, Form, Space } from "antd";
import { Parameter } from "@models";
import { valueInput } from "@/components/forms/newParameterForm";

const Index = () => {
  const parameterActions = useParameterAction();
  const parametersQuery = parameterActions.getParameters();
  const { parameters: data, count } = parametersQuery?.data?.data ?? {
    parameters: [],
    count: 0,
  };

  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button href="/a/newParameter" icon={<AppstoreAddOutlined />}>
          Nuevo parámetro
        </Button>
      </Space>
      {parametersQuery.isLoading && <div>Cargando...</div>}
      {parametersQuery.isError && <div>Error al cargar los parámetros</div>}
      {parametersQuery.isSuccess && data && data.length > 0 ? (
        <Space wrap style={{ gap: "1rem" }}>
          {data.map((parameter: Parameter) => (
            <div key={parameter.id}>
              <RenderParameter parameter={parameter} />
            </div>
          ))}
        </Space>
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

const RenderParameter = ({ parameter }: { parameter: Parameter }) => {
  const [form] = Form.useForm();
  const value = Form.useWatch("value", form);
  const [hasNewValue, setHasNewValue] = useState(false);
  const parameterActions = useParameterAction();
  const updateParameter = parameterActions.updateParameter();
  return (
    <Card
      title={parameter.displayName}
      extra={
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          onClick={async () => {
            try {
              await updateParameter.mutateAsync({
                id: parameter.id,
                body: { value },
              });
              setHasNewValue(false);
            } catch (error) {
              console.error("Error updating parameter:", error);
            }
          }}
          style={{
            opacity: hasNewValue ? 1 : 0,
            transform: hasNewValue ? "translateY(0)" : "translateY(-4px)",
            transition: "visibility 0.3s ease, transform 0.3s ease",
            visibility: hasNewValue ? "visible" : "hidden",
          }}
        >
          Guardar
        </Button>
      }
      style={{
        background: hasNewValue ? "#ffd406" : "#ffffff",
      }}
    >
      <Card.Meta description={parameter.description} />
      <Form
        initialValues={{ value: parameter.value }}
        form={form}
        onChange={(e) => {
          console.log(e);
        }}
        style={{ marginTop: "1rem" }}
      >
        <Form.Item noStyle name="value">
          {React.cloneElement(
            valueInput[parameter.type] as React.ReactElement<{
              onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
              style?: React.CSSProperties;
            }>,
            {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setHasNewValue(e?.target?.value !== parameter.value);
              },
              style: {
                width: "100%",
              },
            }
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};
