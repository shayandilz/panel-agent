"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {ChevronLeftIcon, EyeCloseIcon, EyeIcon} from "@/icons";
import Link from "next/link";
import React, {useState} from "react";
import {useRouter} from "next/navigation";

export default function SignInForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [agentMobile, setAgentMobile] = useState('');
    const [agentPass, setAgentPass] = useState('');
    const [employeeMobile, setEmployeeMobile] = useState('');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false)

    const handleLogin = async () => {
        setShowLoader(true)
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent_mobile: agentMobile,
                    agent_pass: agentPass,
                    employee_mobile: employeeMobile,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.error || 'خطا در ورود');
                setShowLoader(false)
                return;
            }

            router.push('/');
        } catch (err) {
            console.log(err)
            setError('مشکلی پیش آمد. دوباره تلاش کنید.');
            setShowLoader(false)
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            {/*<div className="w-full max-w-md sm:pt-10 mx-auto mb-5">*/}
            {/*  <Link*/}
            {/*    href="/"*/}
            {/*    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"*/}
            {/*  >*/}
            {/*    <ChevronLeftIcon />*/}
            {/*    Back to dashboard*/}
            {/*  </Link>*/}
            {/*</div>*/}
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            خوش آمدید :)
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            برای ورود، اطلاعات خود را وارد کنید
                        </p>
                    </div>
                    <div>
                        <form>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        شماره همراه نماینده
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={agentMobile}
                                        onChange={(e) => setAgentMobile(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>
                                        رمز عبور نماینده
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={agentPass}
                                            onChange={(e) => setAgentPass(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer left-4 top-1/2"
                                        >
                                          {showPassword ? (
                                              <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                                          ) : (
                                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                                          )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>
                                        شماره همراه کارمند
                                    </Label>
                                    <Input
                                        type="tel"
                                        value={employeeMobile}
                                        onChange={(e) => setEmployeeMobile(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    {/*<div className="flex items-center gap-3">*/}
                                    {/*    <Checkbox checked={isChecked} onChange={setIsChecked}/>*/}
                                    {/*    <span*/}
                                    {/*        className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">*/}
                                    {/*      Keep me logged in*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    <Link
                                        href="/reset-password"
                                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
                                        فراموشی رمز عبور؟
                                    </Link>
                                </div>
                                <div>
                                    <Button className="w-full" size="sm" onSubmit={handleLogin} loading={showLoader} disabled={showLoader}>
                                        ورود
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/*<div className="mt-5">*/}
                        {/*    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">*/}
                        {/*        Don&apos;t have an account? {""}*/}
                        {/*        <Link*/}
                        {/*            href="/signup"*/}
                        {/*            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"*/}
                        {/*        >*/}
                        {/*            Sign Up*/}
                        {/*        </Link>*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}
