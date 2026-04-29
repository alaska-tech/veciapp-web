import { Parameter } from "@/constants/models";
import {
  SaveOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
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
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { valueInput } from "../forms/newParameterForm";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        title={
          <Space direction="vertical" style={{ rowGap: 2, margin: "6px 0" }}>
            <Space size={6}>
              <Typography.Text strong>{parameter.displayName}</Typography.Text>
              {!parameter.isActive && (
                <Tag icon={<MinusCircleOutlined />} color="default">
                  Inactivo
                </Tag>
              )}
            </Space>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, fontWeight: "normal", whiteSpace: "normal" }}
            >
              {parameter.description}
            </Typography.Text>
          </Space>
        }
        extra={
          hasNewValue ? (
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onClick={async () => {
                await onClickOnSave?.(value, parameter);
                setHasNewValue(false);
              }}
              loading={cardProps.loading}
            >
              Guardar
            </Button>
          ) : null
        }
        style={{
          borderLeft: hasNewValue ? "3px solid #1677ff" : undefined,
          transition: "border-left 0.2s ease",
        }}
        styles={{ body: { padding: 0 } }}
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
                  initialValues={{ value: parameter.value }}
                  form={form}
                  style={{ padding: 0 }}
                >
                  <Form.Item noStyle name="value">
                    {React.cloneElement(
                      (valueInput[parameter.type] || (
                        <React.Fragment />
                      )) as React.ReactElement<{
                        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
                        style?: React.CSSProperties;
                        disabled?: boolean;
                      }>,
                      {
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          setHasNewValue(e?.target?.value !== parameter.value);
                        },
                        style: { width: "100%" },
                        disabled: !parameter.isActive,
                      }
                    )}
                  </Form.Item>
                </Form>
              ),
              styles: {
                header: { padding: "8px 12px" },
                body: { padding: "8px 12px" },
              },
              children: (
                <Descriptions size="small" column={1} layout="vertical">
                  <Descriptions.Item label="Nombre interno">
                    <Typography.Text code>{parameter.name}</Typography.Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tipo">
                    <Tag>{parameter.type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Estado">
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
                      size="small"
                      onClick={async () => {
                        await onClickOnToggle?.(parameter);
                        setHasNewValue(false);
                      }}
                      loading={cardProps.loading}
                    >
                      {parameter.isActive ? "Desactivar" : "Activar"}
                    </Button>
                  </Descriptions.Item>
                  <Descriptions.Item label="Creado">
                    {dayjs(parameter.createdAt).format("DD/MM/YYYY HH:mm")}{" "}
                    {parameter.createdBy ? `por ${parameter.createdBy}` : ""}
                  </Descriptions.Item>
                  {parameter.updatedAt && (
                    <Descriptions.Item label="Última actualización">
                      {dayjs(parameter.updatedAt).format("DD/MM/YYYY HH:mm")}{" "}
                      {parameter.updatedBy ? `por ${parameter.updatedBy}` : ""}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ),
            },
          ]}
        />
      </Card>
    </motion.div>
  );
};

export default ParameterCard;
