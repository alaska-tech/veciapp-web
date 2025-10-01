import useAuthAction from "@/actions/auth.action";
import { useBranchAction } from "@/actions/branch.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Space } from "antd";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";

import { mockChangesApi } from "@/services/mockChangesApi"; // Import the mockChangesApi for demonstration

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
          await mockChangesApi.createChange({
            vendorId,
            entityType: "store",
            action: "create",
            payload: values,
          });
          alert("Tu solicitud fue enviada para revisión ✅");
        }}
        loading={false}
        vendorId={vendorId}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
