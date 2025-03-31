import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { agent_mobile, agent_pass, employee_mobile } = await req.json();
    console.log('test', agent_mobile, agent_pass, employee_mobile)

    const url = `https://api.rahnamayefarda.ir/api/agentlogin?command=login_agent&agent_mobile=${agent_mobile}&agent_pass=${agent_pass}&employee_mobile=${employee_mobile}`;
    const res = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
    });

    const data = await res.json();

    if (data.result === 'ok') {
        const response = NextResponse.json(data);

        response.cookies.set('agent_token', data.data.agent_token_str, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
        });

        response.cookies.set('agent_name', data.data.agent_name, { path: '/' });
        response.cookies.set('agent_family', data.data.agent_family, { path: '/' });
        response.cookies.set('agent_mobile', data.data.agent_mobile, { path: '/' });
        response.cookies.set('employee_name', data.data.employee_name, { path: '/' });
        response.cookies.set('employee_family', data.data.employee_family, { path: '/' });

        return response;
    } else {
        return NextResponse.json({ error: data.desc }, { status: 401 });
    }
}
