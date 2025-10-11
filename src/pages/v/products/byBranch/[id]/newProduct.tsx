import useAuthAction from "@/actions/auth.action";
import { useProductServiceAction } from "@/actions/productservice.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateChangeRequestInfoModal from "@/components/pure/CreateChangeRequestInfoModal";
import { App, Space, Form } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newProductServiceForm").then(
      (mod) => mod.FormElement
    ),
  { ssr: false }
);

const Index = () => {
  const actions = useProductServiceAction();
  const { modal } = App.useApp();
  const create = actions.createProductService({
    onSuccess: (data, variables, context) => {
      modal.success({
        title: "Solicitud de cambios registrada exitosamente",
        content: `Los cambios se han registrado y están pendientes de aprobación por el administrador.`,
        okText: "Entendido",
        centered: true,
      });
    },
  });
  const [showChangeRequestModal, closeChangeRequestModal] =
    CreateChangeRequestInfoModal();
  const router = useRouter();
  const { id } = router.query;
  const authActions = useAuthAction();
  const user = authActions.userSession;
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
      <NewFormDynamic
        onFinish={async (values) => {
          showChangeRequestModal({
            onOk: () => {
              return create.mutateAsync({
                body: values,
                vendorId: user.data?.foreignPersonId ?? "",
                branchId: (id as string) || "",
              });
            },
          });
        }}
        loading={create.isPending}
        onSuccess={()=>{}}
      />
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
