import { Form, Input, Radio, Row, Col } from "antd";
import React from "react";
import { Customer, User } from "@models";
import FormWrapper from "./formWrapper";
import CustomSelectWithInput from "../pure/CustomSelectWithInput";

interface customerWithAuxProps extends Customer {
  prefix: string;
}
function parseInitialValues(values: Customer) {
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
          ? parseInitialValues(props.initialValues || ({} as Customer))
          : {
              prefix: "57",
            }
      }
      requiredMark={false}
      loading={props.loading}
      preserveDataInCache={!hasInitialValues}
      highligthOnChange={hasInitialValues}
    >
      {(formInstance) => (
        <Row gutter={[24, 16]}>
          {/* Primera fila - Nombre completo (ancho completo) */}
          <Col span={24}>
            <Form.Item
              name="fullName"
              label="Nombre completo"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Ingrese su nombre completo"
                disabled={hasInitialValues}
              />
            </Form.Item>
          </Col>

          {/* Segunda fila - Identificación y Email (mitad cada uno) */}
          <Col xs={24} md={12}>
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
              <Input
                placeholder="Ingrese su número de identidad"
                disabled={hasInitialValues}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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
              <Input placeholder="Ingrese su correo electrónico" />
            </Form.Item>
          </Col>

          {/* Tercera fila - Teléfono (ancho completo) */}
          <Col span={24}>
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
          </Col>

          {/* Cuarta fila - Género (ancho completo) */}
          <Col span={24}>
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
          </Col>

          {/* Quinta fila - Contraseñas (mitad cada uno) */}
          {!!hasInitialValues && (
            <>
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                      message:
                        "La contraseña no cumple con las reglas de seguridad",
                    },
                  ]}
                  hasFeedback
                  help="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
                >
                  <Input.Password placeholder="Ingrese su contraseña" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
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
                  <Input.Password placeholder="Repita su contraseña" />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      )}
    </FormWrapper>
  );
};
export default FormElement;

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
