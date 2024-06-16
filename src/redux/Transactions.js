import { createSlice } from "@reduxjs/toolkit";
import { getTransactionArray } from "../firebase";
const userLogged = localStorage.getItem("userLogged");
const transactionsArray = await getTransactionArray(userLogged);
const transactionsSlice = createSlice({
  name: "transactions",
  initialState: transactionsArray,
  
  reducers: {
    addTransaction(state, transaction) {
      state.push(transaction);
    },
  },
});

export const trsActions = transactionsSlice.actions;
export default transactionsSlice.reducer;
