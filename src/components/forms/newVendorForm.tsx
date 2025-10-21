import { Divider, Form, Input, InputNumber, Radio, Row, Col } from "antd";
import React from "react";
import {
  Vendor,
  VendorGenders,
  IdentificationOptions,
  EthnicityOptions,
} from "@models";
import FormWrapper from "./formWrapper";
import CustomSelectWithInput from "../pure/CustomSelectWithInput";
import { GENDER_LABELS } from "@/constants/labels";

const columnMinWidth = "220px";
interface vendorWithAuxProps extends Vendor {
  prefix: string;
}
function parseInitialValues(values: any) {
  const [prefix, cellphone] = values.cellphone
    ? (values.cellphone as string).split(" ")
    : ["", ""];
  return { ...values, prefix, cellphone };
}
const nonEditableFields = [
  "internalCode",
  "fullName",
  "identification",
  "identificationType",
  "commercialRegistry",
  "rut",
  "email",
] as const;
export const FormElement = <T extends vendorWithAuxProps>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
}) => {
  const hasInitialValues: boolean = !!props.initialValues;
  const handleFinish = async (values: T) => {
    const { cellphone, prefix, ...rest } = values;
    const mappedCellphone =
      !!prefix && !!cellphone ? prefix + " " + cellphone : "";
    let mappedValues: T = {} as T;
    if (hasInitialValues) {
      const restWithoutNonEditableFields = Object.fromEntries(
        Object.entries(rest).filter(
          ([key]) => !nonEditableFields.includes(key as any)
        )
      );
      mappedValues = {
        ...restWithoutNonEditableFields,
        cellphone: mappedCellphone,
      } as T;
    } else {
      mappedValues = {
        ...rest,
        cellphone: mappedCellphone,
      } as T;
    }
    if (props.onFinish) {
      await props.onFinish(mappedValues);
    }
  };

  return (
    <FormWrapper
      formName={"newVendor"}
      onFinish={handleFinish}
      initialValues={
        hasInitialValues
          ? parseInitialValues(props.initialValues)
          : {
              prefix: "57",
            }
      }
      requiredMark={true}
      loading={props.loading}
      preserveDataInCache={!hasInitialValues}
    >
      {(formInstance) => (
        <Row gutter={[32, 24]}>
          {/* Columna izquierda - Información personal */}
          <Col xs={24} lg={12}>
            <Divider>Información personal</Divider>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="internalCode"
                  label="Código interno"
                  tooltip="Escriba el código interno de la fundación Maleua"
                  rules={[{ required: true }, { max: 100 }]}
                >
                  <Input
                    placeholder="Ingrese el código interno"
                    disabled={hasInitialValues}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="fullName"
                  label="Nombre completo"
                  rules={[{ required: true }, { max: 255 }]}
                >
                  <Input
                    placeholder="Ingrese el nombre completo"
                    disabled={hasInitialValues}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="identificationType"
                  label="Tipo de identificación"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Radio.Group
                    options={IdentificationOptions.map((e) => ({
                      value: e,
                      label: e,
                    }))}
                    disabled={hasInitialValues}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="identification"
                  label="Número de identidad"
                  tooltip="Escriba el número de identidad sin puntos ni espacios"
                  rules={[
                    {
                      pattern: /^[0-9]+$/,
                      message:
                        "El número de identidad solo puede contener números",
                    },
                    {
                      required: true,
                    },
                    {
                      max: 100,
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese el número de identidad"
                    disabled={hasInitialValues}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={24}>
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
                    {
                      max: 150,
                    },
                  ]}
                >
                  <Input
                    placeholder="Ingrese el correo electrónico"
                    disabled={hasInitialValues}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="cellphone"
                  label="Teléfono celular"
                  tooltip="Escriba el número de celular sin puntos ni espacios"
                  rules={[
                    { required: true },
                    {
                      pattern: /^[0-9]+$/,
                      message: "El teléfono solo puede contener números",
                    },
                    {
                      max: 20,
                    },
                  ]}
                >
                  <Input
                    addonBefore={
                      <Form.Item
                        name="prefix"
                        rules={[{ required: true }]}
                        noStyle
                      >
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
                              width: 150,
                            },
                          }}
                        />
                      </Form.Item>
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Dirección"
                  rules={[{ required: true }, { max: 255 }]}
                >
                  <Input placeholder="Ingrese la dirección completa" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="age"
                  label="Edad"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      max: 120,
                    },
                    {
                      type: "number",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label="Género"
                  rules={[{ type: "enum", enum: Object.values(VendorGenders) }]}
                >
                  <Radio.Group
                    options={VendorGenders.map((e) => {
                      return {label: GENDER_LABELS[e], value: e};
                    })}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={"bio"} label="Biografía" rules={[]}>
                  <Input.TextArea
                    placeholder="Escriba una breve biografía"
                    rows={3}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={"ethnicity"}
                  label="Pertenencia étnica"
                  rules={[]}
                >
                  <Radio.Group
                    options={EthnicityOptions.map((e) => {
                      return e;
                    })}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* Columna derecha - Información financiera */}
          <Col xs={24} lg={12}>
            <Divider>Información financiera</Divider>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name={"commercialRegistry"}
                  label="Registro comercial"
                  rules={[{ max: 255 }]}
                >
                  <Input
                    placeholder="Ingrese el registro comercial"
                    disabled={hasInitialValues}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={"rut"} label="RUT" rules={[{ max: 255 }]}>
                  <Input
                    placeholder="Ingrese el RUT"
                    disabled={hasInitialValues}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={["bankAccount", "entity"]}
                  label="Banco"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const number = getFieldValue(["bankAccount", "number"]);
                        const type = getFieldValue(["bankAccount", "type"]);
                        if ((number || type) && !value) {
                          return Promise.reject(
                            "Campo requerido si otros campos bancarios están llenos"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Ingrese el nombre del banco" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["bankAccount", "number"]}
                  label="Número de cuenta"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const entity = getFieldValue(["bankAccount", "entity"]);
                        const type = getFieldValue(["bankAccount", "type"]);
                        if ((entity || type) && !value) {
                          return Promise.reject(
                            "Campo requerido si otros campos bancarios están llenos"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Ingrese el número de cuenta" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name={["bankAccount", "type"]}
                  label="Tipo de cuenta"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const entity = getFieldValue(["bankAccount", "entity"]);
                        const number = getFieldValue(["bankAccount", "number"]);
                        if ((entity || number) && !value) {
                          return Promise.reject(
                            "Campo requerido si otros campos bancarios están llenos"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <CustomSelectWithInput
                    selectProps={{
                      options: [
                        {
                          value: "Ahorros",
                        },
                        {
                          value: "Corriente",
                        },
                      ],
                      allowClear: true,
                    }}
                    inputProps={{
                      placeholder: "Escriba...",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </FormWrapper>
  );
};

export default FormElement;
