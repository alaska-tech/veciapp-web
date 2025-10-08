import React, { ReactElement, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Button, Tag, Space, Divider, Typography } from "antd";
import { useRouter } from "next/router";
import { useChangeRequestAction } from "@/actions/changeRequest.action";
import dayjs from "dayjs";
import { ChangeRequest, ChangeRequestStatusOptions } from "@/constants/models";
import SearchBar, { SearchFieldProps } from "@/components/pure/SearchBar";
import { CHANGE_REQUEST_STATUS_LABEL } from "@/constants/labels";
import { useVendorAction } from "@/actions/vendor.action";

const searchFields: SearchFieldProps[] = [
  {
    label: "Estado",
    fieldName: "status",
    type: "options",
    options: ChangeRequestStatusOptions.map((status) => {
      return {
        label: CHANGE_REQUEST_STATUS_LABEL[status],
        value: status,
      };
    }),
  },
];

const ChangeRequestsPage = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const actions = useChangeRequestAction();
  const { SearchComponent, search } = SearchBar({ searchFields });
  const query = actions.getChangeRequstByVendorId({
    limit: pagination.pageSize,
    page: pagination.current,
    status: search.value,
  });
  const vendorActions = useVendorAction();
  const vendorQueries = vendorActions.getVendorsById(
    query.data?.data.data.map((cr) => cr.vendorId) || []
  );

  const columns = [
    {
      title: "Remitente",
      dataIndex: "vendorId",
      key: "vendorId",
      render: (id: string, record: ChangeRequest) => {
        const vendor = vendorQueries.find((v) => v.data?.data.data.id === id)
          ?.data?.data.data;
        if (vendor) {
          return (
            <Space direction="vertical">
              <Typography.Text strong>{vendor.fullName}</Typography.Text>
              <Typography.Text type="secondary">
                {vendor.email} - {vendor.internalCode}
              </Typography.Text>
            </Space>
          );
        }
        return id;
      },
    },
    {
      title: "Tipo de cambio",
      dataIndex: "entityType",
      key: "entityType",
      render: (entityType: string) => {
        const typeMap: any = {
          PRODUCT_AND_SERVICE: "Producto/Servicio",
          STORE: "Tienda",
          VENDOR_PROFILE: "Perfil de Vendedor",
        };
        return typeMap[entityType] || entityType;
      },
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: ChangeRequest["status"]) => {
        const color =
          status === "PENDING"
            ? "orange"
            : status === "APPROVED"
            ? "green"
            : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        return dayjs(date).format("D MMMM YYYY hh:mm A");
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: ChangeRequest) => (
        <Space split={<Divider type="vertical" />}>
          <a href={`/v/changeRequests/${record.id}`}>Detalles</a>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        {SearchComponent}
      </Space>
      <Table<ChangeRequest>
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

export default ChangeRequestsPage;

ChangeRequestsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
