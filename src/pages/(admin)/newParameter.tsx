import { useParameterAction } from "@/actions/parameter.action";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newParameterForm").then(
      (mod) => mod.FormElement
    ),
  { ssr: false }
);

const Index = () => {
  const parameterActions = useParameterAction();
  const createParameter = parameterActions.createParameter();
  const router = useRouter();
  return (
    <Space direction="vertical">
      <GoBackButton />
      <NewFormDynamic
        onFinish={async (values) => {
          console.log("Creating parameter:", values);
          try {
            await createParameter.mutateAsync({body: values});
            router.push("/(admin)/configuration");
          } catch (error) {
            console.error("Error creating parameter:", error);
            
          }
        }}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
