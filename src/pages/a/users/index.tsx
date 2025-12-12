import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Table, Tag, Space, Button, TableColumnsType, Divider } from "antd";
import React, { ReactElement, useState } from "react";
import { Customer, Vendor } from "@models";
import { useCustomerAction } from "@/actions/customer.action";
import { VENDOR_STATUS_TAG_PROPS } from "@/constants/labels";

type DataType = Customer;

const getVendorStatusTagProps = (status: Vendor["state"]) => {
  return (
    VENDOR_STATUS_TAG_PROPS[status] || {
      props: {},
      text: "Desconocido",
    }
  );
};
const Index = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const customerActions = useCustomerAction();
  const customersQuery = customerActions.getCustomers({
    limit: pagination.pageSize,
    page: pagination.current ,
  });
  const deleteCustomer = customerActions.deleteCustomer();
  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
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
          <a href={`/a/users/${record.id}?name=${record.fullName}`}>Detalles</a>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <div
          style={{
            width: "100%",
            justifyContent: "flex-end",
            marginBottom: "24px",
          }}
        />
      </Space>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={customersQuery.data?.data.data || []}
        loading={customersQuery.isLoading}
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
          total: customersQuery.data?.data.meta.total || 0,
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

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
