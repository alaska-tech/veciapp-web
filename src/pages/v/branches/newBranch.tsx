import useAuthAction from "@/actions/auth.action";
import { useBranchAction } from "@/actions/branch.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateChangeRequestInfoModal from "@/components/pure/CreateChangeRequestInfoModal";
import { App, Space } from "antd";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newBranchForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  const actions = useBranchAction();
  const { modal } = App.useApp();
  const create = actions.createBranch({
    onSuccess: (data, variables, context) => {
      modal.success({
        title: "Solicitud de cambios registrada exitosamente",
        content: `Los cambios se han registrado y están pendientes de aprobación por el administrador.`,
        okText: "Entendido",
        centered: true,
      });
    },
  });
  const auth = useAuthAction();
  const user = auth.userSession;
  const vendorId = user.data?.foreignPersonId || "";
  const [showChangeRequestModal, closeChangeRequestModal] =
    CreateChangeRequestInfoModal();
  return (
    <Space wrap direction="vertical">
      <NewFormDynamic
        onFinish={async (values) => {
          showChangeRequestModal({
            onOk: async () => {
              await create.mutateAsync({ body: values, vendorId: vendorId });
            },
          });
        }}
        loading={create.isPending}
        vendorId={vendorId}
        onSuccess={() => {}}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
