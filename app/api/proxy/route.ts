
export default async function handler(req, res) {
    const { agent_token } = req.cookies;

    if (!agent_token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const response = await fetch('https://external-api.com', {
        method: req.method,
        headers: {
            Authorization: `Bearer ${agent_token}`,
            ...req.headers,
        },
        body: req.body,
    });

    const data = await response.json();
    res.status(response.status).json(data);
}