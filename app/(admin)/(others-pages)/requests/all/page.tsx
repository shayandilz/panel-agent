import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
import RequestsTable from "@/components/tables/RequestsTable";

export const metadata: Metadata = {
  title: "All requests",
  description:
    "All requests page",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="درخواست ها" />
      <div className="space-y-6">
        <ComponentCard title="همه درخواست ها">
          <RequestsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
