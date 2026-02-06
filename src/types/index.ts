export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export const FilterStatus = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
} as const;

export type FilterStatus = (typeof FilterStatus)[keyof typeof FilterStatus];
