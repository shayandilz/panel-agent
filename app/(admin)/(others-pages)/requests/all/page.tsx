
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
import AllRequests from "@/components/custom/requests/AllRequests";

export const metadata: Metadata = {
  title: "All requests",
  description:
    "All requests page",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="کارتابل درخواست ها" />
      <div className="space-y-6">
        <ComponentCard title="کارتابل درخواست ها">
          <AllRequests />
        </ComponentCard>
      </div>
    </div>
  );
}
