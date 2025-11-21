import useAuthAction from "@/actions/auth.action";
import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { LockOutlined, SendOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
interface FormValues {
  newPassword:string,
  password:string
}
const Index = () => {
  const [formInstance] = Form.useForm();
  const {token} = useRouter().query;
  const actions = useAuthAction();
  const recoverPassword = actions.recoverCustomerPassword();
  const router = useRouter();
  const handleSubmit = async (values: FormValues) => {
    const newBody = {
      token: token as string,
      newPassword: values.newPassword
    }
    try {
      await recoverPassword.mutateAsync({ body: newBody }).then(
        () => {
          router.push("/");
        },
        () => {}
      );
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
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            {
              required: true,
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message: "La contraseña no cumple con las reglas de seguridad",
            },
          ]}
          hasFeedback
          help="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirma tu contraseña "
          name="newPassword"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Las contraseñas no coinciden")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirma tu Contraseña" />
        </Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          icon={<LockOutlined />}
          loading={recoverPassword.isPending}
        >
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
