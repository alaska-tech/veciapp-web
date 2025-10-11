import useAuthAction from "@/actions/auth.action";
import { useProductServiceAction } from "@/actions/productservice.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { App, Space } from "antd";
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
  const { message } = App.useApp();
  const create = actions.createProductService({
    onSuccess: (data, variables, context) => {
      message.success("Se creó el producto exitosamente");
    },
  });
  const router = useRouter();
  const { id, vendorId } = router.query;
  if (!id || !vendorId) {
    return null;
  }
  return (
    <Space direction="vertical">
      <NewFormDynamic
        onFinish={async (values) => {
          await create.mutateAsync({
            body: values,
            branchId: (id as string) || "",
            vendorId: (vendorId as string) || "",
          });
        }}
        loading={create.isPending}
        branchId={(id as string) || ""}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
