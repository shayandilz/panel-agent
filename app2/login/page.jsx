'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import LoadingButton from '../components/coommon/LoadingButton'
import {POST} from "../api/login/route";

export default function LoginPage() {
    const router = useRouter();
    const [agentMobile, setAgentMobile] = useState('');
    const [agentPass, setAgentPass] = useState('');
    const [employeeMobile, setEmployeeMobile] = useState('');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false)

    const handleLogin = async () => {
        setShowLoader(true)
        setError('');

        try {
            const res = await fetch(`https://api.rahnamayefarda.ir/api/agentlogin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: 'login_agent',
                    agent_mobile: agentMobile,
                    agent_pass: agentPass,
                    employee_mobile: employeeMobile,
                }),
            });

            console.log(res)
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
        <div className="flex min-h-screen flex-1 flex-col justify-center align-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
                    خوش آمدید
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm/6 font-medium">
                            شماره همراه نماینده
                        </label>
                        <div className="mt-2">
                            <input
                                id="phone"
                                type="tel"
                                value={agentMobile}
                                onChange={(e) => setAgentMobile(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone2" className="block text-sm/6 font-medium">
                            شماره همراه کارمند
                        </label>
                        <div className="mt-2">
                            <input
                                id="phone2"
                                type="tel"
                                value={employeeMobile}
                                onChange={(e) => setEmployeeMobile(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>


                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium">
                                رمز عبور نماینده
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    فراموشی رمز عبور؟
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                type="password"
                                value={agentPass}
                                onChange={(e) => setAgentPass(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    {error &&
                        <div className="bg-red-100 border-r-3 border-red-500 text-orange-700 p-2 ps-4" role="alert">
                            <p className="font-bold">خطا</p>
                        <p>{error}</p>
                    </div>}

                    <div>
                        <LoadingButton text="ورود" onSubmit={handleLogin} loading={showLoader} disabled={showLoader}
                            classes="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        </LoadingButton>
                    </div>
                </div>

                {/*<p className="mt-10 text-center text-sm/6 text-gray-500">*/}
                {/*    عضو نیستیتد؟{' '}*/}
                {/*    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">*/}
                {/*        ثبت نام*/}
                {/*    </a>*/}
                {/*</p>*/}
            </div>
        </div>
    )
}
