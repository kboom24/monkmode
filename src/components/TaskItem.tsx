import React from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, Clock, AlertCircle, Edit2, Trash, Zap, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskItemProps {
  task: Task;
  nodeRef: React.RefObject<HTMLDivElement>;
  onTaskComplete: (taskId: string) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  darkMode: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  nodeRef,
  onTaskComplete,
  onTaskUpdate,
  onTaskDelete,
  onEditTask,
  darkMode,
}) => {
  const handleTaskComplete = () => {
    if (!task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    onTaskComplete(task.id);
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`rounded-lg shadow-sm p-4 transition-all hover:shadow-md ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleTaskComplete}
          className="mt-1 text-gray-400 hover:text-green-500 transition-colors"
          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-medium ${
              task.completed
                ? 'line-through text-gray-400'
                : darkMode
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            <div className="flex gap-2">
              <span 
                className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
                role="status"
              >
                {task.priority}
              </span>
              {task.energy && (
                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getEnergyColor(task.energy)}`}>
                  <Zap className="w-3 h-3" />
                  {task.energy} energy
                </span>
              )}
              {task.executiveFunction && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  {task.executiveFunction}
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => onEditTask(task)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                aria-label={`Edit task "${task.title}"`}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onTaskDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Delete task "${task.title}"`}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={`mt-1 text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {task.dueDate && (
              <div className="flex items-center gap-1" role="time">
                <Clock className="w-4 h-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {task.category && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>{task.category}</span>
              </div>
            )}
          </div>

          {task.subtasks.length > 0 && (
            <div 
              className={`mt-3 pl-2 border-l-2 ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}
              role="list"
              aria-label="Subtasks"
            >
              {task.subtasks.map((subtask) => (
                <div 
                  key={subtask.id} 
                  className="flex items-center gap-2 py-1"
                  role="listitem"
                >
                  <button
                    onClick={() => {
                      const updatedTask = {
                        ...task,
                        subtasks: task.subtasks.map((st) =>
                          st.id === subtask.id
                            ? { ...st, completed: !st.completed }
                            : st
                        ),
                      };
                      onTaskUpdate(updatedTask);
                    }}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                    aria-label={`Mark subtask "${subtask.title}" as ${subtask.completed ? 'incomplete' : 'complete'}`}
                  >
                    {subtask.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`${subtask.completed ? 'line-through text-gray-400' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;