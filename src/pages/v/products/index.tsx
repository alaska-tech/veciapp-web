import { useProductServiceAction } from "@/actions/productservice.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ProductService,
} from "@/constants/models";
import { PlusOutlined } from "@ant-design/icons";
import {
  Table,
  Space,
  Button,
  TableColumnsType,
  Dropdown,
  Divider,
} from "antd";
import Link from "next/link";
import React, { ReactElement } from "react";

type DataType = ProductService;

const Users = () => {
  const user = getUserInfo();
  const actions = useProductServiceAction();
  const getProductService = actions.getProductServices();
  const columns: TableColumnsType<DataType> = [
    {
      title: "Sucursal",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Link href={`/v/products/${record.id}`}>Edit</Link>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "2",
                  label: "Delete",
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="link">More...</Button>
          </Dropdown>
        </Space>
      ),
    },
  ];
  if (!user) {
    return null;
  }
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Table<DataType>
        columns={columns}
        dataSource={getProductService.data?.data.data}
        loading={getProductService.isLoading}
        style={{
          overflow: "auto",
        }}
      />
    </div>
  );
};

export default Users;

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
