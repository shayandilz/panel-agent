import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('server_agent_token')?.value

    if (!token) {
        return NextResponse.json({error: 'مشکلی پیش آمد. دوباره تلاش کنید.'}, {status: 401})
    }

    try {
        const url = `https://api.rahnamayefarda.ir/api/agentlogin?command=logout`;
        const res = await fetch(url, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                "Authorization": token,
            },
        });

        const data = await res.json();
        // 3. Create response and clear cookies
        const response = NextResponse.json(data);

        // Remove server-side cookies
        response.cookies.delete('server_agent_token');
        response.cookies.delete('agent_data');
        response.cookies.delete('agent_id');

        return response;
    } catch (err) {
        console.error('Logout API Error:', err);
        return NextResponse.json(
            {error: 'خطا در ارتباط با سرور'},
            {status: 500}
        );
    }
}
