import { BaseAttributes } from "@/constants/models";
import { SaveOutlined } from "@ant-design/icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { App, Button, Flex, Form, FormInstance, FormProps, Modal } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export interface FormWrapperProps<T>
  extends Omit<FormProps<any>, "children" | "onFinish"> {
  formName: string;
  onFinish?: (values: T) => Promise<void>;
  onSuccess?: () => void;
  children:
    | React.ReactNode
    | ((
        formInstance: FormInstance<T>,
        setAsTouched: () => void
      ) => React.ReactNode);
  loading?: boolean;
  preserveDataInCache?: boolean;
  highligthOnChange?: boolean;
}
const FormWrapper = <T extends Omit<object, keyof BaseAttributes>>({
  formName,
  children,
  initialValues,
  preserveDataInCache = true,
  highligthOnChange = false,
  ...formProps
}: FormWrapperProps<T>) => {
  const [formValues, setFormValues] = useLocalStorage<T | null>(
    "formValues/" + formName,
    null
  );
  const [form] = Form.useForm<T>();
  const router = useRouter();
  const { modal } = App.useApp();
  const [hasNewValue, setHasNewValue] = useState(false);
  const resetForm = () => {
    setFormValues(null);
    const actualFormInstance = formProps.form || form;
    actualFormInstance.resetFields();
    setHasNewValue(false);
  };
  const showConfirm = () => {
    modal.confirm({
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
    if (formValues && preserveDataInCache) {
      showConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: T) => {
    if (!!formProps.onFinish) {
      await formProps.onFinish(values).then(
        () => {
          resetForm();
          if (!!formProps.onSuccess) {
            formProps.onSuccess();
          } else {
            router.back();
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
    borderRadius: "12px",
    background: hasNewValue ? "rgba(255, 212, 6, 0.5)" : "inherit",
  };

  const buttonStyles: React.CSSProperties = {
    marginTop: 16,
    width: "100%",
    maxWidth: "200px",
  };
  function setAsTouched() {
    if (highligthOnChange) {
      setHasNewValue(true);
    }
  }
  return (
    <Form<T>
      form={formProps.form || form}
      onChange={() => {
        if (preserveDataInCache) {
          const actualFormInstance = formProps.form || form;
          const values = actualFormInstance.getFieldsValue();
          setFormValues(values);
        }
        setAsTouched();
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
      {hasNewValue && (
        <Button onClick={resetForm} style={{ alignSelf: "end" }}>
          Resetear
        </Button>
      )}
      {typeof children === "function"
        ? children(formProps.form || form, setAsTouched)
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
