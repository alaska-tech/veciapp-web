import { useParameterAction } from "@/actions/parameter.action";
import { Parameter } from "@/constants/models";
import {
  SaveOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Form,
  Card,
  Space,
  Typography,
  Button,
  Tag,
  Collapse,
  Descriptions,
  CardProps,
} from "antd";
import React, { useState } from "react";
import { valueInput } from "../forms/newParameterForm";

interface ParameterCardProps extends CardProps {
  parameter: Parameter;
  onClickOnSave?: (
    value: string | number | boolean,
    parameter: Parameter
  ) => Promise<void>;
  onClickOnToggle?: (parameter: Parameter) => Promise<void>;
  loading?: boolean;
}
const ParameterCard = ({
  parameter,
  onClickOnSave,
  onClickOnToggle,
  ...cardProps
}: ParameterCardProps) => {
  const [form] = Form.useForm();
  const value = Form.useWatch("value", form);
  const [hasNewValue, setHasNewValue] = useState(false);
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
              await onClickOnSave?.(value, parameter);
              setHasNewValue(false);
            }}
            style={{
              opacity: hasNewValue ? 1 : 0,
              transform: hasNewValue ? "translateY(0)" : "translateY(-4px)",
              transition: "visibility 0.3s ease, transform 0.3s ease",
              visibility: hasNewValue ? "visible" : "hidden",
              marginLeft: "1rem",
            }}
            loading={cardProps.loading}
          >
            Guardar
          </Button>
        ) : (
          <Tag
            icon={<MinusCircleOutlined />}
            color="default"
            style={{
              marginLeft: "1rem",
            }}
          >
            Inactivo
          </Tag>
        )
      }
      style={{
        background: hasNewValue ? "#ffd406" : "#ffffff",
        maxWidth: "450px",
      }}
      styles={{
        body: {
          margin: 0,
          padding: 0,
        },
      }}
      {...cardProps}
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
                  value: JSON.parse(parameter.value),
                }}
                form={form}
                /* onChange={(e) => {
                  console.log(e);
                }} */
                style={{
                  padding: 0,
                }}
              >
                <Form.Item noStyle name="value">
                  {React.cloneElement(
                    (valueInput[parameter.type] || (
                      <React.Fragment />
                    )) as React.ReactElement<{
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
                      await onClickOnToggle?.(parameter);
                      setHasNewValue(false);
                    }}
                    style={{ marginLeft: "1rem" }}
                    loading={cardProps.loading}
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

export default ParameterCard;
