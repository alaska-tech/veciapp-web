import { useCustomerAction } from "@/actions/customer.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Space } from "antd";
import React, { ReactElement } from "react";
import FormElement from "@/components/forms/newUserForm"

const Index = () => {
  const actions = useCustomerAction();
  const create = actions.createCustomer();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
      <FormElement
        onFinish={async (values) => {
          await create.mutateAsync({ body: values });
        }}
        loading={create.isPending}
      />
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
