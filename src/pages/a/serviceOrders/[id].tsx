import { useServiceOrderAction } from "@/actions/serviceOrder.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingOutlined } from "@ant-design/icons";
import { Result, Button, Space } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const actions = useServiceOrderAction();
  const queryResult = actions.getServiceOrderById(id as string);
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
      {JSON.stringify(queryResult.data, null, 4)}
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
