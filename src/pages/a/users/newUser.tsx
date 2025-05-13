import DashboardLayout2 from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () => import("@/components/forms/newUserForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  return (
    <Space direction="vertical">
      <GoBackButton />
      <NewFormDynamic />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
