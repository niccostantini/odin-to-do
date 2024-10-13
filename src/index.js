import "./styles.css"
import "./normalize.css"

function generateID() {
    return Math.random().toString(36).substr(2, 9); // Generate a random ID
}

// ToDo object
const ToDo = function(label, priority, dueDate, id = "") {
    this.id = id;
    this.label = label;
    this.priority = priority;
    this.dueDate = dueDate;
};

// Project  object
const Project = function (title, toDos = []) {
    this.id = generateID(); //This ID will be assigned to each child ToDo so that it will be easier to fetch
    this.title = title;
    this.toDos = toDos;

    this.addToDo = function (label, priority, dueDate) {
        const newToDo = new ToDo(label, priority, dueDate, this.id /** ID set as the same as its parent project's */);
        this.toDos.push(newToDo);
    };
};

// Project creation
function createProject(title, toDos = []) {
    const newProject = new Project(title, toDos);
    localStorage.setItem(newProject.id, JSON.stringify(newProject));
    return newProject;
};

//Project fetch function
/**  It returns the project as an object */
function fetchProjectById(id) {
    const projectData = localStorage.getItem(id); //get project based on ID
    if (projectData) {
        const projectObj = JSON.parse(projectData);
        return new Project(projectObj.title, projectObj.toDos);
    }
    else { /**In case the ID is not found, handle the error */
        console.error("NO SUCH PROJECT EXISTS");
        return null;
    }
}

console.log("CAZZO")

console.table(fetchProjectById("x1hsfsnnt"))