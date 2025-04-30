import { BaseAttributes } from "@/constants/models";
import { SaveOutlined } from "@ant-design/icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button, Form, FormInstance, FormProps, Modal } from "antd";
import React, { useEffect } from "react";

interface FormWrapperProps<T> extends Omit<FormProps<any>, "children"> {
  formName: string;
  onFinish?: (values: T) => void | Promise<void>;
  children:
    | React.ReactNode
    | ((formInstance: FormInstance<T>) => React.ReactNode);
}
const FormWrapper = <T extends Omit<object, keyof BaseAttributes>>({
  formName,
  children,
  initialValues,
  ...formProps
}: FormWrapperProps<T>) => {
  const [formValues, setFormValues] = useLocalStorage<T|null>(
    "formValues/" + formName,
    null
  );
  const [form] = Form.useForm<T>();

  const showConfirm = () => {
    Modal.confirm({
      title: "Sigamos por donde lo dejaste",
      content:
        "Hay cambios no guardados desde la última vez que estuviste aqui",
      okText: "Continuar",
      cancelText: "Descartar",
      onCancel() {
        setFormValues(null);
        form.resetFields();
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
    if (formProps.onFinish) {
      await formProps.onFinish(values);
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
      onFinish={onFinish}
      onChange={() => {
        const values = form.getFieldsValue();
        setFormValues(values);
      }}
      initialValues={formValues || initialValues}
      style={formStyles}
      scrollToFirstError
      labelWrap
      requiredMark={false}
      layout={"vertical"}
      {...formProps}
    >
      {typeof children === "function" ? children(formProps.form || form) : children}
      <Form.Item style={{ textAlign: "center" }}>
        <Button
          type="primary"
          htmlType="submit"
          style={buttonStyles}
          icon={<SaveOutlined />}
        >
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormWrapper;
