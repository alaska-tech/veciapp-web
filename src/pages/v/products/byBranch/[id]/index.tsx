import { useProductServiceAction } from "@/actions/productservice.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ProductService,
  ProductServiceCategory,
  productServiceState,
  ProductServiceType,
  WEEKDAY_LABEL,
} from "@/constants/models";
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
import { PhotoUploadModal } from "@/components/forms/updateProductServicePhotos";
import { ImagePreviewCardFlower } from "@/components/pure/ImagePreviewCardFlower";
import SearchBar, { SearchFieldProps } from "@/components/pure/SearchBar";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_STATE_TAG,
  PRODUCT_TYPE_TAG,
} from "@/constants/labels";

type DataType = ProductService;
const searchFields: SearchFieldProps[] = [
  {
    label: "Nombre o descripción",
    fieldName: "search",
    type: "text",
  },
  {
    label: "Estado",
    fieldName: "state",
    type: "options",
    options: Object.entries(productServiceState).map(([key, value]) => ({
      label: PRODUCT_STATE_TAG[value],
      value: value,
    })),
  },
  {
    label: "Tipo",
    fieldName: "type",
    type: "options",
    options: Object.entries(ProductServiceType).map(([key, value]) => ({
      label: PRODUCT_TYPE_TAG[value],
      value: value,
    })),
  },
  {
    label: "Categoría",
    fieldName: "categoryId",
    type: "options",
    options: Object.entries(ProductServiceCategory).map(([key, value]) => ({
      label: PRODUCT_CATEGORY_LABELS[value],
      value: value,
    })),
  },
];
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
  const { SearchComponent, search } = SearchBar({ searchFields });
  const productsQuery = actions.getProductServicesByBranchIdPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    branchId: id as string,
    search: search.value
      ? {
          [search.fieldName]: search.value,
        }
      : {},
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
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        {SearchComponent}
        <Button
          href={`/v/products/byBranch/${id}/newProduct?name=${branchQuery.data?.name}`}
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
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
