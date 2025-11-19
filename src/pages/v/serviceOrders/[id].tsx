import { useServiceOrderAction } from "@/actions/serviceOrder.action";
import { useVendorAction } from "@/actions/vendor.action";
import { useCustomerAction } from "@/actions/customer.action";
import { useBranchAction } from "@/actions/branch.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingOutlined } from "@ant-design/icons";
import { Result, Button, Space, Descriptions, Divider, Table, Empty } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import {
  SERVICE_ORDER_ORDER_STATUS_LABELS,
  SERVICE_ORDER_PAYMENT_STATUS_LABELS,
  SERVICE_ORDER_PAYMENT_METHOD_LABELS,
} from "@/constants/labels";
import { ServiceOrder, Customer, Vendor, Branch } from "@models";
import RenderCustomer from "@/components/pure/RenderCustomer";
import RenderVendor from "@/components/pure/RenderVendor";
import RenderBranch from "@/components/pure/RenderBranch";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const actions = useServiceOrderAction();
  const queryResult = actions.getServiceOrderById(id as string);

  // Hooks para obtener datos de entidades relacionadas
  const vendorQueries = useVendorAction();
  const customerQueries = useCustomerAction();
  const branchQueries = useBranchAction();

  const vendorQuery = vendorQueries.getVendorById(
    queryResult.data?.vendorId,
    { enabled: !!queryResult.data?.vendorId }
  );
  const customerQuery = customerQueries.getCustomerById(
    queryResult.data?.customerId,
    { enabled: !!queryResult.data?.customerId }
  );
  const branchQuery = branchQueries.getBranchById(
    queryResult.data?.branchId,
    { enabled: !!queryResult.data?.branchId }
  );
  const order = queryResult.data as ServiceOrder;

  const productsData =
    order?.productsSnapshots?.map((ps) => {
      const p = order.products?.find((x) => x.productId === ps.id);
      const unit = p?.price ?? Number(ps.price ?? 0);
      const qty = p?.quantity ?? 1;
      return {
        key: ps.id,
        name: ps.name,
        quantity: qty,
        unitPrice: unit,
        totalPrice: unit * qty,
      };
    }) ?? [];

  const productColumns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Cantidad", dataIndex: "quantity", key: "quantity" },
    {
      title: "Precio unitario",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (value: number) => `${order.currency} ${value}`,
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: number) => `${order.currency} ${value}`,
    },
  ];
  if (queryResult.isLoading) {
    return <LoadingOutlined />;
  }
  if (queryResult.isError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Lo siento. Algo salió mal."
        extra={
          <Button
            type="primary"
            onClick={() => {
              queryResult.refetch();
            }}
          >
            Reintentar
          </Button>
        }
      />
    );
  }
  if (!queryResult.data) {
    return <Empty />;
  }
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <>
        <Descriptions
          title={`Pedido ${order?.orderNumber}`}
          bordered
          size="small"
          column={2}
        >
          <Descriptions.Item label="Fecha" span={1}>
            {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>

          <Descriptions.Item label="Cliente" span={1}>
            <RenderCustomer 
              customer={customerQuery.data || ({} as Customer)} 
              href={`/a/users/${order.customerId}?name=${customerQuery.data?.fullName}`}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Vendedor" span={1}>
            <RenderVendor 
              vendor={vendorQuery.data || ({} as Vendor)} 
              href={`/a/vendors/${order.vendorId}?name=${vendorQuery.data?.fullName}`}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Tienda" span={1}>
            <RenderBranch 
              branch={branchQuery.data || ({} as Branch)} 
              href={`/a/branches/${order.branchId}?name=${branchQuery.data?.name}`}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Tipo de entrega" span={1}>
            {order.deliveryType}
          </Descriptions.Item>

          <Descriptions.Item label="Dirección de entrega" span={2}>
            {order.deliveryType === "delivery" && order.deliveryAddress ? (
              <Space direction="vertical" size={0}>
                <div>{order.deliveryAddress.alias}</div>
                <div>{order.deliveryAddress.address}</div>
                <div>
                  <a
                    href={`https://www.google.com/maps?q=${order.deliveryAddress.coordinates[1]},${order.deliveryAddress.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </Space>
            ) : (
              "Recoge en tienda"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Estado del pedido" span={1}>
            {SERVICE_ORDER_ORDER_STATUS_LABELS[order.orderStatus]}
          </Descriptions.Item>
          <Descriptions.Item label="Estado del pago" span={1}>
            {SERVICE_ORDER_PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus || "No especificado"}
          </Descriptions.Item>

          <Descriptions.Item label="Método de pago" span={2}>
            {SERVICE_ORDER_PAYMENT_METHOD_LABELS[order.paymentMethod] ||order.paymentMethod|| "No especificado"}
          </Descriptions.Item>
        </Descriptions>

        <Divider>Resumen de valores</Divider>
        <Descriptions bordered size="small" column={3}>
          <Descriptions.Item label="Subtotal">
            {order.currency} {order.subtotal}
          </Descriptions.Item>
          <Descriptions.Item label="Descuento">
            {order.currency} {order.discountAmount}
          </Descriptions.Item>
          <Descriptions.Item label="Costo de envío">
            {order.currency} {order.deliveryFee}
          </Descriptions.Item>
          <Descriptions.Item label="Tarifa de servicio">
            {order.currency} {order.serviceFee}
          </Descriptions.Item>
          <Descriptions.Item label="Total" span={3}>
            {order.currency} {order.totalAmount}
          </Descriptions.Item>
        </Descriptions>

        <Divider>Productos</Divider>
        <Table
          columns={productColumns}
          dataSource={productsData}
          pagination={false}
          size="small"
          bordered
          style={{ background: "#fff" }}
        />
      </>
    </Space>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
