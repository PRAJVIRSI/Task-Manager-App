document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const searchInput = document.getElementById("search");
    const taskForm = document.getElementById("task-form");
    const descriptionInput = document.getElementById("description");
    const assigneeInput = document.getElementById("assignee");
    const priorityInput = document.getElementById("priority");
    const dueDateInput = document.getElementById("dueDate");
    const statusInput = document.getElementById("status");

    // Function to generate a random color
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to display tasks with random background colors
    function displayTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = "";
                tasks.forEach((task, index) => {
                    const taskItem = document.createElement("li");
                    const randomColor = getRandomColor();
                    taskItem.style.backgroundColor = randomColor;
                    taskItem.innerHTML = `Task ${index + 1}:
                        Description: ${task.description},
                        Assigned to: ${task.assignee},
                        Priority: ${task.priority},
                        Due Date: ${task.dueDate},
                        Status: ${task.status}
                        <button class="edit-button">Edit</button>
                        <button class="delete-button">Delete</button>`;
                    taskList.appendChild(taskItem);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    displayTasks(); // Initial display

    // Function to add a new task
    function addTask(event) {
        event.preventDefault();

        const description = descriptionInput.value;
        const assignee = assigneeInput.value;
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;
        const status = statusInput.value;

        const newTask = { description, assignee, priority, dueDate, status };

         // Make an AJAX POST request to add the task
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        })
            .then(response => response.json())
            .then(() => displayTasks())
            .catch(error => console.error('Error adding task:', error));

        // Clear form fields
        taskForm.reset();
    }

    // Function to edit a task
    function editTask(index) {
        const taskId = index + 1; // Assuming task IDs start from 1

        fetch(`/tasks/${taskId}`)
            .then(response => response.json())
            .then(task => {
                const updatedDescription = prompt("Enter updated description:", task.description);
                const updatedAssignee = prompt("Enter updated assignee:", task.assignee);
                const updatedPriority = prompt("Enter updated priority:", task.priority);
                const updatedDueDate = prompt("Enter updated due date (YYYY/MM/DD):", task.dueDate);
                const updatedStatus = prompt("Enter updated status:", task.status);

                const updatedTask = {
                    description: updatedDescription,
                    assignee: updatedAssignee,
                    priority: updatedPriority,
                    dueDate: updatedDueDate,
                    status: updatedStatus,
                };

                fetch(`/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTask),
                })
                    .then(response => response.json())
                    .then(() => displayTasks())
                    .catch(error => console.error('Error updating task:', error));
            })
            .catch(error => console.error('Error fetching task for editing:', error));
    }

    // Function to delete a task
    function deleteTask(index) {
        const taskId = index + 1; // Assuming task IDs start from 1

        fetch(`/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => displayTasks())
            .catch(error => console.error('Error deleting task:', error));
    }

    // Event listener for task list to handle "Edit" and "Delete" button clicks
    taskList.addEventListener("click", (event) => {
        const target = event.target;
        const taskItem = target.closest("li");

        if (target.classList.contains("edit-button") && taskItem) {
            const index = Array.from(taskItem.parentNode.children).indexOf(taskItem);
            editTask(index);
        } else if (target.classList.contains("delete-button") && taskItem) {
            const index = Array.from(taskItem.parentNode.children).indexOf(taskItem);
            deleteTask(index);
        }
    });

    // Event listeners
    taskForm.addEventListener("submit", addTask);
    searchInput.addEventListener("input", filterTasks);
});
