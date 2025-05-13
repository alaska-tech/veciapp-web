import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
interface FormValues {
  code: string;
}
const Index = () => {
  const router = useRouter();
  const [formInstance] = Form.useForm();
  const { h } = router.query;
  const handleSubmit = async (values: FormValues) => {
    router.push("/p/setPassAccount?h=" + h + "&code=" + values.code);
  };
  return (
    <Form<FormValues>
      form={formInstance}
      onFinish={handleSubmit}
      style={{ minWidth: 300 }}
      layout="vertical"
    >
      <Form.Item label="Código" name="code" rules={[{ required: true }]}>
        <Input style={{ fontSize: "large", letterSpacing: "0.5em" }} />
      </Form.Item>
      <Button htmlType="submit" type="primary" icon={<LockOutlined />}>
        Siguiente
      </Button>
    </Form>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout backButton={true}> {page}</LandingPageLayout>;
};
