import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskManagement.css';

function TaskManagement({ eventId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Not Started');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log(`Fetching tasks for eventId: ${eventId}`);
        const response = await axios.get(`http://localhost:3001/tasks/event/${eventId}`);
        console.log('Fetched tasks:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
      }
    };
    if (eventId) {
      fetchTasks();
    }
  }, [eventId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate || !eventId) {
      console.error('All fields are required. Missing:', {
        title,
        description,
        dueDate,
        eventId
      });
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      eventId
    };

    try {
      console.log('Creating task with data:', taskData);
      const response = await axios.post('http://localhost:3001/tasks', taskData);
      console.log('Created task:', response.data);
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setStatus('Not Started');
      setAssignedTo('');
    } catch (error) {
      console.error('There was an error creating the task!', error);
    }
  };

  const handleTaskUpdate = async (taskId, updatedTask) => {
    try {
      console.log('Updating task with data:', updatedTask);
      const response = await axios.put(`http://localhost:3001/tasks/${taskId}`, updatedTask);
      setTasks(tasks.map(task => (task._id === taskId ? response.data : task)));
    } catch (error) {
      console.error('There was an error updating the task!', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      console.log(`Deleting task with id: ${taskId}`);
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('There was an error deleting the task!', error);
    }
  };

  return (
    <div className="task-management">
      <h2>Task Management</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="date"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="text"
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <button type="submit" className="btn">Create Task</button>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className="task">
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <button className="btn" onClick={() => handleTaskUpdate(task._id, { ...task, status: 'Completed' })}>Complete</button>
            <button className="btn" onClick={() => handleTaskDelete(task._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskManagement;
