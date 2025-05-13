import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  CheckCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Table,
  Tag,
  Space,
  Button,
  TableColumnsType,
  Dropdown,
  Divider,
} from "antd";
import React, { ReactElement } from "react";
import { Customer, Vendor } from "@models";
import AsyncButton from "@/components/pure/AsyncButton";
import { useCustomerAction } from "@/actions/customer.action";

type DataType = Customer;

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
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
