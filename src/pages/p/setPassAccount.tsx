import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";  

interface FormValues {
  email: string;
  code: string;
}
const Index = () => {
  const router = useRouter();  
  const [formInstance] = Form.useForm();
  const handleSubmit = async () => {
    try {
      router.push("/(public)/succesVerified"); //si codigo es correcto
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
      >
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
        <Input placeholder="Correo Electrónico" />
        </Form.Item>
        <Form.Item label="Code" name="code" rules={[{ required: true }]}>
        <Input.Password placeholder="Confirma tu Contraseña" />
        </Form.Item>
        <Button htmlType="submit" type="primary" icon={<LockOutlined />}>
          Guardar y continuar
        </Button>
      </Form>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout backButton={true}> {page}</LandingPageLayout>;
};
