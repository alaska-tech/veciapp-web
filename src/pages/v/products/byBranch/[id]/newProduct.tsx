import useAuthAction from "@/actions/auth.action";
import { useProductServiceAction } from "@/actions/productservice.action";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Space } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NewFormDynamic = dynamic(
  () =>
    import("@/components/forms/newProductServiceForm").then(
      (mod) => mod.FormElement
    ),
  { ssr: false }
);

const Index = () => {
  const actions = useProductServiceAction();
  const create = actions.createProductService();
  const router = useRouter();
  const { id } = router.query;
  const authActions = useAuthAction();
  const user = authActions.userSession;
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      <NewFormDynamic
        onFinish={async (values) => {
          await create.mutateAsync({
            body: values,
            vendorId: user.data?.id ?? "",
            branchId: (id as string) || "",
          });
        }}
        loading={create.isPending}
        branchId={(id as string) || ""}
        userId={user.data?.id || ""}
      />
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};
