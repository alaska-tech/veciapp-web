import { useProductServiceAction } from "@/actions/productservice.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProductService, WEEKDAY_LABEL } from "@/constants/models";
import { PlusOutlined } from "@ant-design/icons";
import {
  Table,
  Space,
  Button,
  TableColumnsType,
  Dropdown,
  Divider,
  Tag,
  Image,
  Typography,
} from "antd";
import Link from "next/link";
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { useBranchAction } from "@/actions/branch.action";
import ChangeProductStateModal from "@/components/changeProductStateModal";
import ChangeProductInventoryModal from "@/components/changeProductInventoryModal";

type DataType = ProductService;
const PRODUCT_TYPE_TAG: Record<string, any> = {
  product: (
    <Tag bordered={false} color="geekblue">
      Producto
    </Tag>
  ),
  service: (
    <Tag bordered={false} color="magenta">
      Servicio
    </Tag>
  ),
};
const PRODUCT_STATE_TAG: Record<string, any> = {
  available: (
    <Tag bordered={false} color="blue">
      Disponible
    </Tag>
  ),
  unavailable: (
    <Tag bordered={false} color="default">
      No disponible
    </Tag>
  ),
};
const Users = () => {
  const user = getUserInfo();
  const router = useRouter();
  const { id } = router.query;
  const actions = useProductServiceAction();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const branchActions = useBranchAction();
  const productsQuery = actions.getProductServicesPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    branchId: id as string,
  });
  const branchQuery = branchActions.getBranchById(id as string);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Nombre",
      key: "name",
      dataIndex: "name",
      render(value, record, index) {
        const typeTag = PRODUCT_TYPE_TAG[record.type] || null;
        return (
          <Space wrap>
            {typeTag}
            {value}
            <Tag>{record.categoryId}</Tag>
          </Space>
        );
      },
    },
    {
      title: "Imagen",
      key: "mainImage",
      dataIndex: "mainImage",
      render(value, record, index) {
        return (
          <Image.PreviewGroup items={[value, ...record.images]}>
            <Image
              src={value}
              fallback="data:image/png;base64,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"
              width={75}
              height={75}
            ></Image>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: "Horarios disponibles",
      key: "serviceScheduling",
      dataIndex: "serviceScheduling",
      render(value: ProductService["serviceScheduling"], record, index) {
        return (
          <Space direction="vertical" size="small">
            {Object.entries(value?.availableHours ?? {}).map(([day, hours]) => {
              const isOpen = hours.open !== "00:00" && hours.close !== "00:00";
              return (
                <>
                  {isOpen ? (
                    <Tag key={day}>
                      {WEEKDAY_LABEL[day as keyof typeof WEEKDAY_LABEL]}{" "}
                      {hours.open} - {hours.close}
                    </Tag>
                  ) : null}
                </>
              );
            })}
            {!value?.availableHours && (
              <Typography.Text type="secondary">No aplica</Typography.Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Precio",
      key: "finalPrice",
      dataIndex: "finalPrice",
      render: (value: string, record, index) => {
        return <>{Number(value).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Inventario",
      key: "inventory",
      dataIndex: "inventory",
      render(value, record, index) {
        return (
          <Space wrap>
            {value}
            <ChangeProductInventoryModal
              productId={record.id}
              currentValue={value}
            />
          </Space>
        );
      },
    },
    {
      title: "Estado",
      key: "state",
      dataIndex: "state",
      render(value, record, index) {
        const stateTag = PRODUCT_STATE_TAG[value] || null;
        return (
          <Space wrap>
            {stateTag}
            <ChangeProductStateModal
              productId={record.id}
              currentState={value}
            />
          </Space>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Link href={`/v/products/${record.id}?name=${record.name}`}>
            Editar
          </Link>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "2",
                  label: "Delete",
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="link">More...</Button>
          </Dropdown>
        </Space>
      ),
    },
  ];
  if (!user) {
    return null;
  }
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button
          href={`/v/branches/${id}/products/newProduct?name=${branchQuery.data?.name}`}
          icon={<PlusOutlined />}
        >
          Nuevo producto o servicio
        </Button>
      </Space>
      <Table<DataType>
        columns={columns}
        dataSource={productsQuery.data?.data.data}
        loading={productsQuery.isLoading}
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
          total: productsQuery.data?.data.meta.total || 0,
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

export default Users;

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
