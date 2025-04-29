import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import RequestDetail from "@/components/custom/requests/RequestDetail";

export interface SlugPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }:SlugPageProps) {
    let param = await params
    let id = param?.id
    return {
        title: `جزئیات درخواست - ${id}`,
        description: "صفحه جزئیات درخواست",
    };
}

export default async function RequestDetailPage({ params }: SlugPageProps) {
    let param = await params
    let id = param?.id
    return (
        <div>
            <PageBreadcrumb pageTitle="جزئیات درخواست"/>
            <div className="space-y-6">
                <ComponentCard title={  "جزئیات درخواست - شماره" + id}>
                    <RequestDetail/>
                </ComponentCard>
            </div>
        </div>
    );
}
