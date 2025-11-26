async function loadTasks() {
  const listId = document.getElementById("listInput").value.trim();
  const output = document.getElementById("output");

  if (!listId) {
    output.textContent = "Enter a list ID.";
    return;
  }

  output.textContent = "Loading…";

  try {
    const res = await fetch(`/api/get-signage-tasks?list=${listId}`);
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}
