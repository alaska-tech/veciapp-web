import useAuthAction from "@/actions/auth.action";
import { useBranchAction } from "@/actions/branch.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
  const auth = useAuthAction();
  const user = auth.userSession;
  const vendorId = user.data?.foreignPersonId || "";

  return (
    <Space direction="vertical">
      <NewFormDynamic
        onFinish={async (values) => {
          await create.mutateAsync({ body: values, vendorId: vendorId });
        }}
        loading={create.isPending}
        vendorId={vendorId}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
