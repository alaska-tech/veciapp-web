import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Select, Tag } from "antd";
import React from "react";

export const FormElement = (props: {
  onFinish?: (values: any) => Promise<void>;
  loading?: boolean;
  initialValues?: any;
}) => {
  return (
    <Form
      name="updateProductServiceInventory"
      onFinish={props.onFinish}
      initialValues={props.initialValues}
    >
      <Form.Item label="Cantidad" name="inventory" required={true}>
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item style={{ textAlign: "center" }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            marginTop: 16,
            width: "100%",
            maxWidth: "200px",
          }}
          icon={<SaveOutlined />}
          loading={props.loading}
        >
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormElement;
