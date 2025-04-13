import UserInfoCard from "@/components/custom/user/UserInfoCard";
import { Metadata } from "next";
import React, {useState} from "react";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Profile page",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          پروفایل کاربر
        </h3>
        <div className="space-y-6">
          {/*<UserMetaCard />*/}
          <UserInfoCard />
          {/*<UserAddressCard />*/}
        </div>
      </div>
    </div>
  );
}
