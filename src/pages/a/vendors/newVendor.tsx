import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Modal, Space, Typography } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import FormElement from "@/components/forms/newVendorForm";

interface ReactivationState {
  open: boolean;
  vendorId: string;
  vendorName: string;
  formValues: any;
}

const Index = () => {
  const router = useRouter();
  const vendorActions = useVendorAction();
  const createVendor = vendorActions.createVendor();
  const reactivateVendor = vendorActions.reactivateVendor();
  const [reactivation, setReactivation] = useState<ReactivationState>({
    open: false,
    vendorId: "",
    vendorName: "",
    formValues: null,
  });

  const handleFinish = async (values: any) => {
    try {
      await createVendor.mutateAsync({ body: values });
    } catch (error: any) {
      const errorData = error?.response?.data?.error;
      if (errorData?.code === "VENDOR_REACTIVATION_REQUIRED") {
        setReactivation({
          open: true,
          vendorId: errorData.vendorId,
          vendorName: errorData.vendorName,
          formValues: values,
        });
      }
      throw error;
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateVendor.mutateAsync({
        id: reactivation.vendorId,
        body: reactivation.formValues,
      });
      setReactivation((prev) => ({ ...prev, open: false }));
      router.push("/a/vendors");
    } catch {}
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
      <FormElement
        onFinish={handleFinish}
        onSuccess={() => router.push("/a/vendors")}
        loading={createVendor.isPending}
      />

      <Modal
        open={reactivation.open}
        title="Veci encontrado desactivado"
        onCancel={() => setReactivation((prev) => ({ ...prev, open: false }))}
        footer={
          <Space>
            <Button onClick={() => setReactivation((prev) => ({ ...prev, open: false }))}>
              Cancelar
            </Button>
            <Button
              type="primary"
              loading={reactivateVendor.isPending}
              onClick={handleReactivate}
            >
              Reactivar veci
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Text>
            El número de identificación ingresado pertenece a un veci que fue desactivado anteriormente:
          </Typography.Text>
          <Typography.Text strong style={{ fontSize: 16 }}>
            {reactivation.vendorName}
          </Typography.Text>
          <Typography.Text type="secondary">
            ¿Deseas reactivar su cuenta con los datos del formulario? Se le enviará un correo para que confirme su email y active su cuenta.
          </Typography.Text>
        </Space>
      </Modal>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton>{page}</DashboardLayout>;
};
