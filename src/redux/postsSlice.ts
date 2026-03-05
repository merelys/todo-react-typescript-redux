import { createSlice, isAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IPost } from "../types";

export interface PostsState {
  value: IPost[];
}

const initialState: PostsState = {
  value: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.value = action.payload;
    },

    deletePosts: (state) => {
      state.value.length = 0;
    },
  },
});

export const { setPosts, deletePosts } = postsSlice.actions;

export default postsSlice.reducer;
