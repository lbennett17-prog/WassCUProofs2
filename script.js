const taskListEl = document.getElementById("taskList");
const taskTitleEl = document.getElementById("taskTitle");
const attachmentEl = document.getElementById("attachmentContainer");

// Get listId from URL
const urlParams = new URLSearchParams(window.location.search);
const listId = urlParams.get("list");

if (!listId) {
  taskListEl.innerHTML = "<p>Missing ?list=LIST_ID in URL.</p>";
} else {
  loadTasks(listId);
}

async function loadTasks(listId) {
  try {
    const res = await fetch(`/api/get-signage-tasks?listId=${listId}`);
    const data = await res.json();

    if (!data.tasks || data.tasks.length === 0) {
      taskListEl.innerHTML = "<p>No signage tasks.</p>";
      return;
    }

    renderTaskList(data.tasks);
  } catch (err) {
    taskListEl.innerHTML = "<p>Error loading tasks.</p>";
  }
}

function renderTaskList(tasks) {
  taskListEl.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `${task.name} <br><small>${task.id}</small>`;

    div.onclick = () => {
      taskTitleEl.textContent = task.name;
      loadAttachment(task);
    };

    taskListEl.appendChild(div);
  });
}

function loadAttachment(task) {
  attachmentEl.innerHTML = "";

  const attField = task.custom_fields?.find(f => f.name === "Attachments");

  if (!attField || !attField.value || attField.value.length === 0) {
    attachmentEl.innerHTML = "<p>No attachment/preview available.</p>";
    return;
  }

  const file = attField.value[0];
  const url = file.url_w_query || file.url;

  if (!url) {
    attachmentEl.innerHTML = "<p>Attachment URL missing.</p>";
    return;
  }

  // Render PDF or image
  if (file.extension === "pdf") {
    attachmentEl.innerHTML = `
      <iframe src="${url}" width="100%" height="800px"></iframe>
    `;
  } else {
    attachmentEl.innerHTML = `
      <img src="${url}" alt="${file.title}">
    `;
  }
}
