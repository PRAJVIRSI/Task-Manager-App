// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Create an instance of Express
const app = express();
const port = 4000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define the path to the tasks JSON file
const tasksFilePath = 'tasks.json';

// Function to read tasks from the JSON file
function readTasksFile() {
    try {
        // Read the file synchronously and parse its content
        const tasksFileContent = fs.readFileSync(tasksFilePath, 'utf8');
        return JSON.parse(tasksFileContent) || [];
    } catch (error) {
        // Handle errors during file reading
        console.error('Error reading tasks file:', error);
        return [];
    }
}

// Function to write tasks to the JSON file
function writeTasksFile(tasks) {
    try {
        // Write tasks to the file with proper formatting
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    } catch (error) {
        // Handle errors during file writing
        console.error('Error writing tasks file:', error);
    }
}

// Endpoint to get all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasksFile();
    res.json(tasks);
});

// Endpoint to get a single task by ID
app.get('/tasks/:id', (req, res) => {
    const tasks = readTasksFile();
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        res.json(task);
    } else {
        // Return 404 status if task is not found
        res.status(404).json({ error: 'Task not found' });
    }
});

// Endpoint to create a new task
app.post('/tasks', (req, res) => {
    const tasks = readTasksFile();
    const newTask = req.body;
    newTask.id = tasks.length + 1;
    tasks.push(newTask);
    writeTasksFile(tasks);
    res.json(newTask);
});

// Endpoint to update a task by ID
app.put('/tasks/:id', (req, res) => {
    const tasks = readTasksFile();
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask };
        writeTasksFile(tasks);
        res.json(tasks[index]);
    } else {
        // Return 404 status if task is not found
        res.status(404).json({ error: 'Task not found' });
    }
});

// Endpoint to delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasksFile();
    const taskId = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
        const deletedTask = tasks.splice(index, 1)[0];
        writeTasksFile(tasks);
        res.json(deletedTask);
    } else {
        // Return 404 status if task is not found
        res.status(404).json({ error: 'Task not found' });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
