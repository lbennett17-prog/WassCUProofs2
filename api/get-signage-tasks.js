// File: api/get-signage-tasks.js

export default async function handler(req, res) {
  try {
    const token = process.env.CLICKUP_API_TOKEN;
    const fieldId = process.env.TASK_TYPE_FIELD_ID;
    const signageValue = process.env.TASK_TYPE_SIGNAGE_VALUE;

    if (!token || !fieldId || !signageValue) {
      return res.status(400).json({ error: "Missing environment variables" });
    }

    const listId = req.query.list;
    if (!listId) {
      return res.status(400).json({ error: "Missing list parameter" });
    }

    const url = `https://api.clickup.com/api/v2/list/${listId}/task?include_subtasks=true`;
    const cuRes = await fetch(url, {
      headers: { Authorization: token }
    });

    const json = await cuRes.json();

    if (!json.tasks) {
      return res.status(500).json({ error: "Invalid ClickUp response", json });
    }

    // Filter for "Signage"
    const filtered = json.tasks.filter(t => {
      const field = t.custom_fields?.find(f => f.id === fieldId);
      return field && field.value === signageValue;
    });

    return res.status(200).json({ tasks: filtered });

  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
