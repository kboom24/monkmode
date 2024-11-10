import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Brain, Clock, Zap } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, TaskEnergy, ExecutiveFunction } from '../types';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [task, setTask] = useState<Task>(() => {
    return initialTask || {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      priority: 'medium' as TaskPriority,
      status: 'today' as TaskStatus,
      energy: 'medium' as TaskEnergy,
      category: '',
      completed: false,
      subtasks: [],
      timeEstimate: 30,
    };
  });

  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTask(initialTask);
      } else {
        setTask({
          id: crypto.randomUUID(),
          title: '',
          description: '',
          priority: 'medium',
          status: 'today',
          energy: 'medium',
          category: '',
          completed: false,
          subtasks: [],
          timeEstimate: 30,
        });
      }
      setNewSubtask('');
    }
  }, [isOpen, initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title.trim()) {
      onSave(task);
      onClose();
    }
  };

  const addSubtask = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    
    if (newSubtask.trim()) {
      setTask({
        ...task,
        subtasks: [
          ...task.subtasks,
          { id: crypto.randomUUID(), title: newSubtask.trim(), completed: false },
        ],
      });
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setTask({
      ...task,
      subtasks: task.subtasks.filter((st) => st.id !== id),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value as TaskPriority })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value as TaskStatus })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="energy" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Energy Level
              </label>
              <select
                id="energy"
                value={task.energy}
                onChange={(e) => setTask({ ...task, energy: e.target.value as TaskEnergy })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low Energy</option>
                <option value="medium">Medium Energy</option>
                <option value="high">High Energy</option>
              </select>
            </div>

            <div>
              <label htmlFor="executiveFunction" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <Brain className="w-4 h-4" />
                Executive Function
              </label>
              <select
                id="executiveFunction"
                value={task.executiveFunction}
                onChange={(e) => setTask({ ...task, executiveFunction: e.target.value as ExecutiveFunction })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="planning">Planning</option>
                <option value="organization">Organization</option>
                <option value="time-management">Time Management</option>
                <option value="emotional-control">Emotional Control</option>
                <option value="focus">Focus</option>
                <option value="memory">Memory</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="timeEstimate" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Time Estimate (minutes)
            </label>
            <input
              id="timeEstimate"
              type="number"
              min="5"
              step="5"
              value={task.timeEstimate}
              onChange={(e) => setTask({ ...task, timeEstimate: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={task.category}
              onChange={(e) => setTask({ ...task, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Work, Personal, Study"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break It Down (Subtasks)
            </label>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1">{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                  placeholder="Add a subtask and press Enter"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addSubtask()}
                  className="p-2 text-blue-500 hover:text-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDialog;