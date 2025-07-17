import { Divider, Form, Input, InputNumber, Radio } from "antd";
import React from "react";
import { Vendor, VendorGenders } from "@models";
import FormWrapper from "./formWrapper";
import CustomSelectWithInput from "../pure/CustomSelectWithInput";

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
                {
                  max: 100,
                },
              ]}
            >
              <Input disabled={hasInitialValues} />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Nombre completo"
              rules={[
                {
                  required: true,
                },
                {
                  max: 255,
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
                {
                  max: 100,
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
                {
                  max: 150,
                },
              ]}
            >
              <Input disabled={hasInitialValues} />
            </Form.Item>
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
            <Form.Item
              name="address"
              label="Dirección"
              rules={[
                {
                  required: true,
                },
                {
                  max: 255,
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
                  type: "number",
                  min: 0,
                  max: 120,
                },
                {
                  type: "number",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Género"
              rules={[{ type: "enum", enum: Object.values(VendorGenders) }]}
            >
              <Radio.Group
                options={[
                  { value: "M", label: "Hombre" },
                  { value: "F", label: "Mujer" },
                  { value: "O", label: "Otro" },
                ]}
              />
            </Form.Item>
            <Form.Item name={"bio"} label="Biografía" rules={[]}>
              <Input.TextArea />
            </Form.Item>
          </div>
          <div style={{ flex: `1 1 ${columnMinWidth}` }}>
            <Divider>Información financiera</Divider>
            <Form.Item
              name={"commercialRegistry"}
              label="Registro comercial"
              rules={[
                {
                  max: 255,
                },
              ]}
            >
              <Input disabled={hasInitialValues} />
            </Form.Item>
            <Form.Item
              name={"rut"}
              label="RUT"
              rules={[
                {
                  max: 255,
                },
              ]}
            >
              <Input disabled={hasInitialValues} />
            </Form.Item>
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
              <Input />
            </Form.Item>
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
              <Input />
            </Form.Item>
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
          </div>
        </div>
      )}
    </FormWrapper>
  );
};

export default FormElement;
