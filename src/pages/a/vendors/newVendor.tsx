import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GoBackButton from "@/components/pure/goBackButton";
import { Space } from "antd";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";
import FormElement from "@/components/forms/newVendorForm"

const Index = () => {
  const vendorActions = useVendorAction();
  const createVendor = vendorActions.createVendor();
  return (
    <Space direction="vertical">
      <FormElement
        onFinish={async (values) => {
          await createVendor.mutateAsync({ body: values });
        }}
        loading={createVendor.isPending}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
