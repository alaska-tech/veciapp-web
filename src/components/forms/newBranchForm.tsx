import { Button, Divider, Form, Input, Radio, Select, TimePicker } from "antd";
import React from "react";
import FormWrapper from "./formWrapper";
import dynamic from "next/dynamic";
import CustomSelectWithInput from "../pure/CustomSelectWithInput";
import { Branch, weekDay, WEEKDAY_LABEL } from "@/constants/models";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const columnMinWidth = "220px";
const columnMaxWidth = "400px";

const NewLocationPicker = dynamic(
  () => import("@/components/pure/LocationPicker"),
  { ssr: false }
);
interface entityWithAuxProps extends Branch {
  prefix: string;
}
const TIME_PICKER_FORMAT = "HH:mm";

export const FormElement = <T extends entityWithAuxProps>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
}) => {
  const router = useRouter();
  const { vendorId } = router.query;
  const hasInitialValues: boolean = !!props.initialValues;
  const mapValues = (values: any) => {
    const {
      cellphonePrefix,
      managerPhonePrefix,
      cellphone,
      managerPhone,
      location,
      operatingHours,
      ...rest
    } = values;
    const mappedOperatingHours = Object.entries(operatingHours).reduce(
      (acc, [key, value]: [string, any]) => ({
        ...acc,
        [key]: value
          ? [
              value[0].format(TIME_PICKER_FORMAT),
              value[1].format(TIME_PICKER_FORMAT),
            ]
          : null,
      }),
      {}
    );
    const mappedValues = {
      phone: cellphonePrefix + " " + cellphone,
      managerPhone: managerPhonePrefix + " " + managerPhone,
      location: {
        type: "Point",
        coordinates: location,
      },
      vendorId,
      operatingHours: mappedOperatingHours,
      ...rest,
    };
    return mappedValues;
  };
  const handleFinish = async (values: any) => {
    const mappedValues = mapValues(values);
    if (props.onFinish) {
      await props.onFinish(mappedValues);
    }
  };
  return (
    <FormWrapper
      formName={"newBranch"}
      onFinish={handleFinish}
      routeTo="/a/branches"
      loading={props.loading}
      preserveDataInCache={false}
      highligthOnChange={hasInitialValues}
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
              <Input disabled={hasInitialValues} />
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
              <Radio.Group
                options={["individual", "empresa"]}
                disabled={hasInitialValues}
              />
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
            {weekDay.map((day: string) => {
              return (
                <Form.Item
                  name={["operatingHours", day]}
                  label={WEEKDAY_LABEL[day as (typeof weekDay)[number]]}
                  key={day}
                >
                  <TimePicker.RangePicker
                    format={TIME_PICKER_FORMAT}
                    minuteStep={10}
                  />
                </Form.Item>
              );
            })}
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
