var taskIdCounter = 0;
var tasks = [];
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

/* buttonEl.addEventListener("click", function() {cd
    var listItemEl = document.createElement("li"); // create a new task item
    listItemEl.className = "task-item"; // style the new task item
    listItemEl.textContent = "This is a new task."; // add the text
    tasksToDoEl.appendChild(listItemEl); // append this element to the task list
}); The next two functions are this function split into two */

// this is the function that will run when the user clicks on the button...
var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value; // select the element by its class name, and then check to see if it also has the specific data attribute value
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
}

var createTaskEl = function(taskDataObj) {

    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);
    
    // finalize the function by appending taskActionsEl to listItemEl before listItemEl is appended to the page
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();

    // increase task counter for nest unique id
    taskIdCounter++;
}
 // each task will have its own set of form elements that perform different actions
var createTaskActions = function(taskId) {
    // create a new div element with the class name task-actions
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    // add an array for looping
    var statusChoices = ["To Do", "In Progress", "Completed"];

    // write the for loop logic
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated!");

    // reset the form
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

// define a function that will handle the edit
var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    
    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    // this will add the taskId to a data-task-id attribute on the form itself
    formEl.setAttribute("data-task-id", taskId);
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    // get task items from localStorage
    tasks = localStorage.getItem("tasks", tasks);

    // // check if tasks is equal to null
    // if (tasks === null || !tasks) {
    //     tasks = [];
    //     return false;
    // }

    // convert tasks from the string format back into an array of objects
    tasks = JSON.parse(tasks);

    // iterate through a tasks array and create task elements on the page from it
    for (var i = 0; i < tasks.length; i++) {
        taskIdCounter = tasks[i].id;
        
        // create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";

        // add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        
        // create a div element and store it in a variable named taskInfoEl
        var taskInfoEl = document.createElement("div")

        // give it a class name property of task-info
        taskInfoEl.className = "task-info"

        // set its innerHTML property to:
        taskInfoEl.innerHTML = "<h3 class ='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>"

        // append taskInfoEl to listItemEl
        listItemEl.appendChild(taskInfoEl)

        // create the actions for the task
        var taskActionsEl = createTaskActions(tasks[i].id)

        // append taskActionsEl to listItemEl
        listItemEl.appendChild(taskActionsEl)

        if (tasks[i].status == "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0
            tasksToDoEl.appendChild(listItemEl)
        } else if (tasks[i].status == "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1
            tasksInProgressEl.appendChild(listItemEl)
        } else if (tasks[i].status == "complete") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2
            tasksCompletedEl.appendChild(listItemEl)
        }

        taskIdCounter++

        console.log(listItemEl)
    }
}

pageContentEl.addEventListener("click", taskButtonHandler);

// and this is the function that calls it as a callback using an event listener
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();