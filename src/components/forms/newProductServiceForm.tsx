import {
  Form,
  GetProp,
  Input,
  InputNumber,
  Radio,
  Select,
  Upload,
  UploadFile,
  UploadProps,
  Image,
} from "antd";
import React, { useState } from "react";
import { ProductService } from "@models";
import FormWrapper from "./formWrapper";
import { getUserInfo } from "@/actions/localStorage.actions";
import { useBranchAction } from "@/actions/branch.action";
import { PlusOutlined } from "@ant-design/icons";

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
  return { ...values };
}
const MAX_NUMBER_OF_PHOTOS = 8 as const;
export const FormElement = <T extends productServiceWithAuxProps>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
  branchId: string;
}) => {
  const hasInitialValues: boolean = !!props.initialValues;
  const user = getUserInfo();
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
    const { ...rest } = values;
    const mappedValues = {
      ...rest,
    } as T;
    if (props.onFinish) {
      await props.onFinish(mappedValues);
    }
  };

  return (
    <FormWrapper
      formName={"newProductService"}
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
      routeTo={
        user?.role === "admin"
          ? "/a/branches"
          : user?.role === "vendor"
          ? "/v/branches"
          : undefined
      }
      loading={props.loading}
      preserveDataInCache={!hasInitialValues}
      highligthOnChange={hasInitialValues}
    >
      {(formInstance) => (
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
              options={[
                {
                  label: "Cosmetica",
                  value: "cosmetics",
                },
                { label: "Comida", value: "food" },
                { label: "Belleza y estetica", value: "beauty" },
                { label: "Confecciones", value: "confections" },
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
          <Form.Item>
            <Upload
              action={`https://veciapp-backend.onrender.com/api/v1/productservice/upload-images/${props.branchId}`}
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
          </Form.Item>
        </div>
      )}
    </FormWrapper>
  );
};
export default FormElement;
