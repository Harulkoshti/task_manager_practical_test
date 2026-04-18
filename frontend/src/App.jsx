import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, toggleTask, deleteTask, setFilter } from './store/tasksSlice';
import TaskList from './components/TaskList';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const { items: tasks, filter, status } = useSelector(state => state.tasks);
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    dispatch(addTask(newTaskName));
    setNewTaskName('');
  };

  const handleToggleTask = (id) => {
    dispatch(toggleTask(id));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <div>
      <h1>Task Manager</h1>

      <form onSubmit={handleAddTask} className="input-group">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button
          type="submit"
          className="add-btn"
          disabled={!newTaskName.trim()}
        >
          Add Task
        </button>
      </form>

      <div className="filters">
        {['All', 'Pending', 'Completed'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => dispatch(setFilter(f))}
          >
            {f}
          </button>
        ))}
      </div>

      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

export default App;
