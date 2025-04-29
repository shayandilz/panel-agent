import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    const {agent_mobile, agent_pass, employee_mobile} = await req.json();

    try {
        const url = `https://api.rahnamayefarda.ir/api/agentlogin?command=login_agent&agent_mobile=${agent_mobile}&agent_pass=${agent_pass}&employee_mobile=${employee_mobile}`;
        const res = await fetch(url, {
            method: 'POST',
            redirect: 'follow',
        });

        const data = await res.json();

        // console.log('login response', data)
        if (data.result === 'ok') {
            const response = NextResponse.json(data);

            response.cookies.set('server_agent_token', data.data.agent_token_str);
            response.cookies.set('agent_data', JSON.stringify(data.data));
            response.cookies.set('agent_id', data.data.agent_id);

            return response;
        } else {
            return NextResponse.json({error: data.desc}, {status: 401});
        }
    } catch (err) {
        console.error('login API Error:', err);
        return NextResponse.json(
            {error: 'خطا در ارتباط با سرور'},
            {status: 500}
        );
    }
}
