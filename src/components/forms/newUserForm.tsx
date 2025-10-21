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
        </Row>
      )}
    </FormWrapper>
  );
};
export default FormElement;
