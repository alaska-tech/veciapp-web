import { Card, Divider, Form, FormInstance, Input, Radio, Select, TimePicker } from "antd";
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
  const [managerPhonePrefix = "57", managerPhoneNum = ""] = (
    managerPhone || ""
  ).split(" ");

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
  /** Si es true, oculta automáticamente los campos vacíos */
  autoHideEmptyFields?: boolean;
}) => {
  const hasInitialValues: boolean = !!props.initialValues;
  // Usamos un estado para mantener la visibilidad constante después de la evaluación inicial
  const [fieldVisibility, setFieldVisibility] = React.useState<Record<string, boolean>>({});
  
  // Inicializar la visibilidad de los campos al cargar el componente
  React.useEffect(() => {
    if (props.autoHideEmptyFields) {
      // Lista de todos los campos que queremos evaluar
      const fieldsToCheck = [
        "name", "address", "location", "businessType", "description",
        "availablePaymentMethods", "isPickupAvailable", "isDeliveryAvailable",
        "managerName", "managerPhone",
        ...weekDay.map(day => ["operatingHours", day])
      ];
      
      // Evaluamos cada campo y guardamos su visibilidad
      const initialVisibility: Record<string, boolean> = {};
      
      fieldsToCheck.forEach(field => {
        const fieldKey = Array.isArray(field) ? field.join('.') : field;
        const isEmpty = isFieldEmpty(null as any, field);
        initialVisibility[fieldKey] = isEmpty;
      });
      
      setFieldVisibility(initialVisibility);
    }
  }, [props.initialValues, props.autoHideEmptyFields]);

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

  // Función para verificar si un campo está vacío basado en los valores iniciales parseados
  const isFieldEmpty = (form: FormInstance<any>, fieldName: string | string[]) => {
    if (!props.autoHideEmptyFields) return false;

    // Convertimos el nombre del campo a una cadena para usarlo como clave en el objeto de visibilidad
    const fieldKey = Array.isArray(fieldName) ? fieldName.join('.') : fieldName;
    
    // Si ya tenemos la visibilidad calculada para este campo, la devolvemos
    if (fieldVisibility[fieldKey] !== undefined) {
      return fieldVisibility[fieldKey];
    }

    // Obtenemos los valores iniciales parseados
    const initialValues = hasInitialValues
      ? parseInitialValues(props.initialValues || ({} as Branch))
      : {
          managerPhonePrefix: "57",
          cellphonePrefix: "57",
          location: SANTA_MARTA_LOCATION_OBJECT,
        };
    
    // Obtenemos el valor del campo desde los valores iniciales
    let value;
    if (Array.isArray(fieldName)) {
      // Para campos anidados como ["operatingHours", "monday"]
      value = fieldName.reduce((obj, key) => obj && obj[key], initialValues as any);
    } else {
      value = (initialValues as any)[fieldName];
    }

    // Verificar diferentes tipos de valores vacíos
    let isEmpty = false;
    
    if (value === undefined || value === null || value === "") isEmpty = true;
    else if (Array.isArray(value) && value.length === 0) isEmpty = true;
    else if (typeof value === "object" && value !== null) {
      // Para objetos especiales como location, verificamos si tiene las propiedades esperadas
      if (fieldName === "location" && value.lat && value.lng) {
        // Si es la ubicación por defecto, consideramos que está vacío
        if (value.lat === SANTA_MARTA_LOCATION_OBJECT.lat && 
            value.lng === SANTA_MARTA_LOCATION_OBJECT.lng) {
          isEmpty = !hasInitialValues; // Solo lo consideramos vacío si no hay valores iniciales
        } else {
          isEmpty = false;
        }
      } else {
        // Para otros objetos, verificamos si está vacío
        isEmpty = Object.keys(value).length === 0;
      }
    }
    
    // Guardamos el resultado en el estado para mantenerlo constante
    setFieldVisibility(prev => ({
      ...prev,
      [fieldKey]: isEmpty
    }));
    
    return isEmpty;
  };

  return (
    <FormWrapper
      hideSubmitButton={props.autoHideEmptyFields}
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
              <Divider style={{ textAlign: "start" }}>
                Información general
              </Divider>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {/* Columna izquierda */}
                <div
                  style={{
                    flex: `1 1 ${columnMinWidth}`,
                    maxWidth: columnMaxWidth,
                  }}
                >
                  <Form.Item
                    name="name"
                    label="Nombre de la tienda"
                    rules={[{ required: true }]}
                    style={{
                      display: isFieldEmpty(formInstance, "name")
                        ? "none"
                        : "inherit",
                    }}
                  >
                    <Input disabled={hasInitialValues} />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Dirección completa"
                    rules={[{ required: true }]}
                    style={{
                      display: isFieldEmpty(formInstance, "address")
                        ? "none"
                        : "inherit",
                    }}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Ubicación"
                    name={"location"}
                    rules={[{ required: true }]}
                    style={{
                      display: isFieldEmpty(formInstance, "location")
                        ? "none"
                        : "inherit",
                    }}
                  >
                    <NewLocationPicker
                      initialPosition={
                        hasInitialValues &&
                        props.initialValues?.location?.coordinates
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
                <div
                  style={{
                    flex: `1 1 ${columnMinWidth}`,
                    maxWidth: columnMaxWidth,
                  }}
                >
                  <Form.Item
                    name={"businessType"}
                    label="Tipo de negocio"
                    rules={[{ required: true }]}
                    style={{
                      display: isFieldEmpty(formInstance, "businessType")
                        ? "none"
                        : "inherit",
                    }}
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
                    style={{
                      display: isFieldEmpty(formInstance, "description")
                        ? "none"
                        : "inherit",
                    }}
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
                  style={{
                    flex: `1 1 ${columnMinWidth}`,
                    maxWidth: columnMaxWidth,
                    display: isFieldEmpty(
                      formInstance,
                      "availablePaymentMethods"
                    )
                      ? "none"
                      : "inherit",
                  }}
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
                <div
                  style={{
                    flex: `1 1 ${columnMinWidth}`,
                    maxWidth: columnMaxWidth,
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                  }}
                >
                  <Form.Item
                    name="isPickupAvailable"
                    label="Recogida en tienda disponible"
                    rules={[{ required: true }]}
                    style={{
                      marginBottom: 0,
                      display: isFieldEmpty(formInstance, "isPickupAvailable")
                        ? "none"
                        : "inherit",
                    }}
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
                    style={{
                      marginBottom: 0,
                      display: isFieldEmpty(formInstance, "isDeliveryAvailable")
                        ? "none"
                        : "inherit",
                    }}
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
                      style={{
                        flex: `1 1 150px`,
                        minWidth: "150px",
                        display: isFieldEmpty(formInstance, [
                          "operatingHours",
                          day,
                        ])
                          ? "none"
                          : "inherit",
                      }}
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
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    flex: `1 1 ${columnMinWidth}`,
                    maxWidth: columnMaxWidth,
                  }}
                >
                  <Form.Item
                    name="managerName"
                    label="Nombre del encargado"
                    rules={[{ required: true }]}
                    style={{
                      display: isFieldEmpty(formInstance, "managerName")
                        ? "none"
                        : "inherit",
                    }}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div
                  style={{
                    flex: `1 1 ${columnMinWidth}`,
                    maxWidth: columnMaxWidth,
                  }}
                >
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
                    style={{
                      display: isFieldEmpty(formInstance, "managerPhone")
                        ? "none"
                        : "inherit",
                    }}
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
