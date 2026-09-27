import { useEffect, useState } from "react";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = async (title) => {
    const newTask = await createTask(title);
    setTasks([...tasks, newTask]);
  };

  const handleUpdate = async (id, title) => {
    const updatedTask = await updateTask(id, title);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? updatedTask : task
      )
    );
  };

  const handleDelete = async (id) => {
    await deleteTask(id);

    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h1>Task Manager</h1>

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

export default App;