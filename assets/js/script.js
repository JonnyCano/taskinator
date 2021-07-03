var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

/* buttonEl.addEventListener("click", function() {
    var listItemEl = document.createElement("li"); // create a new task item
    listItemEl.className = "task-item"; // style the new task item
    listItemEl.textContent = "This is a new task."; // add the text
    tasksToDoEl.appendChild(listItemEl); // append this element to the task list
}); The next two functions are this function split into two */

// this is the function that will run when the user clicks on the button...
var createTaskHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";

    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
}

// and this is the function that calls it as a callback using an event listener
formEl.addEventListener("submit", createTaskHandler);