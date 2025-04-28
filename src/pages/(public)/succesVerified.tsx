import LandingPageLayout from "@/components/layout/LandingPageLayout";
import { LoadingOutlined } from "@ant-design/icons";
import { Typography, Spin } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const { Title, Text } = Typography;

const SuccessVerified = () => {
  const router = useRouter();
  const username = router.query.username || "Usuario";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.replace("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      gap: '2rem'
    }}>
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={100}
        height={100}
        priority
      />
      
      <Title level={2}>
        Bienvenido, {username}
      </Title>

      <Text>
        Todo listo, ahora puedes iniciar sesión, serás redireccionado en {countdown} segundos
      </Text>

      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </div>
  );
};

export default SuccessVerified;

SuccessVerified.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout>{page}</LandingPageLayout>;
};