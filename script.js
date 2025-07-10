let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Set today's date as minimum in calendar
window.onload = () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dueDate").setAttribute("min", today);
  renderTasks(); // already exists
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const priorityRank = { High: 1, Medium: 2, Low: 3 };

  // Clone and sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate || "9999-12-31");
    const dateB = new Date(b.dueDate || "9999-12-31");

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB; // earlier date first
    } else {
      return priorityRank[a.priority] - priorityRank[b.priority]; // higher priority first
    }
  });

  sortedTasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "pending" && task.completed) return;

    const li = document.createElement("li");
    li.classList.toggle("completed", task.completed);

    const span = document.createElement("span");
    span.innerHTML = `<strong>${task.text}</strong> 
                      <br><small class="priority-${task.priority}">${
      task.priority
    } Priority</small> 
                      <br><small>Due: ${task.dueDate || "N/A"}</small>`;
    span.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks(filter);
    };

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
      const newText = prompt("Edit task:", task.text);
      if (newText) {
        task.text = newText.trim();
        saveTasks();
        renderTasks(filter);
      }
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => {
      const taskIndex = tasks.indexOf(task);
      tasks.splice(taskIndex, 1);
      saveTasks();
      renderTasks(filter);
    };

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(span);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!text) return alert("Task can't be empty!");

  // Validate due date is not in the past
  if (dueDate) {
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time for accurate comparison
    if (selectedDate < today) {
      return alert("Please select today or a future date.");
    }
  }

  tasks.push({ text, completed: false, priority, dueDate });
  saveTasks();
  renderTasks();

  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
}

function filterTasks(type) {
  renderTasks(type);
}

function clearAll() {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Initial render
renderTasks();
