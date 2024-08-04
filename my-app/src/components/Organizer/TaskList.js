import React from 'react';
import axiosInstance from '../../utils/axiosInstance'; // Ensure the correct path

function TaskList({ tasks, updateTask, deleteTask }) {
  const handleUpdateTask = async (taskId, updates) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}`, updates);
      updateTask(taskId, updates);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

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
            <button onClick={() => handleUpdateTask(task._id, { status: 'In Progress' })}>In Progress</button>
            <button onClick={() => handleUpdateTask(task._id, { status: 'Completed' })}>Completed</button>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
