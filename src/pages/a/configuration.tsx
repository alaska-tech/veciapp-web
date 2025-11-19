import React, { ReactElement, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppstoreAddOutlined } from "@ant-design/icons";
import {
  QUERY_KEY_PARAMETER,
  useParameterAction,
} from "@/actions/parameter.action";
import { App, Button, Pagination, Space } from "antd";
import { Parameter } from "@models";
import ParameterCard from "@/components/pure/ParameterCard";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "antd/lib";

const DEFAULT_PARAMETER_NAMES = [
  "comission", //number
  "currency2", //string
  "userState", //boolean
  "categories", //json
];
const Index = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const parameterActions = useParameterAction();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const parametersQuery = parameterActions.getParametersPaginated({
    limit: pagination.pageSize,
    page: pagination.current - 1,
  });

  const updateParameter = parameterActions.updateParameter();
  const toggleIsActive = parameterActions.toggleIsActive({
    onSuccess: (data, variables, context: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_PARAMETER],
      });
      message.success({
        content: `Parámetro ${
          data.data.data.isActive ? "activado" : "desactivado"
        } correctamente`,
        duration: 4,
      });
    },
  });
  const handleClickOnSave = async (
    value: string | number | boolean,
    parameter: Parameter
  ) => {
    const mappedValue: Parameter["value"] = JSON.stringify(value);
    try {
      await updateParameter.mutateAsync({
        id: parameter.id,
        body: { value: mappedValue },
      });
    } catch (error) {
      console.error("Error updating parameter:", error);
    }
  };
  const handleClickOnToggle = async (parameter: Parameter) => {
    try {
      await toggleIsActive.mutateAsync({
        id: parameter.id,
        name: parameter.name,
      });
    } catch (error) {
      console.error("Error updating parameter:", error);
    }
  };
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button href="/a/newParameter" icon={<AppstoreAddOutlined />}>
          Nuevo parámetro
        </Button>
      </Space>
      <Pagination
        onChange={(page, pageSize) => {
          setPagination({
            ...pagination,
            current: page || 1,
            pageSize: pageSize || 2,
          });
        }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={parametersQuery.data?.data.meta.total || 0}
        showSizeChanger={true}
        pageSizeOptions={[10, 20, 50]}
      />
      <Space wrap style={{ gap: "1rem" }}>
        {parametersQuery.data?.data.data.map((parameter, index) => {
          if (!parameter) {
            return (
              <Card
                style={{ textAlign: "center" }}
                key={`unavailable-${index}`}
              >
                <p>El parámetro no esta disponible</p>
              </Card>
            );
          }
          return (
            <ParameterCard
              parameter={parameter}
              onClickOnSave={handleClickOnSave}
              onClickOnToggle={handleClickOnToggle}
              key={parameter.id}
            />
          );
        })}
      </Space>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
