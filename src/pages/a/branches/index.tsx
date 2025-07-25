import { useBranchAction } from "@/actions/branch.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import { useVendorAction } from "@/actions/vendor.action";
import { PhotoUploadModal } from "@/components/forms/updateBranchPhotos";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AsyncButton from "@/components/pure/AsyncButton";
import {
  Branch,
  Vendor,
  weekDay,
  WEEKDAY_LABEL,
  weekDayType,
} from "@/constants/models";
import { AppstoreAddOutlined } from "@ant-design/icons";
import {
  Table,
  Space,
  Button,
  TableColumnsType,
  Dropdown,
  Divider,
  Descriptions,
  Image,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import React, { ReactElement, useState } from "react";

type DataType = Branch;

const Users = () => {
  const user = getUserInfo();
  const actions = useBranchAction();
  const deleteBranch = actions.deleteBranch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const branchQuery = actions.getBranchesPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
  });
  const vendorActions = useVendorAction();
  const vendorQueries = vendorActions.getVendorsById(
    branchQuery.data?.data.data.map((branch) => branch.vendorId)
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Gerente",
      key: "vendorId",
      dataIndex: "vendorId",
      render: (value) => {
        const vendorQuery = vendorQueries.find((queryResult) => {
          return queryResult.data?.data.data.id === value;
        });
        const { fullName = "", email = "" } =
          vendorQuery?.data?.data.data || ({} as Vendor);
        return (
          <Typography.Link
            style={{ width: "100px" }}
            ellipsis
            href={`/a/vendors/${value}?name=${fullName}`}
          >
            {fullName}
            {", "}
            <br />
            {email || "Desconocido"}
          </Typography.Link>
        );
      },
    },
    {
      title: "Sucursal",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Dirección",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Imagen",
      key: "logo",
      dataIndex: "logo",
      render(value, record, index) {
        return (
          <Space wrap>
            <Image.PreviewGroup items={[value || "", ...record.images]}>
              <Image
                src={value || ""}
                fallback="data:image/png;base64,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"
                width={75}
                height={75}
              ></Image>
            </Image.PreviewGroup>
            <PhotoUploadModal branchId={record.id} />
          </Space>
        );
      },
    },
    {
      title: "Operacion",
      key: "id",
      width: "45%",
      render: (record: Branch) => {
        return (
          <Descriptions
            style={{ whiteSpace: "nowrap" }}
            column={{ xxl: 4, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}
            layout="vertical"
          >
            <Descriptions.Item label="Tipo de negocio">
              {record.businessType}
            </Descriptions.Item>
            <Descriptions.Item label="Recogida en tienda">
              {record.isPickupAvailable ? <Tag>Si</Tag> : <Tag>No</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Domicilio">
              {record.isDeliveryAvailable ? <Tag>Si</Tag> : <Tag>No</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Formas de pago">
              <Space wrap>
                {record.availablePaymentMethods.map((e) => {
                  return <Tag key={e}>{e}</Tag>;
                })}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Horario de atención">
              <Space direction="vertical">
                {record.operatingHours ? (
                  Object.entries(record.operatingHours)
                    .sort(([dayA], [dayB]) => {
                      return (
                        weekDay.indexOf(dayA as weekDayType[number]) -
                        weekDay.indexOf(dayB as weekDayType[number])
                      );
                    })
                    .map(([day, hours]) => {
                      if (!!hours && !!hours[0] && !!hours[1]) {
                        return (
                          <Tag key={day}>
                            {WEEKDAY_LABEL[day as keyof typeof WEEKDAY_LABEL]}:{" "}
                            {hours[0]} - {hours[1]}
                          </Tag>
                        );
                      }
                      return null;
                    })
                ) : (
                  <Tag color="warning">Sin horario registrado</Tag>
                )}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} wrap>
          <Link
            href={`/a/products/byBranch/${record.id}?vendorId=${record.vendorId}&name=${record.name}`}
          >
            Inventario
          </Link>
          <Link href={`/a/branches/${record.id}?name=${record.name}`}>
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
                        deleteBranch.mutateAsync({ id: record.id });
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
      <Space style={{ width: "100%", justifyContent: "flex-end" }}></Space>
      <Table<DataType>
        columns={columns}
        dataSource={branchQuery.data?.data.data}
        loading={branchQuery.isLoading}
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
          total: branchQuery.data?.data.meta.total || 0,
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
