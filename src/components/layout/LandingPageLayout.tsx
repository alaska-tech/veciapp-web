import { Layout } from "antd";
import React from "react";
import Image from "next/image";

const LandingPageLayout = (props: { children: React.ReactNode }) => {
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
        }}
      >
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
