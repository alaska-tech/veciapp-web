import { useBranchAction } from "@/actions/branch.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newBranchForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  const actions = useBranchAction();
  const create = actions.createBranch();
  const router = useRouter();
  const { id : vendorId, } = router.query;
  return (
    <Space direction="vertical">
      
      <NewFormDynamic
        onFinish={async (values) => {
          await create.mutateAsync({
            body: values,
            vendorId: vendorId as string,
          });
        }}
        loading={create.isPending}
        vendorId={vendorId as string}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
