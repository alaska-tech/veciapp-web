import { useCustomerAction } from "@/actions/customer.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingOutlined } from "@ant-design/icons";
import { Result, Button, Space } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () => import("@/components/forms/newUserForm").then((mod) => mod.FormElement),
  { ssr: false }
);

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const actions = useCustomerAction();
  const queryResult = actions.getCustomerById(id as string);
  const update = actions.updateCustomer();
  if (queryResult.isLoading) {
    return <LoadingOutlined />;
  }
  if (queryResult.isError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Lo siento. Algo salió mal."
        extra={
          <Button
            type="primary"
            onClick={() => {
              queryResult.refetch();
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
          await update.mutateAsync({ body: values, id: id as string });
        }}
        loading={update.isPending}
        initialValues={queryResult.data || ({} as any)}
      />
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
