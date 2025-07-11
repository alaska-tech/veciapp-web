import { useCustomerAction } from "@/actions/customer.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import React, { ReactElement } from "react";
import FormElement from "@/components/forms/newUserForm"

const Index = () => {
  const actions = useCustomerAction();
  const create = actions.createCustomer();
  return (
    <Space direction="vertical">
      <GoBackButton />
      <FormElement
        onFinish={async (values) => {
          await create.mutateAsync({ body: values });
        }}
        loading={create.isPending}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
