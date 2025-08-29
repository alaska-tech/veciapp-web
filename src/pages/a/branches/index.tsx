import { useBranchAction } from "@/actions/branch.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AsyncButton from "@/components/pure/AsyncButton";
import RenderVendor from "@/components/pure/RenderVendor";
import SearchBar, { SearchFieldProps } from "@/components/pure/SearchBar";
import { branchesTableColumns } from "@/components/tableColumns/branches";
import {
  BRANCH_IS_ACTIVE_LABELS,
  BRANCH_STATE_LABELS,
  BRANCH_TYPE_LABELS,
} from "@/constants/labels";
import {
  Branch,
  BranchBusiness,
  BranchState,
  Vendor,
} from "@/constants/models";
import { MailOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Table,
  Space,
  Button,
  TableColumnsType,
  Dropdown,
  Divider,
  Typography,
  App,
  Select,
  Form,
  Input,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";

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
  const actions = useBranchAction();
  const deleteBranch = actions.deleteBranch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { SearchComponent, search } = SearchBar({ searchFields });

  const branchQuery = actions.getBranchesPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    search: search.value
      ? {
          [search.fieldName]: search.value,
        }
      : {},
  });
  const vendorActions = useVendorAction();
  const vendorQueries = vendorActions.getVendorsById(
    branchQuery.data?.data.data.map((branch) => branch.vendorId)
  );
  const { data: vendorData } = vendorActions.getVendors({
    limit: 0,
    page: 0,
  });
  const totalVendors = vendorData?.data.meta.total || 0;
  const columns: TableColumnsType<DataType> = [
    {
      title: "Gerente",
      key: "vendorId",
      dataIndex: "vendorId",
      render: (value) => {
        const vendorQuery = vendorQueries.find((queryResult) => {
          return queryResult.data?.data?.data?.id === value;
        });
        return (
          <RenderVendor
            vendor={vendorQuery?.data?.data?.data || ({} as Vendor)}
            href={`/a/vendors/${value}?name=${vendorQuery?.data?.data?.data?.fullName}`}
          />
        );
      },
    },
    ...branchesTableColumns,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} wrap>
          <Link
            href={`/a/products/byBranch/${record.id}?vendorId=${record.vendorId}&name=${record.name}`}
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
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        {SearchComponent}
        <NewBranchButton totalVendors={totalVendors} />
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

const NewBranchButton = ({ totalVendors }: { totalVendors: number }) => {
  const { modal } = App.useApp();
  const vendorActions = useVendorAction();
  const query = vendorActions.getVendors({
    limit: totalVendors,
    page: 0,
  });
  const router = useRouter();
  const form = Form.useFormInstance();
  const handleClick = () => {
    const modalRef = modal.info({
      title: "Escoja un veciproveedor",
      okButtonProps: {
        style: {
          display: "none",
        },
      },
      closable: true,
      content: (
        <Form
          form={form}
          onFinish={(values) => {
            const [vendorId, vendorName] = values.vendorId.split(" ");
            router.push(
              `/a/branches/byVendor/${vendorId}/newBranch?name=${vendorName}`
            );
            modalRef.destroy();
          }}
        >
          <Form.Item
            name="vendorId"
            label="Proveedor"
            rules={[{ required: true }]}
          >
            <Select
              options={query.data?.data.data.map((vendor) => ({
                label: `${vendor.internalCode} - ${vendor.fullName} (${vendor.email})`,
                value: `${vendor.id} ${vendor.fullName}`,
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              popupMatchSelectWidth={false}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              float: "inline-end",
            }}
          >
            Escoger
          </Button>
        </Form>
      ),
    });
  };
  return (
    <Button
      type="default"
      style={{ float: "inline-end" }}
      icon={<PlusOutlined />}
      onClick={handleClick}
    >
      Crear tienda
    </Button>
  );
};
