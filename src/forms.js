import {Project, ToDo, generateID, createProject, fetchProjectById, addToDo, deleteToDoById, deleteProjectById, populateProjects} from './index.js';

function createProjectDialog() {
    // Create the dialog element
    const dialog = document.createElement('dialog');
    dialog.classList.add('project-dialog');

    // Create the form element
    const form = document.createElement('form');
    form.method = 'dialog';

    // Create the input for project title
    const projectTitleLabel = document.createElement('label');
    projectTitleLabel.textContent = 'Project Title:';
    const projectTitleInput = document.createElement('input');
    projectTitleInput.type = 'text';
    projectTitleInput.name = 'projectTitle';
    projectTitleInput.required = true;

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Create Project';

    const cancelButton = document.createElement('input');
    cancelButton.type = 'reset';
    cancelButton.value = 'Cancel';

    // Append elements to the form
    form.appendChild(projectTitleLabel);
    form.appendChild(projectTitleInput);
    form.appendChild(cancelButton);
    form.appendChild(submitButton);

    // Append form to the dialog
    dialog.appendChild(form);

    // Append dialog to the body
    document.body.appendChild(dialog);

    // Show the dialog
    dialog.showModal();

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const projectTitle = projectTitleInput.value;
        console.log(`Project Created: ${projectTitle}`);
        const newProject = {
            title: projectTitle,
            toDos: []
        };
        createProject(newProject.title, newProject.toDos);
        console.log(newProject);
        dialog.close();
        populateProjects();
    });

    form.addEventListener('reset', () => {
        dialog.close(); //Close the dialog together with resetting the form
    });
}

function createTaskDialog(event) {
    // Fetch the project by ID
    const projectId = event.target.closest('.project-header').querySelector('.project-id').textContent;
    const project = fetchProjectById(projectId);
    console.log(`Editing Project: ${project.title} (ID: ${project.id})`);

    // Create the dialog element
    const dialog = document.createElement('dialog');
    dialog.classList.add('task-dialog');

    // Create the form element
    const form = document.createElement('form');
    form.method = 'dialog';

    //create the form title "Tasks for Project: <project title>"
    const formTitle = document.createElement('h2');
    formTitle.textContent = `Tasks for Project: ${project.title}`;
    form.appendChild(formTitle);


    // Function to create a task row
    function createTaskRow(task = {}) {
        const taskRow = document.createElement('div');
        taskRow.classList.add('task-row');

        // Create the input for task title
        const taskTitleLabel = document.createElement('label');
        taskTitleLabel.textContent = 'Task Title:';
        const taskTitleInput = document.createElement('input');
        taskTitleInput.type = 'text';
        taskTitleInput.name = 'taskTitle';
        taskTitleInput.value = task.label || '';
        taskTitleInput.required = true;

        // Create the input for task priority
        const taskPriorityLabel = document.createElement('label');
        taskPriorityLabel.textContent = 'Task Priority:';
        const taskPrioritySelect = document.createElement('select');
        taskPrioritySelect.name = 'taskPriority';
        ['low', 'medium', 'high', 'done'].forEach(priority => {
            const option = document.createElement('option');
            option.value = priority;
            option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1); //Capitalise first letter for display
            if (task.priority === priority) {
                option.selected = true;
            }
            taskPrioritySelect.appendChild(option);
        });

        // Create the input for task due date
        const taskDueDateLabel = document.createElement('label');
        taskDueDateLabel.textContent = 'Task Due Date:';
        const taskDueDateInput = document.createElement('input');
        taskDueDateInput.type = 'date';
        taskDueDateInput.name = 'taskDueDate';
        taskDueDateInput.value = task.dueDate || '';

        // Create the delete button
        const deleteButton = document.createElement('input');
        deleteButton.type = 'reset';
        deleteButton.value = 'Delete Task';
        deleteButton.addEventListener('click', () => {
            taskRow.remove();
        });

        // Append elements to the task row
       
        taskRow.appendChild(taskTitleLabel);
        taskRow.appendChild(taskTitleInput);
        taskRow.appendChild(taskPriorityLabel);
        taskRow.appendChild(taskPrioritySelect);
        taskRow.appendChild(taskDueDateLabel);
        taskRow.appendChild(taskDueDateInput);
        taskRow.appendChild(deleteButton);
        taskRow.appendChild(document.createElement('hr'));

        return taskRow;
    }

    // Create existing task rows
    project.toDos.forEach(toDo => {
        form.appendChild(createTaskRow(toDo));
    });

    // Create the add task button
    const addTaskButton = document.createElement('button');
    addTaskButton.type = 'button';
    addTaskButton.textContent = 'Add Task';
    addTaskButton.addEventListener('click', () => {
        form.insertBefore(createTaskRow(), addTaskButton);
    });

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Save Tasks';

    const cancelButton = document.createElement('input');
    cancelButton.type = 'reset';
    cancelButton.value = 'Cancel';

    // Append elements to the form
    form.appendChild(addTaskButton);
    form.appendChild(cancelButton);

    cancelButton.addEventListener('click', () => {
        dialog.close(); // Close the dialog together with resetting the form
    });
    form.appendChild(submitButton);

    // Append form to the dialog
    dialog.appendChild(form);

    // Append dialog to the body
    document.body.appendChild(dialog);

    // Show the dialog
    dialog.showModal();

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(`Tasks Updated for Project: ${project.title} (ID: ${project.id})`);
        const tasks = [];
        form.querySelectorAll('.task-row').forEach(taskRow => {
            const taskTitle = taskRow.querySelector('input[name="taskTitle"]').value;
            const taskPriority = taskRow.querySelector('select[name="taskPriority"]').value;
            const taskDueDate = taskRow.querySelector('input[name="taskDueDate"]').value;
            tasks.push({
                id: generateID(),
                label: taskTitle,
                priority: taskPriority,
                dueDate: taskDueDate
            });
        });

        // Use the function deleteToDobyId to remove all tasks from the project
        project.toDos.forEach(task => {
            deleteToDoById(task.id, project.id);
        });

        console.table(project.toDos);

        // Add the new tasks to the project
        tasks.forEach(task => {
            addToDo(task.label, task.priority, task.dueDate, project.id);
            });
        dialog.close();
        document.querySelector('main').innerHTML = '';
        populateProjects();
    });
}

