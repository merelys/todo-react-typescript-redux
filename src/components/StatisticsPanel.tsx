import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  margin: 20px 0;
  gap: 12px;
`;

const StatCardWrapper = styled.div`
  display: flex;
`;

const StatCard = styled.div`
  flex: 1;
  padding: 14px 16px;
  margin: 10px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  text-align: center;

  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
`;

const ProgressWrapper = styled.div`
  flex: ;
`;

const ProgressBarWrapper = styled.div`
  height: 10px;
  width: 100%;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  border-radius: 999px;
  transition: width 0.4s ease;
`;

const ProgressText = styled.div`
  text-align: right;
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
`;

export const StatisticsPanel: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.value);

  const total = tasks.length;
  const completed = tasks.filter((el) => el.completed).length;
  const active = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return (
    <Wrapper>
      <StatCardWrapper>
        <StatCard>
          <StatNumber>{total}</StatNumber>
          <StatLabel>Total</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>{active}</StatNumber>
          <StatLabel>Active</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>{completed}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatCard>
      </StatCardWrapper>

      <ProgressWrapper>
        <ProgressBarWrapper>
          <ProgressBar percent={percent} />
        </ProgressBarWrapper>
        <ProgressText>{percent}% completed</ProgressText>
      </ProgressWrapper>
    </Wrapper>
  );
};
