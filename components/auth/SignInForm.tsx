"use client";

// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {ChevronLeftIcon, EyeCloseIcon, EyeIcon} from "@/icons";
import Link from "next/link";
import Image from "next/image";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Alert from "@/components/ui/alert/Alert";
import {toast} from "react-toastify";

export default function SignInForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [agentMobile, setAgentMobile] = useState('');
    const [agentPass, setAgentPass] = useState('');
    const [employeeMobile, setEmployeeMobile] = useState('');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false)

    async function handleLogin(e) {
        e.preventDefault()
        if (!agentMobile ||
            !agentPass ||
            !employeeMobile) {
            setError('فیلد اجباری است');
            toast.error( 'تمامی فیلد ها اجباری است');
            return
        }

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

            const data = await res.json();
            if (data.result != 'ok') {
                toast.error(data.desc || 'مشکلی پیش آمد. دوباره تلاش کنید.');
                return;
            }

            toast.success(data.desc || 'با موفقیت وارد شدید');
            router.push('/');
        } catch (err) {
            console.log(err)
            toast.error(err || 'مشکلی پیش آمد. دوباره تلاش کنید.');
        } finally {
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

                        <Image
                            width={154}
                            height={32}
                            src="/images/logo/logo.png"
                            alt="Logo"
                        />
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
                                    <Label htmlFor="agentPhone">
                                        شماره همراه نماینده
                                    </Label>
                                    <Input
                                        id="agentPhone"
                                        type="tel"
                                        error={error && !agentMobile}
                                        hint={error && !agentMobile ? error : ''}
                                        value={agentMobile}
                                        onChange={(e) => setAgentMobile(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <Label htmlFor="agentPass">
                                            رمز عبور نماینده
                                        </Label>
                                        <Link
                                            href="/reset-password"
                                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                        >
                                            فراموشی رمز عبور؟
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            error={error && !agentPass}
                                            hint={error && !agentPass ? error : ''}
                                            id="agentPass"
                                            type={showPassword ? "text" : "password"}
                                            value={agentPass}
                                            onChange={(e) => setAgentPass(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 cursor-pointer left-4 top-3"
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
                                    <Label htmlFor="employeeMobile">
                                        شماره همراه کارمند
                                    </Label>
                                    <Input
                                        error={error && !employeeMobile}
                                        hint={error && !employeeMobile ? error : ''}
                                        id="employeeMobile"
                                        type="tel"
                                        value={employeeMobile}
                                        onChange={(e) => setEmployeeMobile(e.target.value)}
                                    />
                                </div>

                                {/*{error && employeeMobile && agentMobile && agentPass && <Alert*/}
                                {/*    variant="error"*/}
                                {/*    title="خطا"*/}
                                {/*    message={error}*/}
                                {/*/>}*/}

                                <div>
                                    <Button className="w-full" size="sm" onClick={handleLogin} loading={showLoader}
                                            disabled={showLoader}>
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
