import DashboardLayout from "@/components/layout/DashboardLayout";
import AsyncButton from "@/components/pure/AsyncButton";
import { apiClient } from "@/services/clients";
import { useMutation } from "@tanstack/react-query";
import { App, Card, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { title } from "process";
import React, { ReactElement } from "react";

const Index = () => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const sendMessageMutation = useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      try {
        const response = await apiClient.post(
          "/push-notifications/send-promotion",
          {
            title,
            body,
          }
        );
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {
      notification.error({
        message: "Error",
        description:
          error.message || "Ha ocurrido un error al enviar los mensajes",
        duration: 0,
      });
    },
    onSuccess(data, variables, context) {
      message.success({
        content: `Los mensajes se han enviado correctamente`,
        duration: 4,
      });
    },
  });
  return (
    <Card>
      <Form form={form} onFinish={sendMessageMutation.mutateAsync} >
        <Form.Item label="Titulo" name="title" rules={[{required:true}]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mensaje" name="body" rules={[{required:true}]}>
          <TextArea rows={4}></TextArea>
        </Form.Item>
        <AsyncButton
          popConfirm={{
            title: "¿Estás seguro de enviar este mensaje a todos los usuarios?",
            okText: "Sí",
            cancelText: "No",
          }}
          loading={sendMessageMutation.isPending}
          onClick={() => {
            form.validateFields().then(() => {
              form.submit();
            });
          }}
        >
          Enviar
        </AsyncButton>
      </Form>
    </Card>
  );
};

export default Index;
Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
