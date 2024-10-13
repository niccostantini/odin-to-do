import "./styles.css"
import "./normalize.css"

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

function deleteToDoById(toDoId) {
    const keys = Object.keys(localStorage);
    for (let key of keys) {
        const project = fetchProjectById(key);
        if (project) {
            const toDoIndex = project.toDos.findIndex(toDo => toDo.id === toDoId);
            if (toDoIndex !== -1) {
                project.toDos.splice(toDoIndex, 1);
                localStorage.setItem(project.id, JSON.stringify(project));
                console.log(`Deleted ToDo with ID ${toDoId} from project with ID ${project.id}`);
                return;
            }
        }
    }
    console.error(`NO SUCH TODO EXISTS with ID ${toDoId}`);
}


localStorage.clear();
var prova = createProject("PorcoDio");
console.log(`Created project with ID ${prova.id} and title ${prova.title}`);

console.table(fetchProjectById(prova.id));
console.log(`Fetched project with ID ${prova.id}`);

addToDo("Nutri il gatto", "high", "ieri", prova.id);
console.log(`Added task to project with ID ${prova.id}`);

console.table(fetchProjectById(prova.id));

addToDo("Nuota tre volte", "high", "ieri", prova.id);

console.table(fetchProjectById(prova.id));

deleteToDoById(fetchProjectById(prova.id).toDos[1].id)

// deleteProjectById(prova.id);

// fetchProjectById(prova.id);