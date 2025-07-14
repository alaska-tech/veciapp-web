import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { LoadingOutlined } from "@ant-design/icons";
import { Typography, Spin, Button } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const { Title, Text } = Typography;

const SuccessVerified = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = 'veciapp://';
      } else {
        router.replace("/");
      }
    }, 12000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Title level={4}>Todo listo</Title>
      <Text>
        Muchas gracias, ahora seras dirigido al inicio de sesión en {countdown}{" "}
        segundos.
      </Text>
      <Button loading={true} block type="primary" size="large" />
    </div>
  );
};

export default SuccessVerified;

SuccessVerified.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout>{page}</LandingPageLayout>;
};
