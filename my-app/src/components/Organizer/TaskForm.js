import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance'; // Ensure the correct path

function TaskForm({ addTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Not Started');
  
  // Assuming these values are known and static, you can set them here
  const assignedUser = localStorage.getItem('userId'); // Use userId from localStorage
  const eventId = "6698538210e34f47c1699c35"; // Replace with actual value

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = { title, description, dueDate, priority, status, assignedUser, eventId };
      await axiosInstance.post('/tasks', newTask);
      addTask(newTask);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setStatus('Not Started');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Due Date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div>
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
