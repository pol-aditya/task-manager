// function TaskList({ tasks, onDelete }) {
//   return (
//     <div>
//       {tasks.map((task) => (
//         <div key={task.id}>
//           <span>
//             {task.id} - {task.title}
//           </span>

//           <button onClick={() => onDelete(task.id)}>
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default TaskList;

import { useState } from "react";

function TaskList({ tasks, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    await onUpdate(editingId, editTitle);

    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>
          {editingId === task.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <button onClick={saveEdit}>Save</button>
            </>
          ) : (
            <>
              <span>
                {task.id} - {task.title}
              </span>

              <button onClick={() => startEditing(task)}>
                Edit
              </button>

              <button onClick={() => onDelete(task.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;