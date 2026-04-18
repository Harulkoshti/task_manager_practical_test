import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks available. Add one above!</div>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggle={onToggle} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default TaskList;
