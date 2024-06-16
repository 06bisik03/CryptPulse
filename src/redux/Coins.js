import { createSlice } from "@reduxjs/toolkit";

const coinsSlice = createSlice({
  name: "coins",

  initialState: {
    coins: [],
  },
  reducers: {
    addCoin(state, action) {
      state.coins.push(action.payload);
    },
  },
});

export const coinsActions = coinsSlice.actions;
export default coinsSlice.reducer;
