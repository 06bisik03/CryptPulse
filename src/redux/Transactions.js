import { createSlice } from "@reduxjs/toolkit";

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: [],
  reducers: {
    setTransactions(state, action) {
      return Array.isArray(action.payload) ? action.payload : [];
    },
    addTransaction(state, action) {
      state.push(action.payload);
    },
  },
});

export const trsActions = transactionsSlice.actions;
export default transactionsSlice.reducer;
