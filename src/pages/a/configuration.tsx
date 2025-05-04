import React, { ReactElement } from "react";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useParameterAction } from "@/actions/parameter.action";
import { Button, Space } from "antd";
import { Parameter } from "@models";
import ParameterCard from "@/components/pure/ParameterCard";

const DEFAULT_PARAMETER_NAMES = [
  "salesComission",
  "systemCurrency",
  "generalUserState",
  "productCategories",
];
const Index = () => {
  const parameterActions = useParameterAction();
  const parameterQueries = parameterActions.getParametersByName(
    DEFAULT_PARAMETER_NAMES
  );
  /*   const parametersQuery = parameterActions.getParameters();
  const { parameters: data, count } = parametersQuery?.data?.data ?? {
    parameters: [],
    count: 0,
  }; */
  const updateParameter = parameterActions.updateParameter();
  const toggleIsActive = parameterActions.toggleIsActive();
  const handleClickOnSave = async (
    value: string | number | boolean,
    parameter: Parameter
  ) => {
    let mappedValue = value;
    if (parameter.type === "number") {
      mappedValue = parseFloat(value as string);
    }
    if (parameter.type === "json") {
      mappedValue = JSON.stringify(value);
    }
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
      });
    } catch (error) {
      console.error("Error updating parameter:", error);
    }
  };
  return (
    <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button href="/a/newParameter" icon={<AppstoreAddOutlined />}>
          Nuevo parámetro
        </Button>
      </Space>
      <Space wrap style={{ gap: "1rem" }}>
        {parameterQueries
          .map((queryResult) => {
            const data = queryResult.data?.data.data;
            if (!data) return null;
            return data;
          })
          .filter((e) => {
            return e !== null;
          })
          .map((parameter: Parameter) => (
            <div key={parameter.id}>
              <ParameterCard
                parameter={parameter}
                onClickOnSave={handleClickOnSave}
                onClickOnToggle={handleClickOnToggle}
              />
            </div>
          ))}
      </Space>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
