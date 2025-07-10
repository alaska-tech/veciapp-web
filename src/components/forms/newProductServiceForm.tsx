import {
  Form,
  GetProp,
  Input,
  InputNumber,
  Radio,
  TimePicker,
  UploadFile,
  UploadProps,
} from "antd";
import React, { useState } from "react";
import { ProductService, weekDay, WEEKDAY_LABEL } from "@models";
import FormWrapper from "./formWrapper";
import { getUserInfo } from "@/actions/localStorage.actions";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import dayjs from "dayjs";

type productServiceWithAuxProps = ProductService;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
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
const MAX_NUMBER_OF_PHOTOS = 8 as const;
const TIME_PICKER_FORMAT = "HH:mm";

export const FormElement = <T extends productServiceWithAuxProps>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
  branchId: string;
  userId: string;
}) => {
  const hasInitialValues: boolean = !!props.initialValues;
  const user = getUserInfo();
  const [formInstance] = Form.useForm();
  const type = Form.useWatch("type", formInstance);
  //----
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Cargar foto</div>
    </button>
  );
  //----
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
              password: "Vcapp20251",
            }
      }
      requiredMark={false}
      loading={props.loading}
      preserveDataInCache={!hasInitialValues}
      highligthOnChange={hasInitialValues}
    >
      {(formInstance, setAsTouched) => (
        <div>
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
                {
                  label: "Cosmetica",
                  value: "Cosmetica",
                },
                { label: "Comida", value: "Comida" },
                { label: "Belleza y estetica", value: "Belleza y estetica" },
                { label: "Confecciones", value: "Confecciones" },
              ]}
            />
          </Form.Item>
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
          <Form.Item
            name="description"
            label="Descripcion"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="shortDescription"
            label="Descripcion corta"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          {type === "service" && (
            <>
              <Form.Item
                label="Se requiere asistencia de un profesional?"
                name={["serviceScheduling", "professionalRequired"]}
              >
                <Radio.Group>
                  <Radio value={true}>Si</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Personas por servicio"
                name={["serviceScheduling", "attentionLimitPerSlot"]}
              >
                <InputNumber min={1} />
              </Form.Item>
              {weekDay.map((day: string) => {
                return (
                  <Form.Item
                    name={["serviceScheduling", "availableHours", day]}
                    label={WEEKDAY_LABEL[day as (typeof weekDay)[number]]}
                    key={day}
                  >
                    <TimePicker.RangePicker
                      format={TIME_PICKER_FORMAT}
                      minuteStep={10}
                      onCalendarChange={setAsTouched}
                    />
                  </Form.Item>
                );
              })}
            </>
          )}
          <Form.Item
            name="price"
            label="Precio"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="inventory"
            label="Cantidad disponible"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
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
        </div>
      )}
    </FormWrapper>
  );
};
export default FormElement;
