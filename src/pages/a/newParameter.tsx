import { useParameterAction } from "@/actions/parameter.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Space } from "antd";
import React, { ReactElement } from "react";
import FormElement from "@/components/forms/newParameterForm";

const Index = () => {
  const parameterActions = useParameterAction();
  const createParameter = parameterActions.createParameter();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
      <FormElement
        onFinish={async (values) => {
          await createParameter.mutateAsync({ body: values });
        }}
        loading={createParameter.isPending}
      />
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
