import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './TaskManagementPage.css';

function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('There was an error fetching the tasks!', error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('There was an error fetching users!', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  const handleTaskDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('There was an error deleting the task!', error);
    }
  };

  const handleTaskCompleteToggle = async (taskId, status) => {
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, { status });
      setTasks(tasks.map(task => (task._id === taskId ? response.data : task)));
    } catch (error) {
      console.error('There was an error updating the task status!', error);
    }
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
  };

  const handleTaskUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/tasks/${editingTask._id}`, editingTask);
      setTasks(tasks.map(task => (task._id === editingTask._id ? response.data : task)));
      setEditingTask(null);
    } catch (error) {
      console.error('There was an error updating the task!', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'in-progress') return task.status === 'In Progress';
    return true;
  });

  return (
    <div className="task-management-page">
      <h1>Task Management</h1>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('in-progress')}>In Progress</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task._id} className="task-item">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Assigned To: {users.find(user => user._id === task.assignedTo)?.name}</p>
            <p>Status: {task.status}</p>
            <div className="task-actions">
              <button onClick={() => handleTaskCompleteToggle(task._id, task.status === 'Completed' ? 'In Progress' : 'Completed')}>
                {task.status === 'Completed' ? 'Mark as In Progress' : 'Mark as Completed'}
              </button>
              <button onClick={() => handleTaskEdit(task)}>Edit</button>
              <button onClick={() => handleTaskDelete(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingTask && (
        <div className="task-form">
          <h2>Edit Task</h2>
          <form onSubmit={handleTaskUpdate}>
            <input
              type="text"
              placeholder="Title"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              required
            ></textarea>
            <input
              type="date"
              value={editingTask.dueDate}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
              required
            />
            <select
              value={editingTask.assignedTo}
              onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
              required
            >
              <option value="">Assign To</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
            <button type="submit">Update Task</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TaskManagementPage;
