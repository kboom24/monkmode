import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface TaskTransitionProps {
  children: React.ReactNode;
}

const TaskTransition: React.FC<TaskTransitionProps> = ({ children }) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      timeout={300}
      classNames="task"
      unmountOnExit
    >
      <div ref={nodeRef}>{children}</div>
    </CSSTransition>
  );
};

export default TaskTransition;