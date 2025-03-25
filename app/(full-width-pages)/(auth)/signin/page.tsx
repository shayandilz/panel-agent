import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page",
  description: "Signin Page",
};

export default function SignIn() {
  return <SignInForm />;
}
