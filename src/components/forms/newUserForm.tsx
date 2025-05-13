import { Form, Input, Radio } from "antd";
import React from "react";
import { Customer } from "@models";
import FormWrapper from "./formWrapper";
import CustomSelectWithInput from "../pure/CustomSelectWithInput";

interface customerWithAuxProps extends Customer {
  prefix: string;
}
function parseInitialValues(values: any) {
  const [prefix, cellphone] = values.cellphone
    ? (values.cellphone as string).split(" ")
    : ["", ""];
  return { ...values, prefix, cellphone };
}
export const FormElement = <T extends customerWithAuxProps>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
}) => {
  const hasInitialValues: boolean = !!props.initialValues;
  const handleFinish = async (values: T) => {
    const { cellphone, prefix, ...rest } = values;
    const mappedCellphone =
      !!prefix && !!cellphone ? prefix + " " + cellphone : "";
    const mappedValues = {
      ...rest,
      cellphone: mappedCellphone,
    } as T;
    if (props.onFinish) {
      await props.onFinish(mappedValues);
    }
  };

  return (
    <FormWrapper
      formName={"newCustomer"}
      onFinish={handleFinish}
      initialValues={
        hasInitialValues
          ? parseInitialValues(props.initialValues)
          : {
              prefix: "57",
              password: "Vcapp20251",
            }
      }
      requiredMark={false}
      routeTo="/a/users"
      loading={props.loading}
      preserveDataInCache={!hasInitialValues}
      highligthOnChange={hasInitialValues}
    >
      {(formInstance) => (
        <div>
          <Form.Item
            name="fullName"
            label="Nombre completo"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled={hasInitialValues} />
          </Form.Item>
          <Form.Item
            name="identification"
            label="Número de identidad"
            tooltip="Escriba el número de identidad sin puntos ni espacios"
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: "El número de identidad solo puede contener números",
              },
              {
                required: true,
              },
            ]}
          >
            <Input disabled={hasInitialValues} />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
              },
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cellphone"
            label="Teléfono celular"
            tooltip="Escriba el número de celular sin puntos ni espacios"
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: "El teléfono solo puede contener números",
              },
              { required: true },
            ]}
          >
            <Input
              addonBefore={
                <Form.Item name="prefix" rules={[{ required: true }]} noStyle>
                  <CustomSelectWithInput
                    selectProps={{
                      options: [
                        {
                          value: "57",
                          label: "+57",
                        },
                      ],
                      style: { width: 75 },
                      popupMatchSelectWidth: false,
                    }}
                    inputProps={{
                      placeholder: "Escriba...",
                      style: {
                        width: 65,
                      },
                    }}
                  />
                </Form.Item>
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          {/*  <Form.Item
            name="address"
            label="Dirección"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Edad"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="birthdate"
            label="Fecha de nacimiento"
            rules={[
              {
                type: "object" as const,
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item> */}
          <Form.Item
            name="gender"
            label="Género"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group
              options={[
                { value: "male", label: "Hombre" },
                { value: "female", label: "Mujer" },
                { value: "other", label: "Otro" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
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
            name="confirm-password"
            label="Repita el password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
              },
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
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        </div>
      )}
    </FormWrapper>
  );
};

//ddddddddddddddddddddddddddddddddddddddddddd
/* import { PlusOutlined } from "@ant-design/icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
const { Option } = Select;

export const FormElement = (props: { onSubmit?: any }) => {
  const [formValues, setFormValues] = useLocalStorage(
    "formValues/newUser",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: any) => {
    if (props.onSubmit) {
      await props.onSubmit(values);
    }
  };
  const [customPrefixValue, setCustomPrefixValue] = useState("+");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 75 }}
        open={isDropdownOpen}
        onDropdownVisibleChange={setIsDropdownOpen}
        popupMatchSelectWidth={false}
        dropdownRender={(menu) => {
          const handleConfirm = () => {
            form.setFieldValue("prefix", customPrefixValue);
            setIsDropdownOpen(false);
          };
          return (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Space>
                <Input
                  placeholder="Please enter item"
                  onKeyDown={(e) => e.stopPropagation()}
                  value={customPrefixValue}
                  onChange={(e) => {
                    setCustomPrefixValue(e.target.value);
                  }}
                  style={{
                    width: 65,
                  }}
                  onPressEnter={handleConfirm}
                />
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={handleConfirm}
                >
                  Guardar
                </Button>
              </Space>
            </>
          );
        }}
      >
        <Option value="57">+57</Option>
      </Select>
    </Form.Item>
  );
  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      onChange={() => {
        const values = form.getFieldsValue();
        console.log("onChange", values);
        setFormValues(values);
      }}
      initialValues={
        formValues || {
          prefix: "57",
          password: "Password123",
        }
      }
      style={{ maxWidth: 600 }}
      scrollToFirstError
      labelWrap
      requiredMark={false}
    >
      <Form.Item
        name="fullName"
        label="Nombre completo"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="identification"
        label="Número de identidad"
        tooltip="Escriba el número de identidad sin puntos ni espacios"
        rules={[
          {
            pattern: /^[0-9]+$/,
            message: "El número de identidad solo puede contener números",
          },
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
          },
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="cellphone"
        label="Teléfono celular"
        tooltip="Escriba el número de celular sin puntos ni espacios"
        rules={[
          {
            pattern: /^[0-9]+$/,
            message: "El teléfono solo puede contener números",
          },
          { required: true },
        ]}
      >
        <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="address"
        label="Dirección"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label="Edad"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="birthdate"
        label="Fecha de nacimiento"
        rules={[
          {
            type: "object" as const,
            required: true,
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Género"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Radio.Group
          options={[
            { value: "male", label: "Hombre" },
            { value: "female", label: "Mujer" },
            { value: "other", label: "Otro" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            message: "La contraseña no cumple con las reglas de seguridad",
          },
          {
            required: true,
          },
          {
            required: true,
          },
        ]}
        hasFeedback
        help="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};
 */
