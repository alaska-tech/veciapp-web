import { Form, Input, InputNumber, Radio, Select } from "antd";
import React from "react";
import { ProductService } from "@models";
import FormWrapper from "./formWrapper";
import { getUserInfo } from "@/actions/localStorage.actions";
import { useBranchAction } from "@/actions/branch.action";

type productServiceWithAuxProps = ProductService;

function parseInitialValues(values: ProductService) {
  return { ...values };
}
export const FormElement = <T extends productServiceWithAuxProps>(props: {
  onFinish?: (values: T) => Promise<void>;
  loading?: boolean;
  initialValues?: T;
}) => {
  const hasInitialValues: boolean = !!props.initialValues;
  const user = getUserInfo();
  const branchActions = useBranchAction();
  const branchesQuery = branchActions.getBranchs();
  const handleFinish = async (values: T) => {
    const { ...rest } = values;
    const mappedValues = {
      ...rest,
    } as T;
    if (props.onFinish) {
      await props.onFinish(mappedValues);
    }
  };

  return (
    <FormWrapper
      formName={"newProductService"}
      onFinish={handleFinish}
      initialValues={
        hasInitialValues
          ? parseInitialValues(props.initialValues || ({} as ProductService))
          : {
              prefix: "57",
              password: "Vcapp20251",
            }
      }
      requiredMark={false}
      routeTo={
        user?.role === "admin"
          ? "/a/branches"
          : user?.role === "vendor"
          ? "/v/branches"
          : undefined
      }
      loading={props.loading}
      preserveDataInCache={!hasInitialValues}
      highligthOnChange={hasInitialValues}
    >
      {(formInstance) => (
        <div>
          <Form.Item
            name="name"
            label="Nombre del producto"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled={hasInitialValues} />
          </Form.Item>
          <Form.Item
            name="branchId"
            label="Tienda"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={branchesQuery.data?.data.data.map((branch) => {
                return { label: branch.name, value: branch.id };
              })}
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Categoria"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group
              options={[
                {
                  label: "Cosmetica",
                  value: "cosmetics",
                },
                { label: "Comida", value: "food" },
                { label: "Belleza y estetica", value: "beauty" },
                { label: "Confecciones", value: "confections" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label="Tipo"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group
              options={[
                {
                  label: "Producto",
                  value: "product",
                },
                { label: "Servicio", value: "service" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripcion"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="shortDescription"
            label="Descripcion corta"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Precio"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="inventory"
            label="Cantidad disponible"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </div>
      )}
    </FormWrapper>
  );
};
export default FormElement;
