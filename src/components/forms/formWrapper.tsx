import { BaseAttributes } from "@/constants/models";
import { SaveOutlined } from "@ant-design/icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button, Form, FormInstance, FormProps, Modal } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface FormWrapperProps<T>
  extends Omit<FormProps<any>, "children" | "onFinish"> {
  formName: string;
  onFinish?: (values: T) => Promise<void>;
  routeTo?: string;
  children:
    | React.ReactNode
    | ((formInstance: FormInstance<T>) => React.ReactNode);
  loading?: boolean;
}
const FormWrapper = <T extends Omit<object, keyof BaseAttributes>>({
  formName,
  children,
  initialValues,
  ...formProps
}: FormWrapperProps<T>) => {
  const [formValues, setFormValues] = useLocalStorage<T | null>(
    "formValues/" + formName,
    null
  );
  const [form] = Form.useForm<T>();
  const router = useRouter();
  const resetForm = () => {
    setFormValues(null);
    const actualFormInstance = formProps.form || form;
    actualFormInstance.resetFields();
  };
  const showConfirm = () => {
    Modal.confirm({
      title: "Sigamos por donde lo dejaste",
      content:
        "Hay cambios no guardados desde la última vez que estuviste aqui",
      okText: "Continuar",
      cancelText: "Descartar",
      onCancel() {
        resetForm();
      },
    });
  };
  useEffect(() => {
    if (formValues) {
      showConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: T) => {
    if (!!formProps.onFinish) {
      formProps.onFinish(values).then(
        () => {
          resetForm();
          if (formProps.routeTo) {
            router.push(formProps.routeTo || "/");
          }
        },
        () => {}
      );
    }
  };

  const formStyles: React.CSSProperties = {
    width: "100%",
    //maxWidth: "600px",
    padding: "16px",
    margin: "0 auto",
  };

  const buttonStyles: React.CSSProperties = {
    marginTop: 16,
    width: "100%",
    maxWidth: "200px",
  };

  return (
    <Form<T>
      form={formProps.form || form}
      onChange={() => {
        const actualFormInstance = formProps.form || form;
        const values = actualFormInstance.getFieldsValue();
        setFormValues(values);
      }}
      initialValues={formValues || initialValues}
      style={formStyles}
      scrollToFirstError
      labelWrap
      requiredMark={false}
      layout={"vertical"}
      {...formProps}
      onFinish={onFinish}
    >
      <p>{JSON.stringify(formProps.loading)}</p>
      {typeof children === "function"
        ? children(formProps.form || form)
        : children}
      <Form.Item style={{ textAlign: "center" }}>
        <Button
          type="primary"
          htmlType="submit"
          style={buttonStyles}
          icon={<SaveOutlined />}
          loading={formProps.loading}
        >
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormWrapper;
