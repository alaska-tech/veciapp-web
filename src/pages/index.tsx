import { App, Button, Form, FormProps, Input, Modal, Typography } from "antd";
import { ReactElement } from "react";
import LandingPageLayout from "@/components/layout/LandingPageLayout";
import Link from "next/link";
import { useRouter } from "next/router";

export type LogInForm = {
  email: string;
  password: string;
};
type FieldType = LogInForm;
export default function Home() {
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = () => {
    router.push("/(admin)/home");
    //login.mutateAsync({ body: values });
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] =
    (errorInfo) => {
      router.push("/(admin)/home");

      console.log("Failed:", errorInfo);
    };
  return (
    <main style={{ textAlign: "center" }}>
      <Typography.Title level={3}>Login</Typography.Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 1500 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            //loading={login.isPending}
            block
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
      <br />
      <ForgotPasswordButton />
      <br />
      <SignupButton />
      <hr
        style={{
          margin: "15px 0",
          border: "1px solid #f0f0f0",
        }}
      />
      <Link href="/contact">
        <Typography>Contact Us</Typography>
      </Link>
    </main>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout> {page}</LandingPageLayout>;
};

interface FormValues {
  email: string;
  code: string;
}
const ForgotPasswordButton = () => {
  const [formInstance] = Form.useForm();
  let modalRef: { destroy: () => void } | null = null;
  const verifyCode: any = () => { }
  /* useMutation({
    mutationFn: async (values: FormValues) => {
      const answer = await axios.post(
        `${api_auth_base_url}/send-email`,
        {
          email: values.email,
        },
      );
      return answer;
    },
    onSuccess: () => {
      modalRef?.destroy();
      notification.success({
        message: "Success",
        description: "An email was sent to your inbox",
        duration: 5,
      });
    },
    onError: () => {
      message.error("Error", 10);
    },
  }); */
  const handleSubmit = async () => {
    modalRef?.destroy();
    return;
    try {
      const values = formInstance.getFieldsValue();
      await formInstance.validateFields();
      await verifyCode.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };
  function showModal() {
    modalRef = Modal.info({
      title: "Password Recovery",
      okButtonProps: { style: { display: "none" } },
      content: (
        <Form<FormValues> form={formInstance}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </Form>
      ),
    });
  }
  return (
    <Typography.Link onClick={showModal}>
      Forgot password
    </Typography.Link>
  );
};
const SignupButton = () => {
  const [formInstance] = Form.useForm();
  let modalRef: { destroy: () => void } | null = null;
  //const authActions = useAuthAction();
  const verifyCode: any = () => { }
  /*   const verifyCode = authActions.logIn({
      onSuccess: (response) => {
        if (response.data.user.resetPassword) {
          message.success("Code is valid");
          Modal.destroyAll();
          router.push(
            `createPassword?token=${response.data.token}&email=${response.data.user.email}&userId=${response.data.user.userId}&version=${response.data.user.version}`,
          );
          return;
        }
      },
      onError: () => {
        message.error("Code is not valid", 10);
      },
    }); */
  const handleSubmit = async () => {
    modalRef?.destroy();
    return;
    try {
      const values = formInstance.getFieldsValue();
      await formInstance.validateFields();
      await verifyCode.mutateAsync({ body: values });
    } catch (error) {
      console.error(error);
    }
  };
  function showModal() {
    modalRef = Modal.info({
      title: "Sign up",
      okButtonProps: { style: { display: "none" } },
      closable: true,
      maskClosable: false,
      content: (
        <Form<FormValues> form={formInstance}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Code"
            name="password"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </Form>
      ),
    });
  }
  return (
    <Typography.Link onClick={showModal}>
      Sign up
    </Typography.Link>
  );
};