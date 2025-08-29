import { App, Button, Form, FormProps, Input } from "antd";
import { ReactElement, useEffect, useCallback } from "react";
import LandingPageLayout from "@/components/layout/LandingPageLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoginOutlined } from "@ant-design/icons";
import useAuthAction from "@/actions/auth.action";
import { LOGGED_USER_INFO_KEY } from "@/constants/constants";
import {
  setRefreshToken,
  setToken,
  setUserInfo,
} from "@/actions/localStorage.actions";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export type LogInForm = {
  email: string;
  password: string;
};
const styles = {
  formItem: {
    flex: "1 1 600px",
    width: "100%",
    maxWidth: "600px",
  },
};

export default function Home() {
  const router = useRouter();
  const authActions = useAuthAction();
  const login = authActions.logIn();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const userSession = authActions.userSession;
  
  const navigateToRole = useCallback((role: string) => {
    if (role === "admin") {
      router.push("/a/home");
    } else if (role === "vendor") {
      router.push("/v/home");
    }
  }, [router]);

  useEffect(() => {
    const role = userSession.data?.role;
    if (role) {
      navigateToRole(role);
    }
  }, [userSession.data, navigateToRole]);

  const onFinish: FormProps<LogInForm>["onFinish"] = (values) => {
    login.mutateAsync({ body: values }).then(
      (response) => {
        const { token, user } = response.data.data;
        setUserInfo(user);
        setToken(token);
        setRefreshToken(user.refreshToken);
        queryClient.invalidateQueries({ queryKey: [LOGGED_USER_INFO_KEY] });
        if (user.role !== "admin" && user.role !== "vendor") {
          message.error(
            "Usted no cuenta con los permisos suficientes para acceder a esta sección",
            6
          );
          return;
        }
      },
      () => {}
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        textAlign: "start",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: 1500,
      }}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          width: "100%",
          maxWidth: 400,
        }}
        initialValues={{
          email: "julianangulop@gmail.com",
          password: "123456",
        }}
      >
        <Form.Item<LogInForm>
          name="email"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            placeholder="Ejemplo@email.com"
            style={{ width: 320, height: 44, fontSize: 16, textAlign: "left" }}
          />
        </Form.Item>

        <Form.Item<LogInForm>
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password
            placeholder="Contraseña"
            style={{ width: 320, height: 44, fontSize: 16, textAlign: "left" }}
          />
        </Form.Item>
        <Form.Item style={{ width: 320, textAlign: "center", marginBottom: 0 }}>
          <Link href={"/(auth)/forgotPassword"} style={{ fontSize: 14 }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </Form.Item>
        <Form.Item style={{ width: 320, marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<LoginOutlined />}
            loading={login.isPending}
            style={{
              width: "100%",
              height: 44,
              fontSize: 16,
              borderRadius: 22,
            }}
          >
            Entrar al panel
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout> {page}</LandingPageLayout>;
};
