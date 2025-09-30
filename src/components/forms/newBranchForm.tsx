import { Card, Divider, Form, Input, Radio, Select, TimePicker } from "antd";
import React from "react";
import FormWrapper from "./formWrapper";
import dynamic from "next/dynamic";
import CustomSelectWithInput from "../pure/CustomSelectWithInput";
import {
  Branch,
  BranchBusiness,
  weekDay,
  WEEKDAY_LABEL,
} from "@/constants/models";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { SANTA_MARTA_LOCATION_OBJECT } from "@/components/pure/LocationPicker";
import { BRANCH_TYPE_LABELS } from "@/constants/labels";

dayjs.extend(customParseFormat);

const columnMinWidth = "320px";
const columnMaxWidth = "800px";

const NewLocationPicker = dynamic(
  () => import("@/components/pure/LocationPicker"),
  { ssr: false }
);

const TIME_PICKER_FORMAT = "HH:mm";

function parseInitialValues(values: Branch) {
  if (!values) return {} as Branch;

  const { phone, managerPhone, location, operatingHours, ...rest } = values;

  // Parse phone numbers (con valores por defecto)
  const [cellphonePrefix = "57", cellphone = ""] = (phone || "").split(" ");
  const [managerPhonePrefix = "57", managerPhoneNum = ""] = (managerPhone || "").split(" ");

  // Parse operating hours
  const parsedOperatingHours = Object.entries(operatingHours || {}).reduce(
    (acc, [key, value]: [string, any]) => ({
      ...acc,
      [key]: value
        ? [
          dayjs(value[0], TIME_PICKER_FORMAT),
          dayjs(value[1], TIME_PICKER_FORMAT),
        ]
        : null,
    }),
    {}
  );

  // Parse location
  const parsedLocation = location?.coordinates
    ? {
      lat: location.coordinates[1],
      lng: location.coordinates[0],
    }
    : SANTA_MARTA_LOCATION_OBJECT;

  return {
    ...rest,
    cellphone,
    cellphonePrefix,
    managerPhone: managerPhoneNum,
    managerPhonePrefix,
    location: parsedLocation,
    operatingHours: parsedOperatingHours,
  };
}

const nonEditableFields = ["vendorId", "rank", "state"] as const;

export const FormElement = <T extends Branch>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
  vendorId: string;
}) => {
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

    let mappedRest;
    if (hasInitialValues) {
      mappedRest = Object.fromEntries(
        Object.entries(rest).filter(
          ([key]) => !nonEditableFields.includes(key as any)
        )
      );
    } else {
      mappedRest = { ...rest };
    }

    const mappedOperatingHours = Object.entries(operatingHours || {}).reduce(
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
        coordinates: [location.lng, location.lat],
      },
      vendorId: props.vendorId,
      operatingHours: mappedOperatingHours,
      ...mappedRest,
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
      loading={props.loading}
      preserveDataInCache={false}
      highligthOnChange={false}
      initialValues={
        hasInitialValues
          ? parseInitialValues(props.initialValues || ({} as Branch))
          : {
            managerPhonePrefix: "57",
            cellphonePrefix: "57",
            location: SANTA_MARTA_LOCATION_OBJECT,
          }
      }
    >
      {(formInstance, setAsTouched) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          <Card style={{ borderRadius: "12px", overflow: "hidden" }}>
            {/* INFORMACIÓN GENERAL */}
            <div>
              <Divider style={{ textAlign: 'start' }}>Información general</Divider>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {/* Columna izquierda */}
                <div style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}>
                  <Form.Item
                    name="name"
                    label="Nombre de la tienda"
                    rules={[{ required: true }]}
                  >
                    <Input disabled={hasInitialValues} />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Dirección completa"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Ubicación"
                    name={"location"}
                    rules={[{ required: true }]}
                  >
                    <NewLocationPicker
                      initialPosition={
                        hasInitialValues && props.initialValues?.location?.coordinates
                          ? {
                            lat: props.initialValues.location.coordinates[1],
                            lng: props.initialValues.location.coordinates[0],
                          }
                          : undefined
                      }
                      afterChange={setAsTouched}
                    />
                  </Form.Item>
                </div>

                {/* Columna derecha */}
                <div style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}>
                  <Form.Item
                    name={"businessType"}
                    label="Tipo de negocio"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group
                      options={BranchBusiness.map((business) => ({
                        value: business,
                        label: BRANCH_TYPE_LABELS[business] || business,
                      }))}
                      disabled={hasInitialValues}
                    />
                  </Form.Item>

                  <Form.Item
                    name={"description"}
                    label="Descripción"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* INFORMACIÓN OPERACIONAL */}
            <div>
              <Divider>Información operacional</Divider>

              {/* Fila horizontal: Métodos de pago | Recogida y Envío */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* Columna 1: Métodos de pago */}
                <Form.Item
                  name="availablePaymentMethods"
                  label="Métodos de pago disponibles"
                  rules={[{ required: true }]}
                  style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}
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

                {/* Columna 2: Recogida y Envío juntos */}
                <div style={{ 
                  flex: `1 1 ${columnMinWidth}`, 
                  maxWidth: columnMaxWidth,
                  display: "flex",
                  flexDirection: "row",
                  gap: "16px"
                }}>
                  <Form.Item
                    name="isPickupAvailable"
                    label="Recogida en tienda disponible"
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0 }}
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
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Radio.Group
                      options={[
                        { label: "Sí", value: true },
                        { label: "No", value: false },
                      ]}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Horarios en fila horizontal */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {weekDay.map((day: string) => {
                  return (
                    <Form.Item
                      name={["operatingHours", day]}
                      label={WEEKDAY_LABEL[day as (typeof weekDay)[number]]}
                      key={day}
                      style={{ flex: `1 1 150px`, minWidth: "150px" }}
                    >
                      <TimePicker.RangePicker
                        format={TIME_PICKER_FORMAT}
                        minuteStep={10}
                        onCalendarChange={() => setAsTouched()}
                      />
                    </Form.Item>
                  );
                })}
              </div>
            </div>

            {/* INFORMACIÓN DEL ENCARGADO */}
            <div style={{ maxWidth: columnMaxWidth }}>
              <Divider>Información del encargado</Divider>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px"
              }}>
                <div style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}>
                  <Form.Item
                    name="managerName"
                    label="Nombre del encargado"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                
                <div style={{ flex: `1 1 ${columnMinWidth}`, maxWidth: columnMaxWidth }}>
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
                              options: [{ value: "57", label: "+57" }],
                              style: { width: 75 },
                              popupMatchSelectWidth: false,
                            }}
                            inputProps={{
                              placeholder: "Escriba...",
                              style: { width: 65 },
                            }}
                          />
                        </Form.Item>
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </FormWrapper>
  );
};