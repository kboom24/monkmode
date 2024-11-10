import React, { useMemo } from 'react';
import { Task } from '../types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  darkMode: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskUpdate,
  onTaskDelete,
  onEditTask,
  darkMode,
}) => {
  // Create refs map using useMemo to ensure consistent hook calls
  const taskRefs = useMemo(() => {
    return tasks.reduce<Record<string, React.RefObject<HTMLDivElement>>>((acc, task) => {
      acc[task.id] = React.createRef();
      return acc;
    }, {});
  }, [tasks]);

  return (
    <TransitionGroup className="space-y-4">
      {tasks.map((task) => (
        <CSSTransition
          key={task.id}
          timeout={300}
          classNames={{
            enter: 'task-enter',
            enterActive: 'task-enter-active',
            exit: 'task-exit',
            exitActive: 'task-exit-active',
          }}
          nodeRef={taskRefs[task.id]}
        >
          <TaskItem
            task={task}
            nodeRef={taskRefs[task.id]}
            onTaskComplete={onTaskComplete}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
            onEditTask={onEditTask}
            darkMode={darkMode}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default TaskList;