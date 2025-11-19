import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AsyncButton from "@/components/pure/AsyncButton";
import SearchBar, { SearchFieldProps } from "@/components/pure/SearchBar";
import { VENDOR_STATUS_TAG_PROPS } from "@/constants/labels";
import { Vendor } from "@/constants/models";
import {
  CheckCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Dropdown,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from "antd";
import React, { ReactElement, useState } from "react";

const searchFields: SearchFieldProps[] = [
  { label: "Código", fieldName: "internalCode", type: "text" },
  {
    label: "Nombre",
    fieldName: "name",
    type: "text",
  },
  {
    label: "Documento de identidad",
    fieldName: "identification",
    type: "text",
  },
];

const getVendorStatusTagProps = (status: Vendor["state"]) => {
  return (
    VENDOR_STATUS_TAG_PROPS[status] || {
      props: {},
      text: "Desconocido",
    }
  );
};
const Users = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const vendorActions = useVendorAction();
  const { SearchComponent, search } = SearchBar({ searchFields });

  const vendorQuery = vendorActions.getVendors({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    search: search.value
      ? {
          [search.fieldName]: search.value,
        }
      : {},
  });
  const deleteVendor = vendorActions.deleteVendor();
  const columns: TableColumnsType<Vendor> = [
    {
      title: "Código",
      dataIndex: "internalCode",
      key: "internalCode",
    },
    {
      title: "Nombre",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName, record) => {
        return (
          <Space direction="vertical">
            <Typography.Text>{fullName}</Typography.Text>
            <Typography.Text type="secondary">{record.identification}</Typography.Text>
          </Space>
        );
      },
    },
    {
      title: "Contacto",
      dataIndex: "email",
      key: "email",
      render: (email, record) => {
        return (
          <Space direction="vertical">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`tel:${record.cellphone}`}>+{record.cellphone}</a>
          </Space>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "state",
      key: "state",
      render: (state) => {
        const { text, props } = getVendorStatusTagProps(state);
        return <Tag {...props}>{text}</Tag>;
      },
    },
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_text, record) => (
        <Space wrap split={<Divider type="vertical" />}>
          <a href={`/a/branches/byVendor/${record.id}?name=${record.fullName}`}>
            Tiendas
          </a>
          <a href={`/a/vendors/${record.id}?name=${record.fullName}`}>
            Detalles
          </a>
          <Dropdown
            menu={{
              items: [
                {
                  key: "2",
                  label: (
                    <AsyncButton
                      onClick={() => {
                        deleteVendor.mutateAsync({ id: record.id });
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
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Más...
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
        {SearchComponent}
        <Button href="/a/vendors/newVendor" icon={<PlusOutlined />}>
          Crear nuevo veci
        </Button>
      </Space>
      <Table<Vendor>
        columns={columns}
        dataSource={vendorQuery.data?.data?.data}
        loading={vendorQuery.isLoading}
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
          total: vendorQuery.data?.data.meta.total || 0,
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
