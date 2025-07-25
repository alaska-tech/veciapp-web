import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Space } from "antd";
import React, { ReactElement } from "react";
import FormElement from "@/components/forms/newVendorForm"

const Index = () => {
  const vendorActions = useVendorAction();
  const createVendor = vendorActions.createVendor();
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      <FormElement
        onFinish={async (values) => {
          await createVendor.mutateAsync({ body: values });
        }}
        loading={createVendor.isPending}
      />
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
