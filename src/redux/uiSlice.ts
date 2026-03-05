import { createSlice, isAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface uiState {
  selectedUserId: number;
}

const initialState: uiState = {
  selectedUserId: 0,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedUserId: (state, action: PayloadAction<number>) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const { setSelectedUserId } = uiSlice.actions;

export default uiSlice.reducer;
