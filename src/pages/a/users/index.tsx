import DashboardLayout2 from "@/components/layout/DashboardLayout";
import {
  CheckCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Table,
  Tag,
  Space,
  Button,
  TableColumnsType,
  TableColumnType,
  Input,
  InputRef,
  Typography,
  Dropdown,
  Divider,
  Card,
} from "antd";
import { FilterDropdownProps, FilterRestProps } from "antd/es/table/interface";
import Link from "next/link";
import React, { ReactElement, useRef, useState } from "react";
import { User, Vendor } from "@models";
import { QUERY_KEY_VENDOR } from "@/actions/vendor.action";
import AsyncButton from "@/components/pure/AsyncButton";
import { useCustomerAction } from "@/actions/customer.action";

type DataType = User;

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
const Index = () => {
  const customerActions = useCustomerAction();
  const customersQuery = customerActions.getCustomers();
  const deleteCustomer = customerActions.deleteCustomer();
  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefono",
      dataIndex: "cellphone",
      key: "cellphone",
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
          <a href={`/a/users/${record.id}?name=${record.fullName}`}>Detalles</a>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  danger: true,
                  label: (
                    <AsyncButton
                      type="text"
                      popConfirm
                      onClick={() =>
                        deleteCustomer.mutateAsync({ id: record.id })
                      }
                    >
                      Borrar
                    </AsyncButton>
                  ),
                },
              ],
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Opciones
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
        <Button href="/a/users/newUser" icon={<PlusOutlined />}>
          Crear nuevo cliente
        </Button>
      </Space>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={customersQuery.data?.data.data || []}
        loading={customersQuery.isLoading}
        /*       pagination={tableParams.pagination}
      onChange={handleTableChange} */
      />
    </div>
  );
  return (
    <Table<DataType>
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={customersQuery.data?.data.data || []}
      loading={customersQuery.isLoading}
      /*       pagination={tableParams.pagination}
      onChange={handleTableChange} */
    />
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
