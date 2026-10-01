import { useEffect, useState } from "react";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";

function TasksPage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = async (title) => {
    try {
      const newTask = await createTask(title);

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (id, title) => {
    try {
      const updatedTask = await updateTask(id, title);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>

      <button onClick={onLogout}>
        Logout
      </button>

      <TaskForm onTaskCreated={handleTaskCreated} />

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default TasksPage;