const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    displayTasks(searchInput.value);
});

let editId = null;

const priority = document.getElementById("priority");


// Get tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


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
    priority: priority.value,
    completed: false
};

    tasks.push(task);


    saveTasks();

    displayTasks();


    taskInput.value = "";

});



// Save tasks to Local Storage
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}



// Display Tasks
function displayTasks(searchText = "") {

    taskList.innerHTML = "";


    tasks
    .filter(function(task) {
        return task.text
            .toLowerCase()
            .includes(searchText.toLowerCase());
    })
    .forEach(function(task) {


        let li = document.createElement("li");


        li.className =
        "list-group-item d-flex justify-content-between align-items-center";


        li.innerHTML = `

        <span class="${task.completed ? 
        "text-decoration-line-through text-muted" : ""}">
            ${task.text}
        </span>

            <br>

            <span class="badge ${
                task.priority === "High"
                    ? "bg-danger"
                    : task.priority === "Medium"
                    ? "bg-warning text-dark"
                    : "bg-success"
            }">
                ${task.priority}
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

}



// Delete Task
function deleteTask(id) {


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}



// Complete Task
function completeTask(id) {


    tasks = tasks.map(function(task) {


        if(task.id === id) {

            task.completed = !task.completed;

        }


        return task;

    });


    saveTasks();

    displayTasks();

}



// Load tasks when page opens
displayTasks();

// Open Edit Modal

function editTask(id){

    let task = tasks.find(function(task){

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

function updateTask(){

    let newText =
    document.getElementById("editInput").value;


    tasks = tasks.map(function(task){

        if(task.id === editId){

            task.text = newText;

        }


        return task;

    });


    saveTasks();

    displayTasks();


    let modal =
    bootstrap.Modal.getInstance(
        document.getElementById("editModal")
    );


    modal.hide();

}