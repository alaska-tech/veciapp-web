import React, { ReactElement, useEffect, useState } from "react";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Row, Col, Card, Typography, Table, Button, Tag, Space, message, Input, Divider } from 'antd';
import { useRouter } from 'next/router';
import { SearchOutlined } from "@ant-design/icons";

import { mockChangesApi } from "@/services/mockChangesApi";
import { ChangeRequest, useChangeRequestAction } from "@/actions/changeRequest.action";
import dayjs from "dayjs";

const { Title } = Typography;



const ChangeRequestsPage = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const actions = useChangeRequestAction()
  const query = actions.getChangeRequests({
    limit: pagination.pageSize,
    page: pagination.current, status: "PENDING"
  });
  const rejectMutation = actions.rejectChangeRequest()
  const approveMutation = actions.approveChangeRequest()




  const columns = [
    {
      title: 'Elemento',
      key: 'elementName',
      render: (_: any, record: any) => {
        // obtener nomrb desde newValues o oldValues
        const newValues = record.requestedChanges?.newValues || {};
        const oldValues = record.requestedChanges?.oldValues || {};
        const name = newValues.name || oldValues.name || 'No disponible';
        return name;
      }
    },
    {
      title: 'Tipo de cambio',
      dataIndex: 'entityType',
      key: 'entityType',
      render: (entityType: string) => {
        const typeMap: any = {
          'PRODUCT_AND_SERVICE': 'Producto/Servicio',
          'STORE': 'Tienda',
          'VENDOR_PROFILE': 'Perfil de Vendedor'
        };
        return typeMap[entityType] || entityType;
        }
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: ChangeRequest['status']) => {
        const color = status === 'PENDING' ? 'orange' : status === 'APPROVED' ? 'green' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        return dayjs(date).format("D MMMM YYYY hh:mm A")
      }
    }, {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: ChangeRequest) => (
        <Space split={<Divider type="vertical" />}>
          <a href={`/a/change-requests/${record.id}`}>Detalles</a>
        </Space>
      ),
    },/* 
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: ChangeRequest) => (
        <Space>
          <Button onClick={() => router.push(`/a/change-requests/${record.id}`)}>
            Ver detalle
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button loading={approveMutation.isPending} type="primary" onClick={
                async () => await approveMutation.mutateAsync({ id: record.id, body: { reason: "" } })}>
                Aprobar
              </Button>
              <Button loading={rejectMutation.isPending} danger onClick={
                async () => await rejectMutation.mutateAsync({ id: record.id, body: { reason: "" } })}>
                Rechazar
              </Button>
            </>
          )}
        </Space>
      ),
    }, */
  ];
  return (<div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
      <div
        style={{
          width: "100%",
          justifyContent: "flex-end",
          marginBottom: "24px",
        }}
      />
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
  </div>)
};

export default ChangeRequestsPage;

ChangeRequestsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};