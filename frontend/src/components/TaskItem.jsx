import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className="task-item">
      <div className="task-content">
        <span className={`task-name ${task.status === 'Completed' ? 'completed' : ''}`}>
          {task.name}
        </span>
      </div>
      <div className="actions">
        <button 
          className={`toggle-btn ${task.status === 'Completed' ? 'completed' : ''}`}
          onClick={() => onToggle(task.id)}
        >
          {task.status === 'Completed' ? 'Undo' : 'Complete'}
        </button>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
