import { get } from "http";
import React from "react";
import styled from "styled-components";
import { IUser } from "../types";

const Wrapper = styled.div`
  font-size: 13px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 300px;
  padding: 12px;

  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
`;

const Select = styled.select`
  width: 190px;
  padding: 6px 12px;

  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;

  font-size: 13px;
  color: #111827;
  text-align: left;

  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }

  option {
    padding: 6px 12px;
  }
`;

const Button = styled.button`
  width: 100px;

  padding: 6px 10px;

  border-radius: 8px;
  border: none;

  font-size: 12px;
  cursor: pointer;

  background: #4f46e5;
  color: white;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    backgroud: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
    opacity: 1;
  }

  &:disabled: hover {
    opacity: 1;
  }
`;

interface LoadFromAPIPanel {
  users: IUser[];
  selectedUserId: number;
  setSelectedUserId: (value: number) => void;
  getTasks: () => void;
}

export const LoadFromAPIPanel: React.FC<LoadFromAPIPanel> = ({
  users,
  selectedUserId,
  setSelectedUserId,
  getTasks,
}) => {
  return (
    <Wrapper>
      <Select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(Number(e.target.value))}
      >
        {" "}
        <option value="0"> Choose user...</option>
        {users.map((user: IUser) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </Select>

      <Button disabled={selectedUserId === 0} onClick={getTasks}>
        Get from API
      </Button>
    </Wrapper>
  );
};
