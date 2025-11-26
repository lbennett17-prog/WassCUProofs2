// api/get-signage-tasks.js

export default async function handler(req, res) {
  try {
    const listId = req.query.listId;

    if (!listId) {
      return res.status(400).json({ error: "Missing listId parameter" });
    }

    const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
    const TASK_TYPE_FIELD_ID = process.env.TASK_TYPE_FIELD_ID;  
    const TASK_TYPE_SIGNAGE_VALUE = process.env.TASK_TYPE_SIGNAGE_VALUE;

    if (!CLICKUP_API_TOKEN || !TASK_TYPE_FIELD_ID || !TASK_TYPE_SIGNAGE_VALUE) {
      return res.status(500).json({
        error: "Missing environment variables on server"
      });
    }

    const apiUrl = `https://api.clickup.com/api/v2/list/${listId}/task?include_subtasks=true&include_closed=true`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": CLICKUP_API_TOKEN
      }
    });

    const data = await response.json();

    if (!data.tasks) {
      return res.status(400).json({
        error: "ClickUp returned no tasks",
        clickup_response: data
      });
    }

    // Filter for Task Type = Signage
    const filtered = data.tasks.filter(task => {
      const field = task.custom_fields?.find(f => f.id === TASK_TYPE_FIELD_ID);
      return field?.value === TASK_TYPE_SIGNAGE_VALUE;
    });

    return res.status(200).json({ tasks: filtered });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
