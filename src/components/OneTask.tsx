import React from "react";
import styled from "styled-components";
import { Task } from "../types";

interface TaskProps {
  task: Task;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
}

const TaskItem = styled.div<{ completed: boolean }>`
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
`;

const TaskRow = styled.div<{ completed: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  padding: 10px 12px;
  border-radius: 12px;
  background: #f9fafb;

  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  opacity: ${({ completed }) => (completed ? 0.6 : 1)};

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: #f3f4f6;
  }
`;

const TaskText = styled.span`
  cursor: pointer;
  font-size: 14px;
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
`;

export const OneTask: React.FC<TaskProps> = ({
  task,
  toggleTask,
  removeTask,
}) => {
  return (
    <TaskRow completed={task.completed}>
      <TaskItem completed={task.completed}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />
        <TaskText>
          {task.id}. {task.title}
        </TaskText>
        <DeleteButton onClick={() => removeTask(task.id)}>Delete</DeleteButton>
      </TaskItem>
    </TaskRow>
  );
};
