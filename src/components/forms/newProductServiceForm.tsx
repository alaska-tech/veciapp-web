import {
  Form,
  Input,
  InputNumber,
  Radio,
  TimePicker,
  Row,
  Col,
} from "antd";
import React from "react";
import { ProductService, weekDay, WEEKDAY_LABEL } from "@models";
import FormWrapper from "./formWrapper";
import { getUserInfo } from "@/actions/localStorage.actions";
import dayjs from "dayjs";

type productServiceWithAuxProps = ProductService;


function parseInitialValues(values: ProductService) {
  const { serviceScheduling, ...rest } = values;

  const parsedAvailableHours = Object.entries(
    serviceScheduling?.availableHours || {}
  ).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value
        ? [
            dayjs(value.open, TIME_PICKER_FORMAT),
            dayjs(value.close, TIME_PICKER_FORMAT),
          ]
        : null,
    }),
    {}
  );
  return {
    serviceScheduling: {
      ...serviceScheduling,
      availableHours: parsedAvailableHours,
    },
    ...rest,
  };
}
const TIME_PICKER_FORMAT = "HH:mm";

export const FormElement = <T extends productServiceWithAuxProps>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
  branchId: string;
  userId: string;
}) => {
  const hasInitialValues: boolean = !!props.initialValues;
  const [formInstance] = Form.useForm();
  const type = Form.useWatch("type", formInstance);

  const handleFinish = async (values: T) => {
    const { serviceScheduling, ...rest } = values;
    const mappedAvailableHours = Object.entries(
      serviceScheduling?.availableHours || {}
    ).reduce(
      (acc, [key, value]: [string, any]) => ({
        ...acc,
        [key]: {
          open: !!value ? value[0].format(TIME_PICKER_FORMAT) : "00:00",
          close: !!value ? value[1].format(TIME_PICKER_FORMAT) : "00:00",
          isOpen:
            !!value &&
            value[0].format(TIME_PICKER_FORMAT) !==
              value[1].format(TIME_PICKER_FORMAT),
        },
      }),
      {}
    );
    const mappedValues = {
      ...rest,
      serviceScheduling: {
        ...serviceScheduling,
        availableHours: mappedAvailableHours,
      },
      mainImage: "https://url-imagen.com/imagen.jpg",
    } as T;
    if (props.onFinish) {
      await props.onFinish(mappedValues);
    }
  };

  return (
    <FormWrapper
      formName={"newProductService"}
      form={formInstance}
      onFinish={handleFinish}
      initialValues={
        hasInitialValues
          ? parseInitialValues(props.initialValues || ({} as ProductService))
          : {
              prefix: "57",
            }
      }
      requiredMark={false}
      loading={props.loading}
      preserveDataInCache={!hasInitialValues}
      highligthOnChange={hasInitialValues}
    >
      {(formInstance, setAsTouched) => (
        <Row gutter={[24, 16]}>
          {/* Primera fila - Nombre del producto (ancho completo) */}
          <Col span={24}>
            <Form.Item
              name="name"
              label="Nombre del producto"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={hasInitialValues} />
            </Form.Item>
          </Col>

          {/* Segunda fila - Categoría y Tipo (mitad cada uno) */}
          <Col xs={24} md={12}>
            <Form.Item
              name="categoryId"
              label="Categoria"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                disabled={hasInitialValues}
                options={[
                  { label: "Confecciones", value: "Confecciones" },
                  { label: "Belleza", value: "Belleza" },
                  { label: "Gastronomía", value: "Gastronomía" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="type"
              label="Tipo"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                disabled={hasInitialValues}
                options={[
                  {
                    label: "Producto",
                    value: "product",
                  },
                  { label: "Servicio", value: "service" },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Tercera fila - Descripciones (ancho completo) */}
          <Col span={24}>
            <Form.Item
              name="description"
              label="Descripcion"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="shortDescription"
              label="Descripcion corta"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>

          {/* Campos específicos de servicio */}
          {type === "service" && (
            <>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Se requiere asistencia de un profesional?"
                  name={["serviceScheduling", "professionalRequired"]}
                >
                  <Radio.Group>
                    <Radio value={true}>Si</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Personas por servicio"
                  name={["serviceScheduling", "attentionLimitPerSlot"]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              {/* Horarios de la semana - cada día en su propia fila */}
              {weekDay.map((day: string) => {
                return (
                  <Col span={24} key={day}>
                    <Form.Item
                      name={["serviceScheduling", "availableHours", day]}
                      label={WEEKDAY_LABEL[day as (typeof weekDay)[number]]}
                    >
                      <TimePicker.RangePicker
                        format={TIME_PICKER_FORMAT}
                        minuteStep={10}
                        onCalendarChange={setAsTouched}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                );
              })}
            </>
          )}

          {/* Última fila - Precio y Cantidad (mitad cada uno) */}
          <Col xs={24} md={12}>
            <Form.Item
              name="price"
              label="Precio"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="inventory"
              label="Cantidad disponible"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {/* <Form.Item>
            <Upload
              action={async (file)=>{
                 const response = await upload.mutateAsync({ body: file as FileType })
                console.log(JSON.stringify(response.data)) 
                return "https://url-imagen.com/imagen.jpg"
              }}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= MAX_NUMBER_OF_PHOTOS ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
                alt=""
              />
            )}
          </Form.Item> */}
        </Row>
      )}
    </FormWrapper>
  );
};
export default FormElement;

