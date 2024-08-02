import React from 'react';


function TaskList({ tasks, updateTask, deleteTask }) {
  return (
    <div>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => updateTask(task._id, { status: 'In Progress' })}>In Progress</button>
            <button onClick={() => updateTask(task._id, { status: 'Completed' })}>Completed</button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;