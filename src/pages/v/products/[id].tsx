import useAuthAction from "@/actions/auth.action";
import { useBranchAction } from "@/actions/branch.action";
import { useCustomerAction } from "@/actions/customer.action";
import { useProductServiceAction } from "@/actions/productservice.action";
import { useVendorAction } from "@/actions/vendor.action";
import NewProductServiceForm from "@/components/forms/newProductServiceForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingOutlined } from "@ant-design/icons";
import { Result, Button, Space , Modal } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const actions = useProductServiceAction();
  const queryResult = actions.getProductServiceById(id as string);
  const update = actions.updateProductService();
  const authActions = useAuthAction();
  const user = authActions.userSession;
  if (queryResult.isLoading) {
    return <LoadingOutlined />;
  }
  if (queryResult.isError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Lo siento. Algo salió mal."
        extra={
          <Button
            type="primary"
            onClick={() => {
              queryResult.refetch();
            }}
          >
            Reintentar
          </Button>
        }
      />
    );
  }
  return (
    <Space direction="vertical">
      <NewProductServiceForm
  onFinish={async (values) => {
    try {
      await update.mutateAsync({ body: values, id: id as string });

      // modal personalizado
      Modal.success({
        title: "Producto/Servicio actualizado",
        content: "Sus cambios se guardaron satisfactoriamente. Están pendientes de revisión y aprobación.",
        okText: "Entendido",
        centered: true,
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Hubo un problema al guardar los cambios. Por favor, intente nuevamente.",
        okText: "Cerrar",
        centered: true,
      });
    }
  }}
  loading={update.isPending}
  initialValues={queryResult.data || ({} as any)}
  branchId={queryResult.data?.branchId || ""}
  userId={user.data?.id || ""}
/>
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
