import DashboardLayout from '@/components/layout/DashboardLayout';
import { Row, Col, Card, Typography, Statistic, Table, Button, Tag } from 'antd';
import { motion } from "framer-motion";
import { ReactElement } from 'react';
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/router";

interface OrderData {
    id: string;
    customer: string;
    product: string;
    status: 'Completado' | 'Pendiente' | 'Cancelado';
    amount: string;
    createdAt: string;
}

const { Title } = Typography;

const OrdersPage = () => {
    const router = useRouter();
    // Datos quemados (mock)
    const stats = {
        total: 120,
        completed: 95,
        cancelled: 10,
    };

    const columns = [
        { 
            title: 'ID Pedido', 
            dataIndex: 'id', 
            key: 'id',
            width: 120
        },
        { 
            title: 'Cliente', 
            dataIndex: 'customer', 
            key: 'customer' 
        },
        { 
            title: 'Producto', 
            dataIndex: 'product', 
            key: 'product' 
        },
        { 
            title: 'Estado', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: 'Completado' | 'Pendiente' | 'Cancelado') => {
                const statusConfig: Record<typeof status, { color: string }> = {
                    Completado: { 
                        color: 'success'
                    },
                    Pendiente: { 
                        color: 'warning'
                    },
                    Cancelado: { 
                        color: 'error'
                    }
                };

                return (
                    <Tag 
                        color={statusConfig[status].color}
                    >
                        {status}
                    </Tag>
                );
            }
        },
        { 
            title: 'Monto', 
            dataIndex: 'amount', 
            key: 'amount',
            align: 'right' as const
        },
        { 
            title: 'Fecha Creación', 
            dataIndex: 'createdAt', 
            key: 'createdAt',
            width: 130
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 100,
            render: (_: any, record: OrderData) => (
                <Button 
                    type="link" 
                    onClick={() => router.push(`/v/orders/${record.id}`)}
                >
                    Detalles
                </Button>
            )
        }
    ];

    const data: OrderData[] = [
        { 
            id: 'ORD-001', 
            customer: 'Juan Pérez', 
            product: 'Laptop HP',
            status: 'Completado', 
            amount: '$50.000',
            createdAt: '2025-09-20'
        },
        { 
            id: 'ORD-002', 
            customer: 'María Gómez', 
            product: 'iPhone 15',
            status: 'Pendiente', 
            amount: '$30.000',
            createdAt: '2025-09-21'
        },
        { 
            id: 'ORD-003', 
            customer: 'Carlos Ruiz', 
            product: 'Samsung TV',
            status: 'Cancelado', 
            amount: '$10.000',
            createdAt: '2025-09-22'
        },
    ];

    return (
        <div style={{ padding: '24px' }}>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12} md={8}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                        <Card>
                            <Statistic
                                title="Pedidos Totales"
                                value={stats.total}
                                prefix={<ShoppingCart />}
                            />
                        </Card>
                    </motion.div>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                        <Card>
                            <Statistic
                                title="Completados"
                                value={stats.completed}
                                prefix={<CheckCircle color="green" />}
                                valueStyle={{ color: "green" }}
                            />
                        </Card>
                    </motion.div>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                        <Card>
                            <Statistic
                                title="Cancelados"
                                value={stats.cancelled}
                                prefix={<XCircle color="red" />}
                                valueStyle={{ color: "red" }}
                            />
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            <Card 
                style={{ marginTop: 24 }}
                bodyStyle={{ padding: 0 }}
            >
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                />
            </Card>
        </div>
    );
};

OrdersPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default OrdersPage;