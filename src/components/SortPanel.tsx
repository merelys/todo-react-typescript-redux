import React from "react";
import { FilterStatus } from "../types";
import styled from "styled-components";

const SortBar = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 10px;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  border: none;

  font-size: 13px;
  cursor: pointer;

  background: ${({ $active }) => ($active ? "#4f46e5" : "#f3f4f6")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};

  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

interface SortsPanelProps {
  filterStatus: FilterStatus;
  setFilterStatus: (value: FilterStatus) => void;
}

export const SortPanel: React.FC<SortsPanelProps> = ({
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <SortBar>
      <SortButton
        $active={filterStatus === FilterStatus.ALL}
        onClick={() => setFilterStatus(FilterStatus.ALL)}
      >
        All
      </SortButton>
      <SortButton
        $active={filterStatus === FilterStatus.ACTIVE}
        onClick={() => setFilterStatus(FilterStatus.ACTIVE)}
      >
        Active
      </SortButton>
      <SortButton
        $active={filterStatus === FilterStatus.COMPLETED}
        onClick={() => setFilterStatus(FilterStatus.COMPLETED)}
      >
        Done
      </SortButton>
    </SortBar>
  );
};
