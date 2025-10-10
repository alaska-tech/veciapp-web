import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Result, Space } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newVendorForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const { id } = router.query;
  const vendorActions = useVendorAction();
  const vendorQuery = vendorActions.getVendorById(id as string);
  const updateVendor = vendorActions.updateVendor({
    onSuccess: (data) => {
      const vendor = data.data.data;
      message.success("Veci actualizado exitosamente");
    },
  });
  if (vendorQuery.isLoading) {
    return <LoadingOutlined />;
  }
  if (vendorQuery.isError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Lo siento. Algo salió mal."
        extra={
          <Button
            type="primary"
            onClick={() => {
              vendorQuery.refetch();
            }}
          >
            Reintentar
          </Button>
        }
      />
    );
  }
  return (
    <Space direction="vertical">
      <NewFormDynamic
        onFinish={async (values) => {
          await updateVendor.mutateAsync({ body: values, id: id as string });
        }}
        loading={updateVendor.isPending}
        initialValues={vendorQuery.data || ({} as any)}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton={true}> {page}</DashboardLayout>;
};
