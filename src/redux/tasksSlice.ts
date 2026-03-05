import { createSlice, isAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../types";

export interface TasksState {
  value: Task[];
}

const initialState: TasksState = {
  value: [],
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.value.push(action.payload);
    },

    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.value.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },

    removeTask: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((task) => task.id !== action.payload);
    },

    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.value = action.payload;
    },

    updateTask: (
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) => {
      const task = state.value.find((task) => task.id === action.payload.id);
      if (task) {
        {
          task.title = action.payload.title;
        }
      }
    },

    deleteTasks: (state) => {
      state.value.length = 0;
    },
  },
});

export const {
  addTask,
  toggleTask,
  removeTask,
  setTasks,
  updateTask,
  deleteTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
