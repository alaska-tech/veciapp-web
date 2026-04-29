import React from "react";
import FormWrapper from "./formWrapper";
import {
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Typography,
  Row,
  Col,
} from "antd";
import { Parameter } from "@models";

export const valueInput: Record<Parameter["type"], React.ReactElement> = {
  string: <Input placeholder="Value" />,
  number: <InputNumber placeholder="Value" />,
  boolean: (
    <Radio.Group
      onChange={(e) => {
        console.log(e.target.value);
      }}
    >
      <Radio value={true}>True</Radio>
      <Radio value={false}>False</Radio>
    </Radio.Group>
  ),
  json: (
    <Select
      mode="tags"
      popupMatchSelectWidth={false}
      dropdownRender={(menu) => (
        <>
          <Typography.Text type="secondary" style={{ padding: "8px" }}>
            Escriba el item y oprima Enter para agregarlo
          </Typography.Text>
          <Divider
            style={{
              margin: "4px 0",
            }}
          />
          {menu}
        </>
      )}
    />
  ),
};

export const FormElement = <T extends Parameter>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
}) => {
  const [formRef] = Form.useForm<T>();
  const selectedParameterType = Form.useWatch("type", formRef);
  const handleFinish = async (values: T) => {
    if (props.onFinish) {
      values.value = JSON.stringify(values.value);
      await props.onFinish(values);
    }
  };

  return (
    <FormWrapper<T>
      formName={"newParameter"}
      onFinish={handleFinish}
      form={formRef}
      initialValues={{ isActive: true }}
      loading={props.loading}
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Form.Item label="Nombre interno" name="name" rules={[{ required: true }]}>
            <Input placeholder="ej: comission" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Nombre en pantalla"
            name="displayName"
            rules={[{ required: true }]}
          >
            <Input placeholder="ej: Comisión de la plataforma" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Describe para qué sirve este parámetro" rows={3} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
            <Select
              placeholder="Selecciona un tipo"
              onChange={() => {
                formRef.setFieldsValue({ value: undefined });
                if (formRef.isFieldTouched("value" as any)) {
                  formRef.validateFields(["value"]);
                }
              }}
            >
              <Select.Option value="string">Texto</Select.Option>
              <Select.Option value="number">Número</Select.Option>
              <Select.Option value="boolean">Booleano</Select.Option>
              <Select.Option value="json">Array</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Valor" name="value" rules={[{ required: true }]}>
            {valueInput[selectedParameterType] || (
              <Input placeholder="Selecciona primero el tipo" disabled={!selectedParameterType} />
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Activo" name="isActive" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Datos adicionales (JSON)" name="data">
            <Input.TextArea placeholder="Opcional" rows={3} />
          </Form.Item>
        </Col>
      </Row>
    </FormWrapper>
  );
};

export default FormElement
