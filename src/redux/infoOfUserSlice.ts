import { createSlice, isAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface InfoOfUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface InfoOfUserState {
  infoOfUser: InfoOfUser | null;
}

const initialState: InfoOfUserState = {
  infoOfUser: null,
};

export const infoOfUserSlice = createSlice({
  name: "infoOfUser",
  initialState,
  reducers: {
    setInfoOfUser: (state, action: PayloadAction<InfoOfUser>) => {
      state.infoOfUser = action.payload;
    },
  },
});

export const { setInfoOfUser } = infoOfUserSlice.actions;

export default infoOfUserSlice.reducer;
