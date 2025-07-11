import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { Space, Button, Table } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button
          href={`/v/branches/${id}/products/newProduct`}
          icon={<AppstoreAddOutlined />}
        >
          Nuevo producto o servicio
        </Button>
      </Space>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
