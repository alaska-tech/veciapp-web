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
} from "antd";
import React, { ReactElement } from "react";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import { Parameter } from "@models";

const { Option } = Select;

const Index = () => {
  return <NewParameterButton />;
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};

const NewParameterButton = () => {
  const { modal } = App.useApp();
  const [formRef] = Form.useForm<Parameter>();
  const selectedParameterType = Form.useWatch("type", formRef);
  const valueInput: Record<string, any> = {
    string: <Input placeholder="Value" />,
    number: <InputNumber placeholder="Value" />,
    boolean: (
      <Radio.Group>
        <Radio value={true}>True</Radio>
        <Radio value={false}>False</Radio>
      </Radio.Group>
    ),
    array: <><Select mode="tags" /><Typography.Text type="secondary">Escriba el item y oprima enter para agregarlo</Typography.Text></>,
  };
  const handleOnFinish = async (values: Parameter) => {
    console.log("Creating parameter:", values);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Parameter created successfully");
  };
  const form = (
    <Form<Parameter>
      requiredMark={false}
      onFinish={handleOnFinish}
      form={formRef}
    >
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
          <Option value="string">String</Option>
          <Option value="number">Number</Option>
          <Option value="boolean">Boolean</Option>
          <Option value="array">Array</Option>
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Parameter
        </Button>
      </Form.Item>
    </Form>
  );
  function handleClick() {
    modal.info({
      title: "New Parameter",
      content: form,
      okButtonProps: {
        style: {
          display: "none",
        },
      },
    });
  }

  return <>{form}</>;
};
