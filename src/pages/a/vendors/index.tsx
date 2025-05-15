import { QUERY_KEY_VENDOR, useVendorAction } from "@/actions/vendor.action";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import { Vendor } from "@/constants/models";
import {
  CheckCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Dropdown,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Link from "next/link";
import React, { ReactElement, useState } from "react";

const VENDOR_STATUS_TAG_PROPS = {
  created: {
    props: {},
    text: "Creado",
  },
  verified: {
    props: {
      icon: <CheckCircleOutlined />,
      color: "success",
    },
    text: "Verificado",
  },
  suspended: {
    props: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
    },
    text: "Suspendido",
  },
};

const getVendorStatusTagProps = (status: Vendor["state"]) => {
  return (
    VENDOR_STATUS_TAG_PROPS[status] || {
      props: {},
      text: "Desconocido",
    }
  );
};
const Users = () => {
  const vendorActions = useVendorAction();
  const vendorQuery = vendorActions.getVendors();
  const queryClient = useQueryClient();
  const columns: TableColumnsType<Vendor> = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefono",
      dataIndex: "cellphone",
      key: "cellphone",
    },
    {
      title: "Estado",
      dataIndex: "state",
      key: "state",
      render: (state) => {
        const { text, props } = getVendorStatusTagProps(state);
        return <Tag {...props}>{text}</Tag>;
      },
    },
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_text, record) => (
        <Space split={<Divider type="vertical" />}>
          <a href={`/a/vendors/${record.id}?name=${record.fullName}`}>
            Detalles
          </a>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <Link
                      href={`/a/branches/newBranch?vendorId=${record.id}&name=${record.fullName}`}
                    >
                      Crear tienda
                    </Link>
                  ),
                },
                {
                  key: "2",
                  danger: true,
                  label: (
                    <DeleteVendorButton
                      courseId={record.id}
                      onSuccess={() => {
                        queryClient.invalidateQueries({
                          queryKey: [QUERY_KEY_VENDOR + "s"],
                        });
                      }}
                    />
                  ),
                },
              ],
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Opciones
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button href="/a/vendors/newVendor" icon={<PlusOutlined />}>
          Crear nuevo proveedor
        </Button>
      </Space>
      <Table<Vendor>
        columns={columns}
        dataSource={vendorQuery.data?.data?.data}
        loading={vendorQuery.isLoading}
        style={{
          overflow: "auto",
        }}
      />
    </div>
  );
};

export default Users;

Users.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
interface deleteCourseProps {
  courseId: string;
  onSuccess?: (values: any) => void;
}
const DeleteVendorButton = ({ courseId, onSuccess }: deleteCourseProps) => {
  const vendorActions = useVendorAction();
  const deleteVendor = vendorActions.deleteVendor();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await deleteVendor.mutateAsync({ id: courseId }).then(
      (res) => {
        if (onSuccess) {
          onSuccess(res);
        }
        setOpen(false);
        setConfirmLoading(false);
      },
      () => {}
    );
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Popconfirm
      title={`¿Estás seguro?`}
      description="Esta acción no se puede deshacer"
      open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      cancelButtonProps={{ disabled: confirmLoading }}
      onCancel={handleCancel}
    >
      <div onClick={showPopconfirm}>Eliminar</div>
    </Popconfirm>
  );
};
