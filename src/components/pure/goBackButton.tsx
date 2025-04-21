import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const GoBackButton = () => {
  return (
    <Button
      type="link"
      onClick={() => window.history.back()}
      icon={<ArrowLeftOutlined />}
      style={{padding: 0}}
    >
      Volver a la página anterior
    </Button>
  );
};

export default GoBackButton;
