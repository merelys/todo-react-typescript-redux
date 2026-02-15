import { get } from "http";
import React from "react";
import styled from "styled-components";

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

const Input = styled.input`
  width: 45px;
  padding: 6px 8px;

  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;

  font-size: 13px;
  text-align: right;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: #ffffff;
  }
`;

const Button = styled.button`
  width: 170px;

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
`;

interface LoadFromAPIPanel {
  userId: number;
  setUserId: (value: number) => void;
  getData: () => void;
}

export const LoadFromAPIPanel: React.FC<LoadFromAPIPanel> = ({
  userId,
  setUserId,
  getData,
}) => {
  return (
    <Wrapper>
      user ID
      <Input
        type="number"
        value={userId}
        onChange={(e) => {
          const value = e.target.value;
          setUserId(value === "" ? 0 : Number(value));
        }}
        placeholder="user Id..."
      />
      <Button onClick={() => getData()}>Get from API</Button>
    </Wrapper>
  );
};
