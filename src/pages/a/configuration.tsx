import React, { ReactElement } from "react";
import DashboardLayout2 from "@/components/layout/DashboardLayout";
import { AppstoreAddOutlined } from "@ant-design/icons";
import {
  QUERY_KEY_PARAMETER,
  useParameterAction,
} from "@/actions/parameter.action";
import { App, Button, Space } from "antd";
import { Parameter } from "@models";
import ParameterCard from "@/components/pure/ParameterCard";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_PARAMETER_NAMES = [
  "salesComission",
  "systemCurrency",
  "generalUserState",
  "productCategories",
];
const Index = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const parameterActions = useParameterAction();
  const parameterQueries = parameterActions.getParametersByName(
    DEFAULT_PARAMETER_NAMES
  ); //TODO: El value de los parameters esta llegando siempre como string a pesar de que lo envio como true o false o number, revisar el endpoint
  /*   const parametersQuery = parameterActions.getParameters();
  const { parameters: data, count } = parametersQuery?.data?.data ?? {
    parameters: [],
    count: 0,
  }; */
  const updateParameter = parameterActions.updateParameter();
  const toggleIsActive = parameterActions.toggleIsActive({
    onSuccess: (data, variables, context: any) => {
      queryClient.setQueryData([QUERY_KEY_PARAMETER, "byName", context?.name], {
        data: {
          status: "Success",
          data: data.data.data,
          error: null,
        },
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_PARAMETER, "byName", context?.name],
        exact: true,
      });
      queryClient.setQueryData([QUERY_KEY_PARAMETER + "s"], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedParameters = oldData.data.parameters.map(
          (param: Parameter) =>
            param.id === variables.id ? { ...param, ...data.data.data } : param
        );

        return {
          ...oldData,
          data: {
            ...oldData.data,
            parameters: updatedParameters,
          },
        };
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_PARAMETER + "s"],
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
        name: parameter.name,
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
                loading={updateParameter.isPending || toggleIsActive.isPending}
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
