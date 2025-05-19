import { useBranchAction } from "@/actions/branch.action";
import { getUserInfo } from "@/actions/localStorage.actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Branch,
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
  Tag,
} from "antd";
import Link from "next/link";
import React, { ReactElement } from "react";

type DataType = Branch;

const Users = () => {
  const user = getUserInfo();
  const actions = useBranchAction();
  const getBranchById = actions.getBranchesByVendorId(user?.foreignPersonId);
  const columns: TableColumnsType<DataType> = [
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
      title: "Operacion",
      key: "id",
      render: (record: Branch) => {
        return (
          <Descriptions>
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
                      if (!!hours && !!hours.open && !!hours.close) {
                        return (
                          <Tag key={day}>
                            {WEEKDAY_LABEL[day as keyof typeof WEEKDAY_LABEL]}:{" "}
                            {hours.open} - {hours.close}
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
        <Space split={<Divider type="vertical" />}>
          <Link href={`/(v)/branches/${record.id}`}>Edit</Link>
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
          href={`/v/branches/newBranch?vendorId=${user?.foreignPersonId}&name=${user?.fullName}`}
          icon={<AppstoreAddOutlined />}
        >
          Nueva tienda
        </Button>
      </Space>
      <Table<DataType>
        columns={columns}
        dataSource={getBranchById.data?.data}
        loading={getBranchById.isLoading}
        style={{
          overflow: "auto",
        }}
      />
    </div>
  );
};

export default Users;

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
