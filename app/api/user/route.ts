import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    const agentId = request.cookies.get('agent_id')?.value
    const token = request.cookies.get('server_agent_token')?.value

    if (!token) {
        return NextResponse.json({error: 'مشکلی پیش آمد. دوباره تلاش کنید.'}, {status: 401})
    }

    try {
        const url = `https://api.rahnamayefarda.ir/api/agentlogin?command=getagent&agent_id=${agentId}`;
        const res = await fetch(url, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                "Authorization": token,
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await res.json();
        return NextResponse.json({
            ...userData,
            token: token
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            {error: 'خطا در دریافت اطلاعات کاربر'},
            {status: 500}
        );
    }
}
