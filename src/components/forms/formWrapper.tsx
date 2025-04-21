import { SaveOutlined } from "@ant-design/icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button, Form, FormInstance, FormProps, Modal } from "antd";
import React, { useEffect } from "react";

interface FormWrapperProps extends Omit<FormProps<any>, "children"> {
  formName: string;
  onSubmit?: (values: any) => void | Promise<void>;
  children:
    | React.ReactNode
    | ((formInstance: FormInstance<any>) => React.ReactNode);
  initialValues?: any;
}
const FormWrapper = ({formName, onSubmit, children, initialValues, ...formProps}: FormWrapperProps) => {
  const [formValues, setFormValues] = useLocalStorage(
    "formValues/" + formName,
    null
  );
  const [form] = Form.useForm();

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
  }, []);

  const onFinish = async (values: any) => {
    onSubmit && (await onSubmit(values));
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
    <Form
      form={form}
      name={formName}
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
      {typeof children === "function"
        ? children(form)
        : children}
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
