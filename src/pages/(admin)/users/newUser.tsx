import DashboardLayout2 from "@/components/layout/DashboardLayout2";
import React, { ReactElement } from "react";

const Index = () => {
  return <div>Index</div>;
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2> {page}</DashboardLayout2>;
};
