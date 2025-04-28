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
    router.push("/(public)/setPassAccount");
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
      >
        <Form.Item label="Código" name="code" rules={[{ required: true }]}>
        <Input.OTP />
        </Form.Item>
        <Button htmlType="submit" type="primary" icon={<LockOutlined />}>
          Siguiente
        </Button>
      </Form>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout backButton={true}> {page}</LandingPageLayout>;
};
