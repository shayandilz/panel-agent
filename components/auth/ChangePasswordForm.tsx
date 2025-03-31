"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Alert from "@/components/ui/alert/Alert";
import {useAgent} from "@/context/AgentContext";
import {da} from "@fullcalendar/core/internal-common";

export default function ChangePasswordForm() {
    const router = useRouter();
    const {tokenData, setTokenData} = useAgent();
    const [agentOldPass, setAgentOldPass] = useState('');
    const [agentNewPass, setAgentNewPass] = useState('');
    const [agentNewPass2, setAgentNewPass2] = useState('');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false)

    async function handleChangePassword(e) {
        e.preventDefault()
        if (!agentOldPass || !agentNewPass || !agentNewPass2) {
            setError('فیلد اجباری است');
            return
        }

        if (agentNewPass !== agentNewPass2) {
            setError('تکرار رمز جدید مطابقت ندارد');
            return
        }

        setShowLoader(true)
        setError('');

        try {
            const formData = new FormData()
            formData.append('command', 'changepass');
            formData.append('agent_pass', agentOldPass)
            formData.append('agent_newpass', agentNewPass)

            const res = await fetch('https://api.rahnamayefarda.ir/api/agentlogin', {
                method: 'POST',
                headers: {
                    'Authorization': tokenData,
                },
                body: formData
            });

            const data = await res.json();
            console.log(data, res)
            if (data.result != 'ok') {
                setError(data.desc || 'مشکلی پیش آمد. دوباره تلاش کنید.');
                setShowLoader(false)
                return;
            }

            // todo: success alert
            console.log('login success', data)
            router.push('/');
        } catch (err) {
            console.log(err)
            setError('مشکلی پیش آمد. دوباره تلاش کنید.');
            setShowLoader(false)
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <form>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between">
                                <Label htmlFor="agentOldPass">
                                    رمز قدیم
                                </Label>
                            </div>
                            <div className="relative">
                                <Input
                                    error={error && !agentOldPass}
                                    hint={error && !agentOldPass ? error : ''}
                                    id="agentOldPass"
                                    type="password"
                                    value={agentOldPass}
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
                                    error={error && !agentNewPass}
                                    hint={error && !agentNewPass ? error : ''}
                                    id="agentONewPass"
                                    type="password"
                                    value={agentNewPass}
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
                                    error={error && !agentNewPass2}
                                    hint={error && !agentNewPass2 ? error : ''}
                                    id="agentNewPass2"
                                    type="password"
                                    value={agentNewPass2}
                                    onChange={(e) => setAgentNewPass2(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && agentOldPass && agentNewPass && agentNewPass2 && <Alert
                            variant="error"
                            title="خطا"
                            message={error}
                        />}

                        <div>
                            <Button className="" size="sm" onClick={handleChangePassword} loading={showLoader}
                                    disabled={showLoader}>
                                تغییر رمز
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
