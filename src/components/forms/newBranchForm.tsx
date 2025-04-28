import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
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
import dynamic from "next/dynamic";

const columnMinWidth = "220px";
const columnMaxWidth = "400px";
const { Option } = Select;

const NewLocationPicker = dynamic(
  () => import("@/components/pure/LocationPicker"),
  { ssr: false }
);

export const FormElement = (props: { onSubmit?: any }) => {
  const onFinish = async (values: any) => {
    if (props.onSubmit) {
      props.onSubmit(values);
    }
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
      formName={"newBranch"}
      onSubmit={onFinish}
      initialValues={{
        prefix: "57",
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
                addonBefore={prefixSelector(formInstance)}
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
                addonBefore={prefixSelector(formInstance)}
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
              name={["location", "lat"]}
              label="Ubicación"
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
