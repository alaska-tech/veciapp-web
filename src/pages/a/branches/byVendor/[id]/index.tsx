import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Branch, BranchBusiness } from "@/constants/models";
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
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { useBranchAction } from "@/actions/branch.action";
import AsyncButton from "@/components/pure/AsyncButton";
import { branchesTableColumns } from "@/components/tableColumns/branches";
import SearchBar, { SearchFieldProps } from "@/components/pure/SearchBar";
import {
  BRANCH_IS_ACTIVE_LABELS,
  BRANCH_TYPE_LABELS,
} from "@/constants/labels";

type DataType = Branch;

const searchFields: SearchFieldProps[] = [
  {
    label: "Nombre",
    fieldName: "name",
    type: "text",
  },
  /*   {
    label: "Ciudad",
    fieldName: "city",
    type: "text",
  },
  {
    label: "Estado",
    fieldName: "state",
    type: "options",
    options: Object.entries(BranchState).map(([key, value]) => ({
      label: BRANCH_STATE_LABELS[value],
      value: value,
    })),
  }, */
  {
    label: "Tipo de negocio",
    fieldName: "businessType",
    type: "options",
    options: Object.entries(BranchBusiness).map(([key, value]) => ({
      label: BRANCH_TYPE_LABELS[value],
      value: value,
    })),
  },
  {
    label: "Estado de activación",
    fieldName: "isActive",
    type: "options",
    options: Object.entries(BRANCH_IS_ACTIVE_LABELS).map(([key, value]) => {
      return {
        label: value,
        value: key,
      };
    }),
  },
];

const Users = () => {
  const user = getUserInfo();
  const router = useRouter();
  const { name: vendorName, id: vendorId } = router.query;
  const actions = useBranchAction();
  const deleteBranch = actions.deleteBranch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { SearchComponent, search } = SearchBar({ searchFields });

  const productsQuery = actions.getBranchesPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    search: search.value
      ? {
          vendorId: vendorId as string,
          [search.fieldName]: search.value,
        }
      : {
          vendorId: vendorId as string,
        },
  });
  const columns: TableColumnsType<DataType> = [
    ...branchesTableColumns,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} wrap>
          <Link
            href={`/a/products/byBranch/${record.id}?vendorId=${vendorId}&name=${record.name}`}
          >
            Inventario
          </Link>
          <Link href={`/a/branches/${record.id}?name=${record.name}`}>
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
      <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
        {SearchComponent}
        <Button
          type="default"
          href={`/a/branches/byVendor/${vendorId}/newBranch?name=${vendorName}`}
          style={{ float: "inline-end" }}
          icon={<PlusOutlined />}
        >
          Crear tienda
        </Button>
      </Space>
      <Table<DataType>
        columns={columns}
        dataSource={productsQuery.data?.data.data}
        loading={productsQuery.isLoading}
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
          total: productsQuery.data?.data.meta.total || 0,
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
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
