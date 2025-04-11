import { Button, Layout, Typography } from "antd";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ArrowLeftOutlined } from "@ant-design/icons";

const LandingPageLayout = (props: {
  children: React.ReactNode;
  backButton?: boolean;
}) => {
  const { Content } = Layout;

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Content
        style={{
          display: "grid",
          placeItems: "center",
          alignContent: "center",
          gap: "1.5rem",
        }}
      >
        {props.backButton && (
          <Button
            type="text"
            onClick={() => {
              window.history.back();
            }}
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>
        )}
        <AutoTitle />
        {props.children}
      </Content>

      <div
        style={{
          borderRadius: "0 0 0 15%",
          width: "40vw",
          height: "100vh",
          background: "linear-gradient(to bottom, #FFF5B0, #FFD100)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Image
          src={"/images/logo.png"}
          alt={"veciapp-logo"}
          width={100}
          height={100}
          style={{
            minHeight: 80,
            height: "calc(100vw * 0.145)",
            width: "auto",
            objectFit: "cover",
          }}
        ></Image>
      </div>
    </Layout>
  );
};

export default LandingPageLayout;

const titles: Record<string, [string, string]> = {
  "/(auth)/forgotPassword": [
    "Recuperar contraseña",
    "Aqui puedes recuperar tu constraseña",
  ],
  '/access-denied':['Acceso denegado','No tienes acceso a esta página'],
};
const AutoTitle = () => {
  const router = useRouter();
  return (
    <div>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {titles[router.pathname]?.at(0)}
      </Typography.Title>
      <Typography.Text type="secondary">
        {titles[router.pathname]?.at(1)}
      </Typography.Text>
    </div>
  );
};
