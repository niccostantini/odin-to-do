import "./styles.css"
import "./normalize.css"
import { createProjectDialog, createTaskDialog } from "./forms";

const createProjectButton = document.querySelector('.create-project');
createProjectButton.addEventListener('click', () => {
    createProjectDialog();
});

function generateID() {
    return Math.random().toString(36).substr(2, 9); // Generate a random ID
}

// ToDo object
const ToDo = function(label, priority, dueDate, id) {
    this.id = id;
    this.label = label;
    this.priority = priority;
    this.dueDate = dueDate;
};

// Project object
const Project = function (id, title, toDos = []) {
    this.id = id;
    this.title = title;
    this.toDos = toDos.map(toDo => new ToDo(toDo.label, toDo.priority, toDo.dueDate, toDo.id));

    this.addToDo = function (label, priority, dueDate, id) {
        const newToDo = new ToDo(label, priority, dueDate, id);
        this.toDos.push(newToDo);
    };
    
};

// Project creation
function createProject(title, toDos = []) {
    const newProject = new Project(generateID(), title, toDos);
    console.log("Generated Project ID:", newProject.id);

    localStorage.setItem(newProject.id, JSON.stringify(newProject));

    console.log("Stored Project ID:", newProject.id);

    return newProject;
}

// Project fetch function
function fetchProjectById(id) {
    const projectData = localStorage.getItem(id);
    if (projectData) {
        const projectObj = JSON.parse(projectData);
        return new Project(projectObj.id, projectObj.title, projectObj.toDos);
    } else {
        console.error("NO SUCH PROJECT EXISTS");
        return null;
    }
}

function addToDo(label, priority, dueDate, projectId) {
    const project = fetchProjectById(projectId);
    if (project) {
        project.addToDo(label, priority, dueDate, generateID()); //Set random ID for each task
        localStorage.setItem(projectId, JSON.stringify(project));
    }
}

function deleteProjectById(id) {
    const project = fetchProjectById(id);
    if (project) {
        localStorage.removeItem(id);
        console.log(`Deleted project with ID ${id}`);
    } else {
        console.error("NO SUCH PROJECT EXISTS");
    }
}

/**
 * Deletes a ToDo item by its ID.
 * @param {string} toDoId - The ID of the ToDo item to delete.
 */
function deleteToDoById(toDoId) {
    // Get all keys from localStorage
    const keys = Object.keys(localStorage).filter(key => key !== 'initialiseCheck');
    
    // Iterate over each key
    for (let key of keys) {
        // Fetch the project by its ID
        const project = fetchProjectById(key);
        
        if (project) {
            // Find the index of the ToDo item with the given ID
            const toDoIndex = project.toDos.findIndex(toDo => toDo.id === toDoId);
            
            // If the ToDo item is found, remove it from the project's toDos array
            if (toDoIndex !== -1) {
                project.toDos.splice(toDoIndex, 1);
                
                // Update the project in localStorage
                localStorage.setItem(project.id, JSON.stringify(project));
                
                console.log(`Deleted ToDo with ID ${toDoId} from project with ID ${project.id}`);
                return;
            }
        }
    }
    
    // If no ToDo item with the given ID is found, log an error message
    console.error(`NO SUCH TODO EXISTS with ID ${toDoId}`);
}


// var prova = createProject("PorcoDio");
// console.log(`Created project with ID ${prova.id} and title ${prova.title}`);

// console.table(fetchProjectById(prova.id));
// console.log(`Fetched project with ID ${prova.id}`);

// addToDo("Nutri il gatto", "high", "ieri", prova.id);
// console.log(`Added task to project with ID ${prova.id}`);

// console.table(fetchProjectById(prova.id));

// addToDo("Nuota tre volte", "high", "ieri", prova.id);

// console.table(fetchProjectById(prova.id));

// deleteToDoById(fetchProjectById(prova.id).toDos[1].id)

// deleteProjectById(prova.id);

// fetchProjectById(prova.id);


function initializeMockProjects() {
    const mockProjects = [
        {
            id: generateID(),
            title: "Project 1",
            toDos: [
                { label: "Task 1.1", priority: "low", dueDate: "2023-10-01", id: generateID() },
                { label: "Task 1.2", priority: "medium", dueDate: "2023-10-02", id: generateID() }
            ]
        },
        {
            id: generateID(),
            title: "Project 2",
            toDos: [
                { label: "Task 2.1", priority: "high", dueDate: "2023-10-03", id: generateID() }
            ]
        },
        {
            id: generateID(),
            title: "Project 3",
            toDos: [
                { label: "Task 3.1", priority: "low", dueDate: "2023-10-04", id: generateID() },
                { label: "This is an extremely long task and let's see what it looks like", priority: "medium", dueDate: "2023-10-05", id: generateID() },
                { label: "Task 3.3", priority: "high", dueDate: "2023-10-06", id: generateID() }
            ]
        },
        {
            id: generateID(),
            title: "Project 4",
            toDos: [
                { label: "Task 4.1", priority: "medium", dueDate: "2023-10-07", id: generateID() },
                { label: "Task 4.2", priority: "high", dueDate: "2023-10-08", id: generateID() }
            ]
        }
    ];

    mockProjects.forEach(project => createProject(project.title, project.toDos));
}