function editTaskDialog(event) {
    // Fetch the project and task by ID
    const projectId = event.target.closest('.project').querySelector('.project-id').textContent;
    const taskId = event.target.closest('.todo-item').querySelector('.todo-id').textContent;
    const project = fetchProjectById(projectId);
    const task = project.toDos.find(toDo => toDo.id === taskId);
    console.log(`Editing Task: ${task.label} (ID: ${task.id}) in Project: ${project.title} (ID: ${project.id})`);

    // Create the dialog element
    const dialog = document.createElement('dialog');
    dialog.classList.add('edit-task-dialog');

    // Create the form element
    const form = document.createElement('form');
    form.method = 'dialog';

    // Create the form title
    const formTitle = document.createElement('h2');
    formTitle.textContent = `Edit Task: ${task.label}`;
    form.appendChild(formTitle);

    // Create the input for task title
    const taskTitleLabel = document.createElement('label');
    taskTitleLabel.textContent = 'Task Title:';
    const taskTitleInput = document.createElement('input');
    taskTitleInput.type = 'text';
    taskTitleInput.name = 'taskTitle';
    taskTitleInput.value = task.label;
    taskTitleInput.required = true;

    // Create the input for task priority
    const taskPriorityLabel = document.createElement('label');
    taskPriorityLabel.textContent = 'Task Priority:';
    const taskPrioritySelect = document.createElement('select');
    taskPrioritySelect.name = 'taskPriority';
    ['low', 'medium', 'high', 'done'].forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1); // Capitalize first letter for display
        if (task.priority === priority) {
            option.selected = true;
        }
        taskPrioritySelect.appendChild(option);
    });

    // Create the input for task due date
    const taskDueDateLabel = document.createElement('label');
    taskDueDateLabel.textContent = 'Task Due Date:';
    const taskDueDateInput = document.createElement('input');
    taskDueDateInput.type = 'date';
    taskDueDateInput.name = 'taskDueDate';
    taskDueDateInput.value = task.dueDate;

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Save Task';

    const cancelButton = document.createElement('input');
    cancelButton.type = 'reset';
    cancelButton.value = 'Cancel';

    // Append elements to the form
    form.appendChild(taskTitleLabel);
    form.appendChild(taskTitleInput);
    form.appendChild(taskPriorityLabel);
    form.appendChild(taskPrioritySelect);
    form.appendChild(taskDueDateLabel);
    form.appendChild(taskDueDateInput);
    form.appendChild(cancelButton);
    form.appendChild(submitButton);

    cancelButton.addEventListener('click', () => {
        dialog.close(); // Close the dialog together with resetting the form
    });

    // Append form to the dialog
    dialog.appendChild(form);

    // Append dialog to the body
    document.body.appendChild(dialog);

    // Show the dialog
    dialog.showModal();

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(`Task Updated: ${task.label} (ID: ${task.id}) in Project: ${project.title} (ID: ${project.id})`);
        const updatedTask = {
            id: task.id,
            label: taskTitleInput.value,
            priority: taskPrioritySelect.value,
            dueDate: taskDueDateInput.value
        };

        // Update the task in the project
        deleteToDoById(task.id, project.id);
        addToDo(updatedTask.label, updatedTask.priority, updatedTask.dueDate, project.id);

        dialog.close();
        document.querySelector('main').innerHTML = '';
        populateProjects();
    });
}


export { createProjectDialog, createTaskDialog, editTaskDialog};