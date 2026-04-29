import React, { ReactElement, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppstoreAddOutlined } from "@ant-design/icons";
import {
  QUERY_KEY_PARAMETER,
  useParameterAction,
} from "@/actions/parameter.action";
import { App, Button, Col, Pagination, Row, Space, Typography } from "antd";
import { Parameter } from "@models";
import ParameterCard from "@/components/pure/ParameterCard";
import { useQueryClient } from "@tanstack/react-query";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Parámetros del sistema
        </Typography.Title>
        <Button href="/a/newParameter" icon={<AppstoreAddOutlined />} type="primary">
          Nuevo parámetro
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        {parametersQuery.data?.data.data.map((parameter, index) => (
          <Col xs={24} sm={12} xl={8} key={parameter?.id ?? `unavailable-${index}`}>
            <ParameterCard
              parameter={parameter}
              onClickOnSave={handleClickOnSave}
              onClickOnToggle={handleClickOnToggle}
            />
          </Col>
        ))}
      </Row>

      <Pagination
        onChange={(page, pageSize) => {
          setPagination({ ...pagination, current: page || 1, pageSize: pageSize || 10 });
        }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={parametersQuery.data?.data.meta.total || 0}
        showSizeChanger
        pageSizeOptions={[10, 20, 50]}
        style={{ alignSelf: "flex-end" }}
      />
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout> {page}</DashboardLayout>;
};
