import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LoadingButton from "@/components/ui/button/Button";
import { BoxIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Buttons",
  description:
    "Buttons page",
};

export default function Buttons() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Buttons" />
      <div className="space-y-5 sm:space-y-6">
        {/* Primary LoadingButton */}
        <ComponentCard title="Primary LoadingButton">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary">
              LoadingButton Text
            </Button>
            <Button size="md" variant="primary">
              LoadingButton Text
            </Button>
          </div>
        </ComponentCard>
        {/* Primary LoadingButton with Start Icon */}
        <ComponentCard title="Primary LoadingButton with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" startIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
            <Button size="md" variant="primary" startIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
          </div>
        </ComponentCard>{" "}
        {/* Primary LoadingButton with Start Icon */}
        <ComponentCard title="Primary LoadingButton with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="primary" endIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
            <Button size="md" variant="primary" endIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline LoadingButton */}
        <ComponentCard title="Secondary LoadingButton">
          <div className="flex items-center gap-5">
            {/* Outline LoadingButton */}
            <Button size="sm" variant="outline">
              LoadingButton Text
            </Button>
            <Button size="md" variant="outline">
              LoadingButton Text
            </Button>
          </div>
        </ComponentCard>
        {/* Outline LoadingButton with Start Icon */}
        <ComponentCard title="Outline LoadingButton with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline" startIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
            <Button size="md" variant="outline" startIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
          </div>
        </ComponentCard>{" "}
        {/* Outline LoadingButton with Start Icon */}
        <ComponentCard title="Outline LoadingButton with Right Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline" endIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
            <Button size="md" variant="outline" endIcon={<BoxIcon />}>
              LoadingButton Text
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
