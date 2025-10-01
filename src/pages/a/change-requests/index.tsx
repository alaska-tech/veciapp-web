import React, { ReactElement, useEffect, useState } from "react";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Row, Col, Card, Typography, Table, Button, Tag, Space, message, Input } from 'antd';
import { useRouter } from 'next/router';
import { SearchOutlined } from "@ant-design/icons"; // 👈 mejor usar de antd en lugar de lucide aquí

import { mockChangesApi } from "@/services/mockChangesApi";

const { Title } = Typography;

type ChangeRequest = {
  id: number;
  vendorName: string;
  type: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  createdAt: string;
};


const ChangeRequestsPage = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<ChangeRequest[]>([]);

  useEffect(() => {
    mockChangesApi.getChanges().then((data: any[]) => {
      // Map mock fields to ChangeRequest shape
      const statusMap: Record<string, ChangeRequest['status']> = {
        pending: 'pendiente',
        approved: 'aprobado',
        rejected: 'rechazado',
      };
      const typeMap: Record<string, string> = {
        address: 'Dirección',
        phone: 'Teléfono',
        name: 'Nombre',
        // add more entityType mappings as needed
      };
      const mapped = data.map(item => ({
        id: item.id,
        vendorName: item.vendorId, // Map vendorId to vendorName
        type: typeMap[item.entityType] || item.entityType,
        status: statusMap[item.status] || item.status,
        createdAt: item.createdAt,
      }));
      setRequests(mapped);
    });
  }, []);

  const handleApprove = (id: number) => {
    message.loading({ content: 'Aprobando...', key: `approve-${id}` });
    mockChangesApi.updateChangeStatus(id, "approved").then(() => {
      setRequests(prev => prev.filter(req => req.id !== id));
      message.success({ content: 'Solicitud aprobada', key: `approve-${id}`, duration: 2 });
    });
  };

  const handleReject = (id: number) => {
    message.loading({ content: 'Rechazando...', key: `reject-${id}` });
    mockChangesApi.updateChangeStatus(id, "rejected").then(() => {
      setRequests(prev => prev.filter(req => req.id !== id));
      message.error({ content: 'Solicitud rechazada', key: `reject-${id}`, duration: 2 });
    });
  };

  const columns = [
    {
      title: 'Vendedor',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Tipo de cambio',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: ChangeRequest['status']) => {
        const color = status === 'pendiente' ? 'orange' : status === 'aprobado' ? 'green' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: ChangeRequest) => (
        <Space>
          <Button onClick={() => router.push(`/a/change-requests/${record.id}`)}>
            Ver detalle
          </Button>
          {record.status === 'pendiente' && (
            <>
              <Button type="primary" onClick={() => handleApprove(record.id)}>
                Aprobar
              </Button>
              <Button danger onClick={() => handleReject(record.id)}>
                Rechazar
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "block"}}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          
            <Space
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "16px 0",
                width: "100%",
              }}
            >
              <Input
                placeholder="Buscar..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
              <Button>Filtrar por variante</Button>
            </Space>

            {/* 📋 Tabla */}
            <Table
              rowKey="id"
              dataSource={requests}
              columns={columns}
              pagination={{ pageSize: 10 }}
            /> 
        </Col>
      </Row>
    </div>
  );
};

export default ChangeRequestsPage;

ChangeRequestsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};