export interface IUser {
  id: number;
  name: string;
}

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const FilterStatus = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
} as const;

export type FilterStatus = (typeof FilterStatus)[keyof typeof FilterStatus];
