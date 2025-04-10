import DashboardLayout2 from "@/components/layout/DashboardLayout2";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { ReactElement } from "react";

const Index = () => {
  return (
    <div>
      <Button type="link" href="/(admin)/vendors" icon={<ArrowLeftOutlined />}>
        Back
      </Button>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
