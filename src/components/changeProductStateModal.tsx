import useAuthAction from "@/actions/auth.action";
import { useProductServiceAction } from "@/actions/productservice.action";
import { EditOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";
import { useState } from "react";
import FormElement from "./forms/updateProductServiceState";
import { motion } from "framer-motion";

const ChangeProductStateModal = (props: {
  productId: string;
  currentState: string;
}) => {
  const actions = useProductServiceAction();
  const changeStatus = actions.updateProductServiceState();
  const authActions = useAuthAction();
  const user = authActions.userSession;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Actualizar estado"
        footer={null}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <FormElement
            onFinish={async (values) => {
              await changeStatus
                .mutateAsync({
                  id: props.productId,
                  body: {
                    state: values.state || "",
                    updatedBy: user?.data?.email || "",
                  },
                })
                .then(
                  () => {
                    setOpen(false);
                  },
                  () => {}
                );
            }}
            loading={changeStatus.isPending}
            initialValues={{ state: props.currentState }}
          />
        </motion.div>
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