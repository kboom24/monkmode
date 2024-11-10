import React, { useState } from 'react';
import { Task } from '../types';
import { ArrowLeft, CheckCircle2, Circle, Plus } from 'lucide-react';

interface TaskBreakdownProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  onBack: () => void;
  darkMode: boolean;
}

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({
  task,
  onTaskUpdate,
  onBack,
  darkMode,
}) => {
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedTask = {
      ...task,
      subtasks: task.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    };
    onTaskUpdate(updatedTask);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      const updatedTask = {
        ...task,
        subtasks: [
          ...task.subtasks,
          { id: crypto.randomUUID(), title: newSubtask.trim(), completed: false },
        ],
      };
      onTaskUpdate(updatedTask);
      setNewSubtask('');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 ${
          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to task list
      </button>

      <div>
        <h3 className={`text-xl font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Step-by-Step Breakdown
        </h4>
        
        <div className="space-y-2">
          {task.subtasks.map(subtask => (
            <button
              key={subtask.id}
              onClick={() => handleSubtaskToggle(subtask.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              {subtask.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span className={`${
                subtask.completed
                  ? 'line-through text-gray-400'
                  : darkMode
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                {subtask.title}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleAddSubtask} className="flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add a new step..."
            className={`flex-1 rounded-lg px-4 py-2 ${
              darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-white text-gray-900 placeholder-gray-400 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="submit"
            className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskBreakdown;