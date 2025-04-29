"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AgentContext";
import service from "@/core/service";
import {toast} from "react-toastify";

export default function ChangePasswordForm() {
    const router = useRouter();
    const {token} = useAuth();
    const [agentOldPass, setAgentOldPass] = useState('');
    const [agentNewPass, setAgentNewPass] = useState('');
    const [agentNewPass2, setAgentNewPass2] = useState('');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false)

    async function handleChangePassword() {
        if (!agentOldPass || !agentNewPass || !agentNewPass2) {
            setError('فیلد اجباری است');
            return
        }

        if (agentNewPass !== agentNewPass2) {
            toast.error('تکرار رمز جدید مطابقت ندارد');
            return
        }

        setShowLoader(true)

        try {
            const formData = new FormData()
            formData.append('command', 'changepass');
            formData.append('agent_pass', agentOldPass)
            formData.append('agent_newpass', agentNewPass)

            const res = await service.General.getData(`?command=changepass&agent_pass=${agentOldPass}&agent_newpass=${agentNewPass}`);

            if (res) {
                const data = res.data
                if (data.result != 'ok') {
                    toast.error(data.desc || 'مشکلی پیش آمد. دوباره تلاش کنید.');
                    setShowLoader(false)
                    return;
                }

                toast.success(data.desc || 'پسورد با موفقیت تغییر کرد');
                console.log('handleChangePassword success', data)
                router.push('/');
            } else toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
        } catch (err) {
            toast.error('مشکلی پیش آمد. دوباره تلاش کنید.');
            setShowLoader(false)
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                {/*<form>*/}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between">
                            <Label htmlFor="agentOldPass">
                                رمز قدیم
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                error={!!error && !agentOldPass}
                                hint={error && !agentOldPass ? error : ''}
                                id="agentOldPass"
                                type="password"
                                defaultValue={agentOldPass}
                                onChange={(e) => setAgentOldPass(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <Label htmlFor="agentONewPass">
                                رمز جدید
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                error={!!error && !agentNewPass}
                                hint={error && !agentNewPass ? error : ''}
                                id="agentONewPass"
                                type="password"
                                defaultValue={agentNewPass}
                                onChange={(e) => setAgentNewPass(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <Label htmlFor="agentOldPass">
                                تکرار رمز جدید
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                error={!!error && !agentNewPass2}
                                hint={error && !agentNewPass2 ? error : ''}
                                id="agentNewPass2"
                                type="password"
                                defaultValue={agentNewPass2}
                                onChange={(e) => setAgentNewPass2(e.target.value)}
                            />
                        </div>
                    </div>


                    <div>
                        <Button className="" size="sm" onClick={handleChangePassword} loading={showLoader}
                                disabled={showLoader}>
                            تغییر رمز
                        </Button>
                    </div>
                </div>
                {/*</form>*/}
            </div>
        </div>
    );
}
