import React, { ReactElement } from "react";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Row, Col, Card, Typography, Table, Button, Tag, Space, message, Input } from 'antd';
import { useRouter } from 'next/router';
import { SearchOutlined } from "@ant-design/icons"; // 👈 mejor usar de antd en lugar de lucide aquí

const { Title } = Typography;

type ChangeRequest = {
  id: string;
  vendorName: string;
  type: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  createdAt: string;
};

const mockRequests: ChangeRequest[] = [
  {
    id: '1',
    vendorName: 'Tienda Don Pepe',
    type: 'Creación de tienda',
    status: 'pendiente',
    createdAt: '2025-09-25',
  },
  {
    id: '2',
    vendorName: 'Servicios Juanita',
    type: 'Edición de producto',
    status: 'aprobado',
    createdAt: '2025-09-20',
  },
  {
    id: '3',
    vendorName: 'Boutique Ana',
    type: 'Cambio en sucursal',
    status: 'rechazado',
    createdAt: '2025-09-18',
  },
];

const ChangeRequestsPage = () => {
  const router = useRouter();

  const handleApprove = (id: string) => {
    message.loading({ content: 'Aprobando...', key: `approve-${id}` });
    setTimeout(() => {
      message.success({ content: 'Solicitud aprobada', key: `approve-${id}`, duration: 2 });
    }, 800);
  };

  const handleReject = (id: string) => {
    message.loading({ content: 'Rechazando...', key: `reject-${id}` });
    setTimeout(() => {
      message.error({ content: 'Solicitud rechazada', key: `reject-${id}`, duration: 2 });
    }, 800);
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
              dataSource={mockRequests}
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