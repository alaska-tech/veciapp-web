import { useProductServiceAction } from "@/actions/productservice.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import React, { ReactElement } from "react";
import Form from "@/components/forms/newProductServiceForm";

const Index = () => {
  const actions = useProductServiceAction();
  const create = actions.createProductService();
  return (
    <Space direction="vertical">
      <GoBackButton />
      <Form
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
  return <DashboardLayout> {page}</DashboardLayout>;
};
