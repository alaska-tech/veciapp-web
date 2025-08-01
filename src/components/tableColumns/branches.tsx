import {
  BRANCH_IS_ACTIVE_LABELS,
  BRANCH_STATE_LABELS,
  BRANCH_TYPE_LABELS,
  VENDOR_IS_ACTIVE_LABELS,
} from "@/constants/labels";
import {
  Branch,
  weekDay,
  WEEKDAY_LABEL,
  weekDayType,
} from "@/constants/models";
import { PushpinOutlined } from "@ant-design/icons";
import {
  Descriptions,
  Space,
  TableColumnsType,
  Tag,
  Timeline,
  Typography,
  Image,
} from "antd";
import dayjs from "dayjs";
import { PhotoUploadModal } from "../forms/updateBranchPhotos";
import CardFlower from "../pure/CardFlower";
import { useState } from "react";
import { ImagePreviewCardFlower } from "../pure/ImagePreviewCardFlower";

export const branchesTableColumns: TableColumnsType<Branch> = [
  {
    title: "Nombre",
    key: "name",
    dataIndex: "name",
    render: (name, record) => {
      return (
        <>
          <Typography.Text>{name}</Typography.Text>
          <br />

          <Typography.Link
            style={{
              width: "100px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            href={`https://www.google.com/maps?q=${record.location.coordinates[1]},${record.location.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PushpinOutlined style={{ marginRight: 4 }} />
            {record.address}
          </Typography.Link>
        </>
      );
    },
  },
  {
    title: "Imágenes",
    key: "logo",
    dataIndex: "logo",
    render(value, record, index) {
      return (
        <Space wrap>
          <ImagePreviewCardFlower src={[value || "", ...record.images]} />
          <PhotoUploadModal branchId={record.id} />
        </Space>
      );
    },
  },
  {
    title: "Operacion",
    key: "id",
    width: "45%",
    minWidth: 150,
    render: (record: Branch) => {
      return (
        <Descriptions
          style={{ whiteSpace: "nowrap" }}
          column={{ xxl: 3, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}
          layout="vertical"
        >
          <Descriptions.Item label="Tipo de negocio">
            {BRANCH_TYPE_LABELS[record.businessType]}
          </Descriptions.Item>
          <Descriptions.Item label="Estado de activación">
            {BRANCH_IS_ACTIVE_LABELS[record.isActive.toString()]}
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
    title: "Historial de estado",
    key: "stateHistory",
    dataIndex: "stateHistory",
    width: "20%",
    minWidth: 200,
    render: (stateHistory: Branch["stateHistory"]) => {
      return (
        <Timeline
          mode="left"
          items={stateHistory.map((state, i) => ({
            children: dayjs(state.changedAt).format("D/M/ YYYY"),
            label: (
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "visible",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "80px",
                }}
              >
                {BRANCH_STATE_LABELS[state.state] || state.state}
              </span>
            ),
            color: "blue",
          }))}
        />
      );
    },
  },
];
