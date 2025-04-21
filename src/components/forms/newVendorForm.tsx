import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  FormInstance,
  Input,
  Radio,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import FormWrapper from "./formWrapper";
const { Option } = Select;
const columnMinWidth = "220px";

export const FormElement = (props: { onSubmit?: any }) => {
  const onFinish = async (values: any) => {
    props.onSubmit && props.onSubmit(values);
  };
  const [customPrefixValue, setCustomPrefixValue] = useState("+");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const prefixSelector = (form: FormInstance) => (
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
    <FormWrapper
      formName={"newVendor"}
      onSubmit={onFinish}
      initialValues={{
        prefix: "57",
        password: "Password123",
      }}
    >
      {(formInstance) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "60px",
          }}
        >
          <div style={{ flex: `1 1 ${columnMinWidth}` }}>
            <Divider>Información personal</Divider>
            <Form.Item
              name="internalCode"
              label="Código interno"
              tooltip="Escriba el código interno de la fundación Malewa"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
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
              <Input
                addonBefore={prefixSelector(formInstance)}
                style={{ width: "100%" }}
              />
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
              <Input />
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
              name={"bio"}
              label="Biografía"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "La contraseña no cumple con las reglas de seguridad",
                },
                {
                  required: true,
                },
                {
                  required: true,
                },
              ]}
              hasFeedback
              help={
                <div style={{ whiteSpace: "normal", maxWidth: columnMinWidth }}>
                  La contraseña debe tener al menos 8 caracteres, una letra
                  mayúscula, una letra minúscula y un número
                </div>
              }
            >
              <Input.Password />
            </Form.Item>
          </div>
          <div style={{ flex: `1 1 ${columnMinWidth}` }}>
            <Divider>Información financiera</Divider>
            <Form.Item
              name={"commercialRegistry"}
              label="Registro comercial"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"rut"}
              label="RUT"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["bankAccount", "entity"]}
              label="Banco"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["bankAccount", "number"]}
              label="Número de cuenta"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["bankAccount", "type"]}
              label="Tipo de cuenta"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                options={[
                  { value: "Ahorros", label: "Ahorro" },
                  { value: "Corriente", label: "Corriente" },
                ]}
              />
            </Form.Item>
          </div>
        </div>
      )}
    </FormWrapper>
  );
};
