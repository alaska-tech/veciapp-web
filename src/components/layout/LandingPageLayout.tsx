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
  const isScreenSmall = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768; // Adjust the breakpoint as needed
    }
    return false;
  };
  const [isSmallScreen, setIsSmallScreen] = React.useState(isScreenSmall());
  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(isScreenSmall());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: isSmallScreen ? "column-reverse" : "row",
      }}
    >
      <Content
        style={{
          placeItems: "center",
          alignContent: "center",
          padding: "2rem",
          gap: "0.5rem",
          height: isSmallScreen ? "90vh" : "inherit",
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
            Regresar a la página anterior
          </Button>
        )}
        <AutoTitle />
        <div style={{ flex: 1 }}>{props.children}</div>
      </Content>

      <div
        style={
          isSmallScreen
            ? {
                borderRadius: "0 0 0 15%",
                height: "10vh",
                width: "100vw",
                background: "linear-gradient(to bottom, #FFF5B0, #FFD100)",
                display: "grid",
                placeItems: "center",
              }
            : {
                borderRadius: "0 0 0 15%",
                width: "40vw",
                height: "100vh",
                background: "linear-gradient(to bottom, #FFF5B0, #FFD100)",
                display: "grid",
                placeItems: "center",
              }
        }
      >
        <Image
          src={"/images/logo.png"}
          alt={"veciapp-logo"}
          width={100}
          height={100}
          style={{
            minHeight: 30,
            height: isSmallScreen?'8vh':"180px",
            width: "auto",
            objectFit: "cover",
          }}
        ></Image>
      </div>
    </Layout>
  );
};

export default LandingPageLayout;

const titles: Record<string, [string, string, string]> = {
  "/": [
    "Acceda al panel de administración de Veciapp",
    "Inicio de sesión",
    "Ingresa tu correo y contraseña",
  ],
  "/(auth)/forgotPassword": [
    "Recupera el acceso a tu cuenta",
    "Olvidé mi contraseña",
    "Ingresa el correo asociado a tu constraseña",
  ],
  "/(auth)/createNewPassword": [
    "Restablecer contraseña",
    "Crear nueva contraseña",
    "Ingresa tu nueva contraseña para continuar",
  ],
  "/access-denied": ["", "Acceso denegado", "No tienes acceso a esta página"],
  "/(public)/validateAccount": [
    "",
    "Ingresa tu codigo",
    "Ingresa el código unico que te asigno la fundación Maleua",
  ],
  "/(public)/setPassAccount": [
    "",
    "Bienvenido cachón",
    "Todo listo, ahora crea tu contraseña para acceder a tu cuenta",
  ]
};
const AutoTitle = () => {
  const router = useRouter();
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {titles[router.pathname]?.at(0)}
      </Typography.Text>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {titles[router.pathname]?.at(1)}
      </Typography.Title>
      <Typography.Text type="secondary">
        {titles[router.pathname]?.at(2)}
      </Typography.Text>
    </div>
  );
};
