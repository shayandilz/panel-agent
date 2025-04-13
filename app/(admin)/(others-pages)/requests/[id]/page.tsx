import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import RequestDetail from "@/components/custom/requests/RequestDetail";

// export const metadata: Metadata = {
//     title: "request detail",
//     description:
//         "request detail page",
// };

export async function generateMetadata({ params }: { params: { id: string} }) {
    return {
        title: `جزئیات درخواست - شماره ${params.id}`,
        description: "جزئیات درخواست",
    };
}

export default function RequestDetailPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="جزئیات درخواست"/>
            <div className="space-y-6">
                <ComponentCard title="جزئیات درخواست">
                    <RequestDetail />
                </ComponentCard>
            </div>
        </div>
    );
}
