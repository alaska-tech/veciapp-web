import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Select, Tag } from "antd";
import React from "react";

export const FormElement = (props: {
  onFinish?: (values: any) => Promise<void>;
  loading?: boolean;
  initialValues?: any;
}) => {
  return (
    <Form
      name="updateProductServiceState"
      onFinish={props.onFinish}
      initialValues={props.initialValues}
    >
      <Form.Item label="Estado" name="state" required={true}>
        <Select
          options={[
            {
              label: <Tag color="blue">Disponible</Tag>,
              value: "available",
            },
            {
              label: <Tag color="default">No Disponible</Tag>,
              value: "unavailable",
            },
          ]}
        />
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
