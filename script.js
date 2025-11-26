document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const errorEl = document.getElementById('error');
  const tasksEl = document.getElementById('tasks');
  const rawEl = document.getElementById('raw');

  const params = new URLSearchParams(window.location.search);
  const listId = params.get('list');

  if (!listId) {
    statusEl.textContent = 'Missing list ID. Add ?list=YOUR_LIST_ID to the URL.';
    return;
  }

  statusEl.textContent = 'Calling /api/get-signage-tasks…';

  try {
    const url = `/api/get-signage-tasks?list=${encodeURIComponent(listId)}`;
    console.log('Fetching:', url);
    const res = await fetch(url);
    const data = await res.json();

    rawEl.textContent = JSON.stringify(data, null, 2);

    if (!res.ok || data.error) {
      statusEl.textContent = 'Error from API.';
      errorEl.classList.remove('hidden');
      errorEl.textContent = data.error || `HTTP ${res.status}`;
      return;
    }

    const tasks = data.tasks || [];
    if (tasks.length === 0) {
      statusEl.textContent = 'No tasks returned from ClickUp.';
      return;
    }

    statusEl.textContent = `Loaded ${tasks.length} task(s).`;
    tasksEl.innerHTML = '';
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.innerHTML = `${t.name || '(no name)'} <span class="id">(${t.id})</span>`;
      tasksEl.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Request failed.';
    errorEl.classList.remove('hidden');
    errorEl.textContent = String(err);
  }
});
