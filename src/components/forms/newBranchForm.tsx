import {
  Divider,
  Form,
  Input,
  Radio,
  Select,
} from "antd";
import React from "react";
import FormWrapper from "./formWrapper";
import dynamic from "next/dynamic";
import CustomSelectWithInput from "../pure/CustomSelectWithInput";
import { SANTA_MARTA_LOCATION_OBJECT } from "@/components/pure/LocationPicker";

const columnMinWidth = "220px";
const columnMaxWidth = "400px";

const NewLocationPicker = dynamic(
  () => import("@/components/pure/LocationPicker"),
  { ssr: false }
);

export const FormElement = (props: { onFinish?: any }) => {
  const handleFinish = async (values: any) => {
    const { cellphonePrefix, managerPhonePrefix, ...rest } = values;
    const mappedValues = {
      cellphone: cellphonePrefix + rest.cellphone,
      managerPhone: managerPhonePrefix + rest.managerPhone,
      ...rest,
    };
    if (props.onFinish) {
      await props.onFinish(mappedValues);
    }
  };
  return (
    <FormWrapper
      formName={"newBranch"}
      onFinish={handleFinish}
      initialValues={{
        managerPhonePrefix: "57",
        cellphonePrefix: "57",
        location: SANTA_MARTA_LOCATION_OBJECT,
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
          <div
            style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}
          >
            <Divider>Información general</Divider>
            <Form.Item
              name="name"
              label="Nombre de la tienda"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={"businessType"}
              label="Tipo de negocio"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group options={["Individual", "Empresa"]} />
            </Form.Item>
            <Form.Item
              name={"description"}
              label="Descripción"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </div>
          <div
            style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}
          >
            <Divider>Información operacional</Divider>
            <Form.Item
              name="availablePaymentMethods"
              label="Métodos de pago disponibles"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                mode="multiple"
                options={[
                  { value: "Efectivo" },
                  { value: "Llaves" },
                  { value: "Nequi" },
                  { value: "Daviplata" },
                  { value: "Transfiya" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="isPickupAvailable"
              label="Recogida en tienda disponible"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                options={[
                  { label: "Sí", value: true },
                  { label: "No", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="isDeliveryAvailable"
              label="Envío a domicilio disponible"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                options={[
                  { label: "Sí", value: true },
                  { label: "No", value: false },
                ]}
              />
            </Form.Item>
          </div>
          <div
            style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}
          >
            <Divider>Información del encargado</Divider>
            <Form.Item
              name="managerName"
              label="Nombre del encargado"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="managerPhone"
              label="Teléfono celular del encargado"
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
                  <Form.Item
                    name="managerPhonePrefix"
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
                          width: 65,
                        },
                      }}
                    />
                  </Form.Item>
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
          <div
            style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}
          >
            <Divider>Información de contacto</Divider>
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
                  <Form.Item
                    name="cellphonePrefix"
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
              label="Dirección completa"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ubicación"
              name={"location"}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <NewLocationPicker />
            </Form.Item>
          </div>
        </div>
      )}
    </FormWrapper>
  );
};
