import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Table,
  Space,
  TableColumnsType,
  Divider,
  Tag,
  Button,
  Modal,
  Form,
  DatePicker,
  message,
} from "antd";
import React, { ReactElement, useState } from "react";
import {
  Branch,
  Customer,
  ServiceOrder,
  ServiceOrderOrderStatus,
  ServiceOrderOrderStatusType,
  ServiceOrderPaymentStatusType,
  Vendor,
  Payment,
  PaginatedResult,
} from "@models";
import {
  SERVICE_ORDER_ORDER_STATUS_LABELS,
  SERVICE_ORDER_PAYMENT_METHOD_LABELS,
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
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import { usePaymenAction } from "@/actions/paymnet.action";
import { apiClient } from "@/services/clients";
import search from "antd/es/transfer/search";
dayjs.locale("es");
dayjs.extend(utc);
type DataType = ServiceOrder;

const searchFields: SearchFieldProps[] = [
  {
    label: "Estado",
    fieldName: "orderStatus",
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
    page: pagination.current,
    orderStatus: search.value as ServiceOrderOrderStatusType[number],
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
  const paymentQueries = usePaymenAction();
  const paymentQuery = paymentQueries.getPaymentsByOrderId(
    query.data?.data.data.map((order) => order.id) || [],
    { retry: 1 }
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        return dayjs(value).format("DD/MMMM/YYYY HH:mm");
      },
    },
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
      title: "Información del pago",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      minWidth: 260,
      render: (_status, record) => {
        const payment = paymentQuery.find(
          (query) => query.data?.data.data.at(0)?.orderId === record.id
        );
        const pay = payment?.data?.data.data.at(0) as Payment | undefined;

        return (
          <Space direction="vertical" size={0}>
            <div>
              {
                SERVICE_ORDER_PAYMENT_STATUS_LABELS[
                  (pay?.state ||
                    record.paymentStatus) as ServiceOrderPaymentStatusType[number]
                ]
              }
            </div>
            <div>
              {`${pay?.currency || record.currency} ${
                pay?.amount ?? record.totalAmount
              }`}
            </div>
            <div>
              Método de pago:{" "}
              {SERVICE_ORDER_PAYMENT_METHOD_LABELS[record.paymentMethod] ||
                record.paymentMethod ||
                "No especificado"}
            </div>
            <div>Ref: {pay?.paymentReference || "-"}</div>
            <div>Proveedor: {pay?.provider || "-"}</div>
            {pay?.receiptUrl ? (
              <a
                href={pay.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver recibo
              </a>
            ) : null}
            {pay?.failureReason ? (
              <Tag color="red">{pay.failureReason}</Tag>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_text, record) => (
        <Space wrap split={<Divider type="vertical" />}>
          <a href={`/a/serviceOrders/${record.id}`}>Detalles</a>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-start" }}>
        {/* {SearchComponent} */}
        <ServiceOrderReport />
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
import { Response } from "@models";

const ServiceOrderReport = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [reportData, setReportData] = useState<ServiceOrder[]>([]);
  const [csvUrl, setCsvUrl] = useState<string | undefined>(undefined);
  const [csvFileName, setCsvFileName] = useState<string>("orders_report.csv");

  const buildCsv = (orders: ServiceOrder[]) => {
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const headers = [
      "ID",
      "Número",
      "Fecha",
      "Estado",
      "Estado Pago",
      "Moneda",
      "Total",
      "Entrega",
      "Cliente",
      "Vendedor",
      "Sucursal",
    ];
    const rows = orders.map((o) => [
      o.id,
      o.orderNumber,
      dayjs(o.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      o.orderStatus,
      o.paymentStatus,
      o.currency,
      o.totalAmount,
      o.deliveryType,
      o.customerId,
      o.vendorId,
      o.branchId,
    ]);
    const csv = [
      headers.map(escape).join(","),
      ...rows.map((r) => r.map(escape).join(",")),
    ].join("\n");
    return csv;
  };
  const getOrders = async (start: string, end: string) => {
    const res = await apiClient.get<
      Extract<Response<PaginatedResult<ServiceOrder>>, { status: "Success" }>
    >("/orders/list", {
      params: {
        start,
        end,
        limit: 9999,
        page: 1,
      },
    });
    return res;
  };
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Generar reporte de órdenes de servicio</Button>
      {open && (
        <Modal
          title="Reportar orden de servicio"
          open={open}
          onCancel={() => {
            if (csvUrl) URL.revokeObjectURL(csvUrl);
            setCsvUrl(undefined);
            setOpen(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values: {
              start: dayjs.Dayjs;
              end: dayjs.Dayjs;
            }) => {
              try {
                setLoading(true);
                if (
                  !values.start ||
                  !values.end ||
                  !dayjs(values.start).isBefore(values.end)
                ) {
                  message.warning(
                    "La fecha de inicio debe ser anterior a la fecha de fin"
                  );
                  return;
                }
                const startStr = dayjs(values.start)
                  .utc()
                  .format("YYYY-MM-DDTHH:mm:ssZ");
                const endStr = dayjs(values.end)
                  .utc()
                  .format("YYYY-MM-DDTHH:mm:ssZ");
                const res = await getOrders(startStr, endStr);
                const orders = res.data.data.data ?? [];
                setReportData(orders);
                const csv = buildCsv(orders);
                if (csvUrl) URL.revokeObjectURL(csvUrl);
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                setCsvUrl(url);
                setCsvFileName(`orders_${startStr}_${endStr}.csv`);
                const total = res.data.data.meta.total ?? 0;
                message.success(
                  `Consulta realizada. Total de órdenes: ${total}`
                );
              } catch (err) {
                message.error("Error consultando órdenes. Intenta nuevamente.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Form.Item
              label="Fecha de inicio"
              name="start"
              rules={[
                { required: true, message: "Selecciona la fecha de inicio" },
              ]}
            >
              <DatePicker
                showTime={{ format: "HH:mm:ss" }}
                style={{ width: "100%" }}
                placeholder="Selecciona fecha y hora de inicio"
              />
            </Form.Item>
            <Form.Item
              label="Fecha de fin"
              name="end"
              dependencies={["start"]}
              rules={[
                { required: true, message: "Selecciona la fecha de fin" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue("start");
                    if (!start || !value) return Promise.resolve();
                    return dayjs(value).isAfter(dayjs(start))
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "La fecha de fin debe ser posterior a la de inicio"
                          )
                        );
                  },
                }),
              ]}
            >
              <DatePicker
                showTime={{ format: "HH:mm:ss" }}
                style={{ width: "100%" }}
                placeholder="Selecciona fecha y hora de fin"
              />
            </Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              {csvUrl ? (
                <a href={csvUrl} download={csvFileName}>
                  <Button type="primary">Descargar CSV</Button>
                </a>
              ) : (
                <Button htmlType="submit" loading={loading}>
                  Consultar órdenes
                </Button>
              )}
            </Space>
          </Form>
        </Modal>
      )}
    </div>
  );
};
