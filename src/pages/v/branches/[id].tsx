import { useBranchAction } from "@/actions/branch.action";
import { useCustomerAction } from "@/actions/customer.action";
import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateChangeRequestInfoModal from "@/components/pure/CreateChangeRequestInfoModal";
import { LoadingOutlined } from "@ant-design/icons";
import { Result, Button, Space, App, Form } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newBranchForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  const router = useRouter();
  const { modal } = App.useApp();
  const { id } = router.query;
  const actions = useBranchAction();
  const queryResult = actions.getBranchById(id as string);
  const update = actions.updateBranch({
    onSuccess: (data, variables, context) => {
      modal.success({
        title: "Solicitud de cambios registrada exitosamente",
        content: `Los cambios en la sucursal se han registrado y están pendientes de aprobación por el administrador.`,
        okText: "Entendido",
        centered: true,
      });
    },
  });
  const [showChangeRequestModal, closeChangeRequestModal] =
    CreateChangeRequestInfoModal();

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
      <NewFormDynamic
        onFinish={async (values) => {
          showChangeRequestModal({
            onOk: () => {
              return update.mutateAsync({ body: values, id: id as string });
            },
          });
        }}
        loading={update.isPending}
        initialValues={queryResult.data || ({} as any)}
        vendorId={queryResult.data?.vendorId || ""}
        onSuccess={() => {}}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
