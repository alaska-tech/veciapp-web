import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Space, TableColumnsType, Divider, Tag } from "antd";
import React, { ReactElement, useState } from "react";
import {
  Branch,
  Customer,
  ServiceOrder,
  ServiceOrderOrderStatus,
  ServiceOrderOrderStatusType,
  ServiceOrderPaymentStatusType,
  Vendor,
} from "@models";
import {
  SERVICE_ORDER_ORDER_STATUS_LABELS,
  SERVICE_ORDER_PAYMENT_STATUS_LABELS,
} from "@/constants/labels";
import { useServiceOrderAction } from "@/actions/serviceOrder.action";
import SearchBar, { SearchFieldProps } from "@/components/pure/SearchBar";
import RenderVendor from "@/components/pure/RenderVendor";
import { useVendorAction } from "@/actions/vendor.action";
import { useCustomerAction } from "@/actions/customer.action";
import RenderCustomer from "@/components/pure/RenderCustomer";
import RenderBranch from "@/components/pure/RenderBranch";
import { useBranchAction } from "@/actions/branch.action";

type DataType = ServiceOrder;

const searchFields: SearchFieldProps[] = [
  {
    label: "Estado",
    fieldName: "status",
    type: "options",
    options: Object.entries(ServiceOrderOrderStatus).map(([key, value]) => ({
      label: SERVICE_ORDER_ORDER_STATUS_LABELS[value],
      value: value,
    })),
  },
];

const Index = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { SearchComponent, search } = SearchBar({ searchFields });
  const actions = useServiceOrderAction();
  const query = actions.getServiceOrders({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    status: search.value as ServiceOrderOrderStatusType[number],
  });
  const vendorQueries = useVendorAction();
  const vendorQuery = vendorQueries.getVendorsById(
    query.data?.data.data.map((order) => order.vendorId) || []
  );
  const customerQueries = useCustomerAction();
  const customerQuery = customerQueries.getCustomersById(
    query.data?.data.data.map((order) => order.customerId) || []
  );
  const branchQueries = useBranchAction();
  const branchQuery = branchQueries.getBranchesById(
    query.data?.data.data.map((order) => order.branchId) || []
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Número de pedido",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Cliente",
      dataIndex: "customerId",
      key: "customerId",
      render: (value) => {
        const customer = customerQuery.find(
          (query) => query.data?.data.data.id === value
        )?.data?.data.data;
        return <RenderCustomer customer={customer || ({} as Customer)} />;
      },
    },
    {
      title: "Vendedor",
      dataIndex: "vendorId",
      key: "vendorId",
      minWidth: 200,
      render: (value, record) => {
        const vendor = vendorQuery.find(
          (query) => query.data?.data.data.id === value
        )?.data?.data.data;
        const branch = branchQuery.find(
          (query) => query.data?.data.data.id === record.branchId
        )?.data?.data.data;
        return (
          <Space
            direction="vertical"
            split={<Divider style={{ margin: 0, padding: 0 }} />}
          >
            <RenderBranch
              branch={branch || ({} as Branch)}
              href={`/a/branches/${record.branchId}?name=${branch?.name}`}
            />
            <RenderVendor
              vendor={vendor || ({} as Vendor)}
              href={`/a/vendors/${value}?name=${vendor?.fullName}`}
            />
          </Space>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        return SERVICE_ORDER_ORDER_STATUS_LABELS[
          status as ServiceOrderOrderStatusType[number]
        ];
      },
    },
    {
      title: "Estado del pago",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        return SERVICE_ORDER_PAYMENT_STATUS_LABELS[
          status as ServiceOrderPaymentStatusType[number]
        ];
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_text, record) => (
        <Space split={<Divider type="vertical" />}>
          <a href={`/a/users/${record.id}?name=${record.orderNumber}`}>
            Detalles
          </a>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-start" }}>
        {SearchComponent}
      </Space>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={query.data?.data.data || []}
        loading={query.isLoading}
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
          total: query.data?.data.meta.total || 0,
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
