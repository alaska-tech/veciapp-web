import DashboardLayout2 from "@/components/layout/DashboardLayout2";
import {
  Select,
} from "antd";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";
const { Option } = Select;

const NewUserFormDynamic = dynamic(
  () => import('@/components/forms/newUserForm').then(mod => mod.NewUserForm),
  { ssr: false }
);

const Index = () => {
  return <NewUserFormDynamic />;
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
