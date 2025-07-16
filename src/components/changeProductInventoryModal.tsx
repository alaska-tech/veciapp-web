import useAuthAction from "@/actions/auth.action";
import {
  QUERY_KEY_PRODUCTSERVICE,
  useProductServiceAction,
} from "@/actions/productservice.action";
import { EditOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";
import { useState } from "react";
import { FormElement } from "./forms/updateProductServiceInventory";
import { useQueryClient } from "@tanstack/react-query";

const ChangeProductStateModal = (props: {
  productId: string;
  currentValue: string;
}) => {
  const queryClient = useQueryClient();
  const actions = useProductServiceAction();
  const changeInventory = actions.updateProductServiceInventory();
  const authActions = useAuthAction();
  const user = authActions.userSession;
  const [open, setOpen] = useState(false);
  const numericalCurrentValue = Number.parseInt(props.currentValue);
  return (
    <>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Actualizar inventario"
        footer={null}
      >
        <FormElement
          onFinish={async (values) => {
            const quantityDifference = values.inventory - numericalCurrentValue;
            if (quantityDifference === 0) {
              return;
            }
            const isAdditionAction = quantityDifference > 0;
            const action = isAdditionAction ? "addition" : "subtraction";
            const quantity = Math.abs(quantityDifference);
            await changeInventory
              .mutateAsync({
                id: props.productId,
                body: {
                  action,
                  quantity,
                  updatedBy: user?.data?.email || "",
                },
              })
              .then(
                () => {
                  queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY_PRODUCTSERVICE],
                  });
                  setOpen(false);
                },
                () => {}
              );
          }}
          loading={changeInventory.isPending}
          initialValues={{ inventory: numericalCurrentValue }}
        />
      </Modal>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={() => setOpen(true)}
      ></Button>
    </>
  );
};

export default ChangeProductStateModal;
