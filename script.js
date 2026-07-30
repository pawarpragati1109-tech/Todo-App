const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let editId = null;

// Get tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Search Tasks
searchInput.addEventListener("input", function () {
    displayTasks(searchInput.value);
});

// Add Task
addTaskBtn.addEventListener("click", function () {

    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    let task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskInput.value = "";
});

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display Tasks
function displayTasks(searchText = "") {

    taskList.innerHTML = "";

    tasks
        .filter(function (task) {
            return task.text
                .toLowerCase()
                .includes(searchText.toLowerCase());
        })
        .forEach(function (task) {

            let li = document.createElement("li");

            li.className =
                "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
                <span class="${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

                <div>

                    <button
                        class="btn btn-success btn-sm me-2"
                        onclick="completeTask(${task.id})">
                        Complete
                    </button>

                    <button
                        class="btn btn-warning btn-sm me-2"
                        onclick="editTask(${task.id})">
                        Edit
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteTask(${task.id})">
                        Delete
                    </button>

                </div>
            `;

            taskList.appendChild(li);
        });

    updateStats();
}

// Dashboard Statistics
function updateStats() {

    totalTasks.textContent = tasks.length;

    let completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = tasks.length - completed;
}

// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    displayTasks(searchInput.value);
}

// Complete Task
function completeTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks(searchInput.value);
}

// Open Edit Modal
function editTask(id) {

    let task = tasks.find(function (task) {
        return task.id === id;
    });

    editId = id;

    document.getElementById("editInput").value = task.text;

    let modal = new bootstrap.Modal(
        document.getElementById("editModal")
    );

    modal.show();
}

// Update Task
function updateTask() {

    let newText = document.getElementById("editInput").value.trim();

    if (newText === "") {
        alert("Task cannot be empty");
        return;
    }

    tasks = tasks.map(function (task) {

        if (task.id === editId) {
            task.text = newText;
        }

        return task;
    });

    saveTasks();
    displayTasks(searchInput.value);

    let modal = bootstrap.Modal.getInstance(
        document.getElementById("editModal")
    );

    modal.hide();
}

// Initial Load
displayTasks();

// Dark Mode

themeBtn.addEventListener("click", function(){

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        themeBtn.innerHTML = "☀️";

    }
    else{

        themeBtn.innerHTML = "🌙";

    }

});