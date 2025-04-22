import ForgetPassForm from "@/components/auth/ForgetPassForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "فراموشی رمز عبور",
  description: "صفحه فراموشی رمز عبور",
};

export default function ForgetPass() {
  return <ForgetPassForm />;
}
