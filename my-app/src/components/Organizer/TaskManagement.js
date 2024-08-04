import React, { useState, useEffect } from 'react';
import './TaskManagement.css';
import axiosInstance from '../../utils/axiosInstance';

function TaskManagement({ tasks, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Not Started');
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = { title, description, dueDate, priority, status };
      if (isEditing) {
        await axiosInstance.put(`/tasks/${editTaskId}`, newTask);
        setIsEditing(false);
        setEditTaskId(null);
      } else {
        await axiosInstance.post('/tasks', newTask);
      }
      fetchTasks();
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setStatus('Not Started');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = (task) => {
    setIsEditing(true);
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate.split('T')[0]);
    setPriority(task.priority);
    setStatus(task.status);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <section className="task-management">
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">{isEditing ? 'Update Task' : 'Add Task'}</button>
      </form>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search Tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">Filter by Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="task-list">
        {tasks
          .filter(task => task.title.includes(search))
          .filter(task => (filterPriority ? task.priority === filterPriority : true))
          .filter(task => (filterStatus ? task.status === filterStatus : true))
          .map(task => (
            <div className="task" key={task._id}>
              <div className="task-details">
                <p><strong>Title:</strong> {task.title}</p>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Status:</strong> {task.status}</p>
              </div>
              <div className="task-actions">
                <button className="btn-edit" onClick={() => handleEditTask(task)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default TaskManagement;
