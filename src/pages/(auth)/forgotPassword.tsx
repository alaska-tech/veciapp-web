import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { SendOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import React, { ReactElement } from "react";
interface FormValues {
  email: string;
  code: string;
}
const Index = () => {
  const [formInstance] = Form.useForm();
  const handleSubmit = async () => {
    try {
      const values = formInstance.getFieldsValue();
      //await formInstance.validateFields();
      //await verifyCode.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Form<FormValues>
        form={formInstance}
        onFinish={handleSubmit}
        style={{ minWidth: 300 }}
        requiredMark={false}
      >
        <Form.Item  name="email" rules={[{ required: true }]}>
          <Input placeholder="Escribe tu correo electrónico" />
        </Form.Item>
        <Button htmlType="submit" type="primary" icon={<SendOutlined />}>
          Enviar enlace de recuperación
        </Button>
      </Form>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout backButton={true}> {page}</LandingPageLayout>;
};
