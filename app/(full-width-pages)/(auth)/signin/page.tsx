import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود",
  description: "صفحه ورود",
};

export default function SignIn() {
  return <SignInForm />;
}
