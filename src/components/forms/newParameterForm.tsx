import React from "react";
import FormWrapper from "./formWrapper";
import {
  Divider,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Typography,
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
    if (values.type === "number") {
      values.value = parseFloat(values.value as string);
    }
    if (values.type === "json") {
      values.value = JSON.stringify(values.value);
    }
    if (props.onFinish) {
      await props.onFinish(values);
    }
  };

  return (
    <FormWrapper<T>
      formName={"newParameter"}
      onFinish={handleFinish}
      form={formRef}
      initialValues={{ isActive: true }}
      routeTo="/a/configuration"
      loading={props.loading}
    >
      <div>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          label="Display Name"
          name="displayName"
          rules={[{ required: true }]}
        >
          <Input placeholder="Display Name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea placeholder="Description" rows={4} />
        </Form.Item>
        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
          <Select
            placeholder="Select a type"
            onChange={() => {
              formRef.setFieldsValue({ value: undefined });
              if (formRef.isFieldTouched("value" as any)) {
                formRef.validateFields(["value"]);
              }
            }}
          >
            <Select.Option value="string">String</Select.Option>
            <Select.Option value="number">Number</Select.Option>
            <Select.Option value="boolean">Boolean</Select.Option>
            <Select.Option value="json">Array</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Value" name="value" rules={[{ required: true }]}>
          {valueInput[selectedParameterType] || (
            <Input placeholder="Value" disabled={!selectedParameterType} />
          )}
        </Form.Item>
        <Form.Item label="Is Active" name="isActive" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>
      </div>
    </FormWrapper>
  );
};
