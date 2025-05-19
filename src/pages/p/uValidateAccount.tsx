import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, App, Typography } from "antd";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useCustomerAction } from "@/actions/customer.action";
import { AxiosError } from "axios";
interface FormValues {
  code: string;
}
const Index = () => {
  const router = useRouter();
  const [formInstance] = Form.useForm();
  const { h } = router.query;
  const actions = useCustomerAction();
  const { modal } = App.useApp();
  const validateAccount = actions.validateAccount();

  const handleSubmit = async (values: FormValues) => {
    return validateAccount
      .mutateAsync({
        body: {
          hash: h as string,
        },
      })
      .then(
        () => {
          router.push("/p/successVerified");
        },
        (res: AxiosError) => {
          modal.error({
            title: `Error ${res.code || "inesperado"}`,
            content: (
              <Typography.Text>
                Ha ocurrido un error. Por favor intenta nuevamente desde el
                correo que recibiste.
              </Typography.Text>
            ),
            okText: "Cerrar",
            onOk: () => {
              router.replace("/");
            },
          });
        }
      );
  };
  return (
    <Form<FormValues>
      form={formInstance}
      onFinish={handleSubmit}
      style={{ minWidth: 300 }}
      layout="vertical"
    >
      <Button htmlType="submit" type="primary" icon={<LockOutlined />}>
        Verificar correo electrónico
      </Button>
    </Form>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout backButton={true}> {page}</LandingPageLayout>;
};
