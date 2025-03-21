'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [agentMobile, setAgentMobile] = useState('');
    const [agentPass, setAgentPass] = useState('');
    const [employeeMobile, setEmployeeMobile] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
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
                return;
            }

            router.push('/');
        } catch (err) {
            console.log(err)
            setError('مشکلی پیش آمد. دوباره تلاش کنید.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-xl">
                <h2 className="text-2xl font-bold text-center">ورود</h2>

                <input
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="شماره همراه نماینده"
                    value={agentMobile}
                    onChange={(e) => setAgentMobile(e.target.value)}
                />
                <input
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="رمز عبور نماینده"
                    type="password"
                    value={agentPass}
                    onChange={(e) => setAgentPass(e.target.value)}
                />
                <input
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="شماره همراه کارمند"
                    value={employeeMobile}
                    onChange={(e) => setEmployeeMobile(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={handleLogin}
                >
                    ورود
                </button>
            </div>
        </div>
    );
}
