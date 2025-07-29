import { BRANCH_STATE_LABELS } from "@/constants/labels";
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

export const branchesTableColumns: TableColumnsType<Branch> = [
  {
    title: "Sucursal",
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
    minWidth: 150,
    render: (record: Branch) => {
      return (
        <Descriptions
          style={{ whiteSpace: "nowrap" }}
          column={{ xxl: 3, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}
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