function populateProjects() {
    const main = document.querySelector('main');
    main.innerHTML = ''; // Clear existing content

    const keys = Object.keys(localStorage).filter(key => key !== 'initialiseCheck');
    keys.forEach(key => {
        const project = fetchProjectById(key);
        if (project) {
            const projectSection = document.createElement('section');
            projectSection.classList.add('project');

            const projectHeader = document.createElement('div');
            projectHeader.classList.add('project-header');

            const projectTitle = document.createElement('h2');
            projectTitle.classList.add('project-title');
            projectTitle.textContent = project.title;

            const projectId = document.createElement('span');
            projectId.classList.add('project-id');
            projectId.textContent = project.id;

            const projectActions = document.createElement('div');
            projectActions.classList.add('project-actions');

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', (e) => {
                createTaskDialog(e); //Open the dialog to add a task
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                deleteProjectById(project.id); //Delete the project from LocalStorage
                populateProjects(); // Refresh the project list
                if(document.querySelector('main').textContent == '') {
                    document.querySelector('main').innerHTML='<div style="grid-column: 2;"><h3>No projects to display. Click on the button below ↘️ to create a new project!</h3></div>';
                }
            });

            projectActions.appendChild(editBtn);
            projectActions.appendChild(deleteBtn);

            projectHeader.appendChild(projectTitle);
            projectHeader.appendChild(projectId);
            projectHeader.appendChild(projectActions);

            const todoList = document.createElement('ul');
            todoList.classList.add('todo-list');

            project.toDos.forEach(toDo => {
                const todoItem = document.createElement('li');
                todoItem.classList.add('todo-item');

                const todoLeft = document.createElement('div');
                todoLeft.classList.add('todo-left');

                const todoLabel = document.createElement('span');
                todoLabel.classList.add('todo-label');
                todoLabel.textContent = toDo.label;

                const todoDueDate = document.createElement('span');
                todoDueDate.classList.add('todo-due-date');
                todoDueDate.textContent = toDo.dueDate;

                todoLeft.appendChild(todoLabel);
                const separator = document.createTextNode(' 🗓️ ');
                todoLeft.appendChild(separator);
                todoLeft.appendChild(todoDueDate);

                const todoPriority = document.createElement('span');
                todoPriority.classList.add('todo-priority', 'todo-right');
                todoPriority.textContent = toDo.priority;
                switch (toDo.priority) {
                    case 'low':
                        todoPriority.classList.add('low');
                        break;
                    case 'medium':
                        todoPriority.classList.add('medium');
                        break;
                    case 'high':
                        todoPriority.classList.add('high');
                        break;
                    default:    // Default case for invalid priority
                        todoPriority.classList.add('medium');
                        break;  
                }

                const todoId = document.createElement('span');
                todoId.classList.add('todo-id');
                todoId.textContent = toDo.id;

                todoItem.appendChild(todoLeft);
                todoItem.appendChild(todoPriority);
                todoItem.appendChild(todoId);

                todoList.appendChild(todoItem);
            });

            projectSection.appendChild(projectHeader);
            projectSection.appendChild(todoList);

            main.appendChild(projectSection);
        }
    });
}

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('main').textContent == '') {
            document.querySelector('main').innerHTML='<div style="grid-column: 2;"><h3>No projects to display. Click on the button below ↘️ to create a new project!</h3></div>';
        }
    });

    if (localStorage.getItem('initialiseCheck') != 'true' && document.querySelector('main').textContent != '') {
        console.log("Initialising mock projects...");
        initializeMockProjects();
        populateProjects();
        localStorage.setItem('initialiseCheck', 'true');
        const keys = Object.keys(localStorage).filter(key => key !== 'initialiseCheck');
        keys.forEach(key => {
            console.table(fetchProjectById(key));
        });
    } else if (document.querySelector('main').textContent == '') {
        document.querySelector('main').innerHTML='<div style="grid-column: 2;"><h3>No projects to display. Click on the button below ↘️ to create a new project!</h3></div>';
    }

    populateProjects()

export {generateID, createProject, fetchProjectById, addToDo, deleteProjectById, deleteToDoById, populateProjects}