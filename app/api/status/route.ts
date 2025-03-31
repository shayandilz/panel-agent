import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    const token = request.cookies.get('server_agent_token')?.value

    if (!token) {
        return NextResponse.json({error: 'مشکلی پیش آمد. دوباره تلاش کنید.'}, {status: 401})
    }
    console.log(agentId,token)

    try {
        const url = `https://api.rahnamayefarda.ir/api/agentlogin?command=getagent&agent_id=${agentId}`;
        console.log(url)
        const res = await fetch(url,{
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
        return NextResponse.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت اطلاعات کاربر' },
            { status: 500 }
        );
    }
}
