export default async function handler(req, res) {
  const { list } = req.query;

  if (!list) {
    return res.status(400).json({ error: 'Missing list query parameter (?list=LIST_ID).' });
  }

  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'CLICKUP_API_TOKEN not set on the server.' });
  }

  try {
    const url = `https://api.clickup.com/api/v2/list/${encodeURIComponent(list)}/task?include_subtasks=true`;
    const cuRes = await fetch(url, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    const body = await cuRes.json();

    if (!cuRes.ok) {
      return res.status(cuRes.status).json({
        error: 'ClickUp API error',
        status: cuRes.status,
        body
      });
    }

    return res.status(200).json({
      tasks: body.tasks || [],
      total: body.tasks ? body.tasks.length : 0
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error calling ClickUp',
      details: String(err)
    });
  }
}
