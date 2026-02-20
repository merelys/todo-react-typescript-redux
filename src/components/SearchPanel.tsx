import React, { useState } from "react";
import styled from "styled-components";

const SearchWrapper = styled.div`
  width: 100%;
  padding: 10px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;

  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  box-sizing: border-box;

  font-size: 14px;
  color: #111827;

  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

interface SearchPanelProps {
  searchText: string;
  setSearchText: (value: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  searchText,
  setSearchText,
}) => (
  <SearchWrapper>
    <SearchInput
      type="text"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Search tasks..."
    />
  </SearchWrapper>
);
