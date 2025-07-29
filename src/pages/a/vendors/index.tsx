import { useVendorAction } from "@/actions/vendor.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AsyncButton from "@/components/pure/AsyncButton";
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
} from "antd";
import React, { ReactElement } from "react";

const VENDOR_STATUS_TAG_PROPS = {
  created: {
    props: {},
    text: "Creado",
  },
  verified: {
    props: {
      icon: <CheckCircleOutlined />,
      color: "success",
    },
    text: "Verificado",
  },
  suspended: {
    props: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
    },
    text: "Suspendido",
  },
};

const getVendorStatusTagProps = (status: Vendor["state"]) => {
  return (
    VENDOR_STATUS_TAG_PROPS[status] || {
      props: {},
      text: "Desconocido",
    }
  );
};
const Users = () => {
  const vendorActions = useVendorAction();
  const vendorQuery = vendorActions.getVendors();
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
        <Space split={<Divider type="vertical" />}>
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
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button href="/a/vendors/newVendor" icon={<PlusOutlined />}>
          Crear nuevo proveedor
        </Button>
      </Space>
      <Table<Vendor>
        columns={columns}
        dataSource={vendorQuery.data?.data?.data}
        loading={vendorQuery.isLoading}
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
