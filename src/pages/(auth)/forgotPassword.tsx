import LandingPageLayout from "@/components/layout/LandingPageLayout";
import React, { ReactElement } from "react";

const Index = () => {
  return <div>Index</div>;
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <LandingPageLayout> {page}</LandingPageLayout>;
};
