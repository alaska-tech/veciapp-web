import { useProductServiceAction } from "@/actions/productservice.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Branch,
  ProductService,
  ProductServiceCategory,
  WEEKDAY_LABEL,
} from "@/constants/models";
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
  Form,
  App,
  Select,
} from "antd";
import Link from "next/link";
import React, { ReactElement, useState } from "react";
import { useBranchAction } from "@/actions/branch.action";
import ChangeProductStateModal from "@/components/changeProductStateModal";
import ChangeProductInventoryModal from "@/components/changeProductInventoryModal";
import { PhotoUploadModal } from "@/components/forms/updateProductServicePhotos";
import AsyncButton from "@/components/pure/AsyncButton";
import { ImagePreviewCardFlower } from "@/components/pure/ImagePreviewCardFlower";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_STATE_TAG,
  PRODUCT_TYPE_TAG,
} from "@/constants/labels";
import SearchBar, { SearchProps } from "@/components/pure/SearchBar";
import RenderBranch from "@/components/pure/RenderBranch";

type DataType = ProductService;
const searchFields: SearchProps[] = [
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
  const actions = useProductServiceAction();
  const deleteProduct = actions.deleteProductService();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { SearchComponent, search } = SearchBar({ searchFields });
  const productsQuery = actions.getProductServicesPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
    search: search.value
      ? {
          [search.fieldName]: search.value,
        }
      : {},
  });
  const branchActions = useBranchAction();
  const branchesQuery = branchActions.getBranchesById(
    productsQuery.data?.data.data.map((e) => e.branchId)
  );
  const { data: branchesData } = branchActions.getBranchesPaginated({
    limit: 0,
    page: 0,
  });
  const totalBranches = branchesData?.data.meta.total || 0;
  const columns: TableColumnsType<DataType> = [
    {
      title: "Tienda",
      key: "branchId",
      dataIndex: "branchId",
      render: (branchId: string) => {
        const vendorQuery = branchesQuery.find((queryResult) => {
          return queryResult.data?.data?.data?.id === branchId;
        });
        const { name = "", address = "" } =
          vendorQuery?.data?.data?.data || ({} as Branch);
        return (
          <RenderBranch
            branch={vendorQuery?.data?.data?.data || ({} as Branch)}
            href={`/a/branches/${branchId}?name=${name}`}
          />
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
      render(value: string, record, index) {
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
          <Link href={`/a/products/${record.id}?name=${record.name}`}>
            Detalles
          </Link>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "2",
                  label: (
                    <AsyncButton
                      onClick={() => {
                        deleteProduct.mutateAsync({ id: record.id });
                      }}
                      popConfirm
                      type="text"
                    >
                      Eliminar
                    </AsyncButton>
                  ),
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
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        {SearchComponent}
        <NewProductButton totalBranches={totalBranches} />
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

const NewProductButton = ({ totalBranches }: { totalBranches: number }) => {
  const { modal } = App.useApp();
  const actions = useBranchAction();
  const query = actions.getBranchesPaginated({
    limit: totalBranches,
    page: 0,
  });
  const router = useRouter();
  const form = Form.useFormInstance();
  const handleClick = () => {
    const modalRef = modal.info({
      title: "Escoja un tienda",
      okButtonProps: {
        style: {
          display: "none",
        },
      },
      closable: true,
      content: (
        <Form
          form={form}
          onFinish={(values) => {
            const [branchId, branchName] = values.branchId.split("/");
            router.push(
              `/a/products/byBranch/${branchId}/newProduct?name=${branchName}`
            );
            modalRef.destroy();
          }}
        >
          <Form.Item
            name="branchId"
            label="Tienda"
            rules={[{ required: true }]}
          >
            <Select
              options={query.data?.data.data.map((branch) => ({
                label: `${branch.name} (${branch.address})`,
                value: `${branch.id}/${branch.name}`,
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              popupMatchSelectWidth={false}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              float: "inline-end",
            }}
          >
            Escoger
          </Button>
        </Form>
      ),
    });
  };
  return (
    <Button
      type="default"
      style={{ float: "inline-end" }}
      icon={<PlusOutlined />}
      onClick={handleClick}
    >
      Nuevo producto o servicio
    </Button>
  );
};
