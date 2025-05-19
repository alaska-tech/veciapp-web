import { useBranchAction } from "@/actions/branch.action";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newBranchForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  const actions = useBranchAction();
  const create = actions.createBranch();
  return (
    <Space direction="vertical">
      <GoBackButton />
      <NewFormDynamic
        onFinish={async (values) => {
          await create.mutateAsync({ body: values, vendorId: values.vendorId });
        }}
        loading={create.isPending}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
