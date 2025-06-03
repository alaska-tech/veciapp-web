import { useBranchAction } from "@/actions/branch.action";
import { useProductServiceAction } from "@/actions/productservice.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newProductServiceForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  const actions = useProductServiceAction();
  const create = actions.createProductService()
  const router = useRouter()
  const {id} = router.query
  return (
    <Space direction="vertical">
      <GoBackButton />
      <NewFormDynamic
        onFinish={async (values) => {
          await create.mutateAsync({ body: values, vendorId: values.vendorId });
        }}
        loading={create.isPending}
        branchId={id as string||""}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
