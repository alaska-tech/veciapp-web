import { useProductServiceAction } from "@/actions/productservice.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Branch, ProductService, WEEKDAY_LABEL } from "@/constants/models";
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
import { useBranchAction } from "@/actions/branch.action";
import ChangeProductStateModal from "@/components/changeProductStateModal";
import ChangeProductInventoryModal from "@/components/changeProductInventoryModal";
import { PhotoUploadModal } from "@/components/forms/updateProductServicePhotos";
import { ImagePreviewCardFlower } from "@/components/pure/ImagePreviewCardFlower";

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
  const actions = useProductServiceAction();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const productsQuery = actions.getProductServicesPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    vendorId: user?.id,
  });
  const branchActions = useBranchAction();
  const branchesQuery = branchActions.getBranchesById(
    productsQuery.data?.data.data.map((e) => e.branchId)
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Tienda",
      key: "branchId",
      dataIndex: "branchId",
      render: (branchId: string) => {
        const vendorQuery = branchesQuery.find((queryResult) => {
          return queryResult.data?.data.data.id === branchId;
        });
        const { name = "", address = "" } =
          vendorQuery?.data?.data.data || ({} as Branch);
        return (
          <Typography.Link
            style={{ width: "100px" }}
            ellipsis
            href={`/v/branches/${branchId}?name=${name}`}
          >
            {name}
            {", "}
            <br />
            {address || "Desconocido"}
          </Typography.Link>
        );
      },
    },
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
      key: "logo",
      dataIndex: "logo",
      render(value, record, index) {
        return (
          <Space wrap>
            <ImagePreviewCardFlower src={[value || "", ...record.images]} />
            <PhotoUploadModal productServiceId={record.id} />
          </Space>
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
            Detalles
          </Link>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "2",
                  label: "Eliminar",
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="link">Más...</Button>
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
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
