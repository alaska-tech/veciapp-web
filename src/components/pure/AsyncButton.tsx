import {
  Button,
  ButtonProps,
  Popconfirm,
  PopconfirmProps,
} from "antd";
import { useState } from "react";
import { motion } from "framer-motion";

const AsyncButton = (
  props: ButtonProps & {
    onClick?:
      | ButtonProps["onClick"]
      | (() => Promise<void>);
    popConfirm?: boolean | PopconfirmProps;
  },
) => {
  const { onClick, popConfirm, ...rest } = props;
  const [loading, setLoading] = useState(false);
  const handleClick = async (e: any) => {
    if (onClick === undefined) return;

    setLoading(true);
    try {
      await onClick(e);
    } finally {
      setLoading(false);
    }
  };
  if (popConfirm) {
    const popConfirmProps =
      typeof popConfirm === "boolean" ? {} : popConfirm;
    return (
      <Popconfirm
        title="Are you sure?"
        okText="Yes"
        cancelText="No"
        {...popConfirmProps}
        onConfirm={handleClick}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{ border: "none", background: "none", padding: 0, width: "100%" }}
        >
          <Button
            {...rest}
            loading={loading}
            disabled={loading || rest.disabled}
          >
            {rest.children}
          </Button>
        </motion.button>
      </Popconfirm>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{ border: "none", background: "none", padding: 0, width: "100%" }}
    >
      <Button
        {...rest}
        loading={loading}
        disabled={loading || rest.disabled}
        onClick={handleClick}
      >
        {rest.children}
      </Button>
    </motion.button>
  );
};
export default AsyncButton;
