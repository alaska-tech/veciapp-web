import React from "react";
import FormWrapper from "./formWrapper";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Typography,
} from "antd";

export const FormElement = (props: { onSubmit?: any }) => {
  const [formRef] = Form.useForm();
  const selectedParameterType = Form.useWatch("type", formRef);
  const onFinish = async (values: any) => {
    if (props.onSubmit) {
      props.onSubmit(values);
    }
  };
  const valueInput: Record<string, any> = {
    string: <Input placeholder="Value" />,
    number: <InputNumber placeholder="Value" />,
    boolean: (
      <Radio.Group>
        <Radio value={true}>True</Radio>
        <Radio value={false}>False</Radio>
      </Radio.Group>
    ),
    array: (
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
  return (
    <FormWrapper formName={"newBranch"} onSubmit={onFinish} form={formRef}>
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
              if (formRef.isFieldTouched("value")) {
                formRef.validateFields(["value"]);
              }
            }}
          >
            <Select.Option value="string">String</Select.Option>
            <Select.Option value="number">Number</Select.Option>
            <Select.Option value="boolean">Boolean</Select.Option>
            <Select.Option value="array">Array</Select.Option>
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
