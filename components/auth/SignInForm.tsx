"use client";

// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {ChevronLeftIcon, EyeCloseIcon, EyeIcon} from "@/icons";
import Link from "next/link";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {useAuth} from "@/context/AgentContext";
import service from "@/core/service";

interface FormData {
    agent_mobile?: string;
    agent_pass?: string;
    employee_mobile?: string;
    agent_email?: string;
}

type FormState = 'login' | 'forgetByTel' | 'forgetByEmail' | 'enterPass';


export default function SignInForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<FormData>({});
    const [formState, setFormState] = useState<FormState>('login');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false)
    const {login} = useAuth();

    useEffect(() => {
        setFormData({})
    }, [formState]);

    async function handleLogin() {
        if (!formData?.agent_mobile ||
            !formData?.agent_pass ||
            !formData?.employee_mobile) {
            setError('فیلد اجباری است');
            toast.error('تمامی فیلد ها اجباری است');
            return
        }

        setShowLoader(true)
        setError('');

        try {
            const res = await service.General.getData(`?command=login_agent&agent_mobile=${formData?.agent_mobile}&agent_pass=${formData?.agent_pass}&employee_mobile=${formData?.employee_mobile}`);

            if (res) {
                const data = res.data;
                if (data.result != 'ok') {
                    setShowLoader(false)
                    toast.error(data.error || 'مشکلی پیش آمد. دوباره تلاش کنید.');
                    return;
                }

                console.log('1', data)
                toast.success(data.desc || 'با موفقیت وارد شدید');
                login(data.data)
                // router.push('/');
            } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            setShowLoader(false)
        }
    }

    async function handleForget() {
        setShowLoader(true)
        setError('');

        try {
            let command = formState == 'forgetByTel' ? 'forgetpasstell&agent_mobil=' : 'forgetpassemail&agent_mobile='
            let param = formState == 'forgetByTel' ? formData?.agent_mobile : formData?.agent_email
            const res = await service.General.getData('?command=' + command + param);
            if (res) {
                const data = res.data;
                if (data.result !== "ok") throw new Error(data.desc);
                setFormState('enterPass')
            }
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            setShowLoader(false)
        } finally {
            setShowLoader(false)
        }
    }

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
                <div className="mb-5 sm:mb-8">

                    <div className="mb-5 text-center">
                        <Image
                            width={300}
                            height={50}
                            src="/images/logo/logo.png"
                            alt="Logo"
                        />
                    </div>
                    {/*<h1 className="mb-2 mt-5 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">*/}
                    {/*    خوش آمدید :)*/}
                    {/*</h1>*/}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formState == 'login' && (`برای ورود، اطلاعات خود را وارد کنید`)}
                        {formState.includes('forget') && (`برای بازیابی رمز، اطلاعات خود را وارد کنید`)}
                        {formState == 'enterPass' && (`کد ارسال شده را وارد کنید`)}
                    </p>
                </div>
                {formState == 'login' && (
                    <>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="agentPhone">
                                    شماره همراه نماینده
                                </Label>
                                <Input
                                    disabled={showLoader}
                                    id="agentPhone"
                                    type="tel"
                                    error={!!error && !formData?.agent_mobile}
                                    hint={error && !formData?.agent_mobile ? error : ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        agent_mobile: e.target.value
                                    })}
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
                                        disabled={showLoader}
                                        error={!!error && !formData?.agent_pass}
                                        hint={error && !formData?.agent_pass ? error : ''}
                                        id="agentPass"
                                        type={showPassword ? "text" : "password"}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            agent_pass: e.target.value
                                        })}
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
                                    disabled={showLoader}
                                    error={!!error && !formData?.employee_mobile}
                                    hint={error && !formData?.employee_mobile ? error : ''}
                                    type="tel"
                                    id="employeeMobile"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        employee_mobile: e.target.value
                                    })}
                                />
                            </div>

                            <div>
                                <Button className="w-full" size="sm" onClick={handleLogin} variant={"primary"}
                                        loading={showLoader}
                                        disabled={showLoader}>
                                    ورود
                                </Button>
                            </div>
                            <div>
                                <Button className="w-full" size="sm" onClick={() => setFormState('forgetByEmail')}
                                        variant={"outline"}
                                        disabled={showLoader}>
                                    فراموشی رمز عبور
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {formState.includes('forget') && (
                    <>
                        <div className="space-y-6">
                            {formState == 'forgetByEmail' && <div>
                                <Label htmlFor="agentEmail">
                                    ایمیل
                                </Label>
                                <Input
                                    disabled={showLoader}
                                    id="agentEmail"
                                    type="email"
                                    error={!!error && !formData?.agent_email}
                                    hint={error && !formData?.agent_email ? error : ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        agent_email: e.target.value
                                    })}
                                />
                            </div>}

                            {formState == 'forgetByTel' && <div>
                                <Label htmlFor="agentPhone">
                                    شماره همراه نماینده
                                </Label>
                                <Input
                                    disabled={showLoader}
                                    id="agentPhone"
                                    type="tel"
                                    error={!!error && !formData?.agent_mobile}
                                    hint={error && !formData?.agent_mobile ? error : ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        agent_mobile: e.target.value
                                    })}
                                />
                            </div>}

                            <div>
                                <Button className="w-full" size="sm" onClick={() => handleForget()}
                                        variant={"primary"}
                                        loading={showLoader}
                                        disabled={showLoader || (!formData.agent_email && !formData.agent_mobile)}>
                                    ارسال رمز
                                </Button>
                            </div>
                            <div>
                                <Button className="w-full" size="sm"
                                        onClick={() => setFormState(formState == 'forgetByTel' ? 'forgetByEmail' : 'forgetByTel')}
                                        variant={"outline"}
                                        disabled={showLoader}>
                                    {formState == 'forgetByTel' && `ارسال رمز به ایمیل`}
                                    {formState == 'forgetByEmail' && `ارسال رمز به شماره همراه`}
                                </Button>
                            </div>
                            <div>
                                <Button className="w-full" size="sm"
                                        onClick={() => setFormState('login')}
                                        variant={"outline"}
                                        disabled={showLoader}>
                                    بازگشت
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {formState == 'enterPass' && (
                    <>

                    </>
                )}
            </div>
        </div>
    );
}
