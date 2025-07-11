import { QUERY_KEY_PRODUCTSERVICE } from "@/actions/productservice.action";
import { apiClient } from "@/services/clients";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Upload,
  Button,
  App,
  Space,
} from "antd";

const MAX_NUMBER_OF_PHOTOS = 4 as const;

export const PhotoUploadModal = (props: { productServiceId: string }) => {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Cargar foto</div>
    </button>
  );
  const uploadLogo = async (file: File) => {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await apiClient.post(
      `/productservice/upload-logo/${props.productServiceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  };
  const uploadImages = async (file: File) => {
    const formData = new FormData();
    formData.append("images", file);
    const response = await apiClient.post(
      `/productservice/upload-images/${props.productServiceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  };
  return (
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={() => {
        const modalRef = modal.info({
          title: "Cargar fotos",
          closable: true,
          content: (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography.Title level={5}>Principal</Typography.Title>
              <Upload
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    const url = await uploadLogo(file as File);
                    onSuccess?.({ url });
                    queryClient.invalidateQueries({
                      queryKey: [QUERY_KEY_PRODUCTSERVICE],
                    });
                    message.success("Foto cargada correctamente");
                    modalRef.destroy();
                  } catch (err: any) {
                    onError?.(err);
                  }
                }}
                listType="picture-card"
                beforeUpload={(file) => {
                  if (!file.type.startsWith("image/")) {
                    message.error("El archivo debe ser una imagen.");
                    return false;
                  }
                  return true;
                }}
              >
                {uploadButton}
              </Upload>
              <Typography.Title level={5}>Adicionales</Typography.Title>
              <Upload
                multiple
                maxCount={MAX_NUMBER_OF_PHOTOS}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    const url = await uploadImages(file as File);
                    onSuccess?.({ url });
                    queryClient.invalidateQueries({
                      queryKey: [QUERY_KEY_PRODUCTSERVICE],
                    });
                    message.success("Foto cargada correctamente");
                    modalRef.destroy();
                  } catch (err: any) {
                    onError?.(err);
                  }
                }}
                listType="picture-card"
                beforeUpload={(file) => {
                  if (!file.type.startsWith("image/")) {
                    message.error("El archivo debe ser una imagen.");
                    return false;
                  }
                  return true;
                }}
              >
                {uploadButton}
              </Upload>
            </Space>
          ),
          footer: null,
        });
      }}
    ></Button>
  );
};
