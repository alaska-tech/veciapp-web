import { useBranchAction } from "@/actions/branch.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AsyncButton from "@/components/pure/AsyncButton";
import { branchesTableColumns } from "@/components/tableColumns/branches";
import {
  Branch,
} from "@/constants/models";
import { AppstoreAddOutlined } from "@ant-design/icons";
import {
  Table,
  Space,
  Button,
  TableColumnsType,
  Dropdown,
  Divider,
} from "antd";
import Link from "next/link";
import React, { ReactElement, useState } from "react";

type DataType = Branch;

const Users = () => {
  const user = getUserInfo();
  const actions = useBranchAction();
  const deleteBranch = actions.deleteBranch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const branchQuery = actions.getBranchesByVendorIdPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    vendorId: user?.foreignPersonId,
  });
  const columns: TableColumnsType<DataType> = [
    ...branchesTableColumns,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} wrap>
          <Link href={`/v/products/byBranch/${record.id}?name=${record.name}`}>
            Inventario
          </Link>
          <Link href={`/v/branches/${record.id}?name=${record.name}`}>
            Detalles
          </Link>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "2",
                  label: (
                    <AsyncButton
                      onClick={() => {
                        deleteBranch.mutateAsync({ id: record.id });
                      }}
                      popConfirm
                      type="text"
                    >
                      Eliminar
                    </AsyncButton>
                  ),
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="link">Más...</Button>
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
      <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button
          href={`/v/branches/newBranch?name=${user?.fullName}`}
          icon={<AppstoreAddOutlined />}
        >
          Nueva tienda
        </Button>
      </Space>
      <Table<DataType>
        columns={columns}
        dataSource={branchQuery.data?.data.data}
        loading={branchQuery.isLoading}
        onChange={(pag, _filters, _sorter) => {
          setPagination({
            ...pagination,
            current: pag.current || 1,
            pageSize: pag.pageSize || 2,
          });
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: branchQuery.data?.data.meta.total || 0,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
        style={{
          overflow: "auto",
          background: "#fff",
        }}
      />
    </div>
  );
};

export default Users;

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};