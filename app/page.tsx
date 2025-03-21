import { cookies } from 'next/headers';

export default async function HomePage() {
    const cookieStore = await cookies(); // 👈 await here

    const agentName = cookieStore.get('agent_name')?.value || '';
    const agentFamily = cookieStore.get('agent_family')?.value || '';
    const agentMobile = cookieStore.get('agent_mobile')?.value || '';
    const employeeName = cookieStore.get('employee_name')?.value || '';
    const employeeFamily = cookieStore.get('employee_family')?.value || '';

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white shadow-md rounded-xl p-6 space-y-4">
                <h1 className="text-2xl font-bold text-green-600">🎉 ورود موفق!</h1>

                <p className="text-gray-800 font-medium">
                    خوش آمدید {agentName} {agentFamily}
                </p>

                <div className="text-gray-600 text-sm space-y-1">
                    <p>📱 شماره نماینده: {agentMobile}</p>
                    <p>🧑‍💼 کارمند: {employeeName} {employeeFamily}</p>
                </div>
            </div>
        </main>
    );
}
