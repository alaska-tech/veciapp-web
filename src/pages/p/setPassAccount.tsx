import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { LockOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useVendorAction } from "@/actions/vendor.action";
import { AxiosError } from "axios";

interface FormValues {
  confirmPassword: string;
  pass: string;
  code: string;
  hash: string;
}
const Index = () => {
  const router = useRouter();
  const [formInstance] = Form.useForm();
  const { h, code } = router.query;
  const vendorActions = useVendorAction();
  const validateAccount = vendorActions.validateAccount();
  const handleSubmit = async (values: FormValues) => {
    //TODO: Este endpoint parece estar protegido y debe ser publico
    return validateAccount
      .mutateAsync({
        body: {
          hash: h as string,
          code: code as string,
          pass: values.pass,
        },
      })
      .then(
        () => {
          router.push("/p/successVerified");
        },
        (res: AxiosError) => {
          if (res.code === "404") {
            router.push("/p/validateAccount");
          }
        }
      );
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
          name="confirmPassword"
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
          loading={validateAccount.isPending}
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
