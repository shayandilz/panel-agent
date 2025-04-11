// import UserAddressCard from "@/components/user-profile/UserAddressCard";
import AgentStatus from "@/components/custom/user/AgentStatus";
// import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React, {useState} from "react";

export const metadata: Metadata = {
  title: "agent status",
  description:
    "agent status page",
};

export default function AgentStatusPage() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          وضعیت نماینده
        </h3>
        <div className="space-y-6">
          <AgentStatus />
        </div>
      </div>
    </div>
  );
}
