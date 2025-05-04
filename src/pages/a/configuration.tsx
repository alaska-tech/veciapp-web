import React, { ReactElement, useState } from "react";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import {
  AppstoreAddOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useParameterAction } from "@/actions/parameter.action";
import {
  Button,
  Card,
  Collapse,
  Descriptions,
  Form,
  Space,
  Tag,
  Typography,
} from "antd";
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
  const toggleIsActive = parameterActions.toggleIsActive();
  return (
    <Card
      title={
        <Space direction="vertical" style={{ rowGap: 0, margin: "8px 0px" }}>
          {parameter.displayName}
          <Typography.Text
            type="secondary"
            style={{ margin: 0, textWrap: "wrap" }}
          >
            {parameter.description}
          </Typography.Text>
        </Space>
      }
      extra={
        parameter.isActive ? (
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            onClick={async () => {
              let mappedValue = value;
              if (parameter.type === "number") {
                mappedValue = parseFloat(value as string);
              }
              if (parameter.type === "json") {
                mappedValue = JSON.stringify(value);
              }
              try {
                await updateParameter.mutateAsync({
                  id: parameter.id,
                  body: { value: mappedValue },
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
              marginLeft: "1rem",
            }}
            loading={updateParameter.isPending}
          >
            Guardar
          </Button>
        ) : (
          <Tag icon={<MinusCircleOutlined />} color="default">
            Inactivo
          </Tag>
        )
      }
      style={{
        background: hasNewValue ? "#ffd406" : "#ffffff",
      }}
      styles={{
        body: {
          margin: 0,
          padding: 0,
        },
      }}
    >
      <Collapse
        ghost
        expandIconPosition="end"
        collapsible="icon"
        items={[
          {
            key: "1",
            label: (
              <Form
                initialValues={{
                  value:
                    parameter.type === "json"
                      ? JSON.parse(parameter.value as string)
                      : parameter.value,
                }}
                form={form}
                onChange={(e) => {
                  console.log(e);
                }}
                style={{
                  padding: 0,
                }}
              >
                <Form.Item noStyle name="value">
                  {React.cloneElement(
                    valueInput[parameter.type] as React.ReactElement<{
                      onChange?: (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => void;
                      style?: React.CSSProperties;
                      disabled?: boolean;
                    }>,
                    {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        setHasNewValue(e?.target?.value !== parameter.value);
                      },
                      style: {
                        width: "100%",
                      },
                      disabled: !parameter.isActive,
                    }
                  )}
                </Form.Item>
              </Form>
            ),
            styles: {
              header: {
                padding: "8px 12px",
              },
              body: {
                padding: "8px 12px",
              },
            },
            children: (
              <Descriptions size="small" column={1} layout="vertical">
                <Descriptions.Item label="Nombre interno" span={3}>
                  {parameter.name}
                </Descriptions.Item>
                <Descriptions.Item label="Creado" span={3}>
                  {parameter.createdAt} por{" "}
                  {parameter.createdBy || "Desconocido"}
                </Descriptions.Item>
                <Descriptions.Item label="Actualizado por última vez" span={3}>
                  {parameter.updatedAt} por{" "}
                  {parameter.updatedBy || "Desconocido"}
                </Descriptions.Item>
                <Descriptions.Item label="Estado" span={3}>
                  {parameter.isActive ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      Activo
                    </Tag>
                  ) : (
                    <Tag icon={<MinusCircleOutlined />} color="default">
                      Inactivo
                    </Tag>
                  )}
                  <Button
                    type="link"
                    onClick={async () => {
                      try {
                        await toggleIsActive.mutateAsync({
                          id: parameter.id,
                        });
                        setHasNewValue(false);
                      } catch (error) {
                        console.error("Error updating parameter:", error);
                      }
                    }}
                    style={{ marginLeft: "1rem" }}
                    loading={toggleIsActive.isPending}
                  >
                    {parameter.isActive ? "Desactivar" : "Activar"}
                  </Button>
                </Descriptions.Item>
              </Descriptions>
            ),
          },
        ]}
      />
    </Card>
  );
};
