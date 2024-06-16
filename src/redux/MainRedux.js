import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "./Coins";
import transactionsReducer from "./Transactions";
import apiReducer from './Api'

const store = configureStore({
  reducer: { coins: coinsReducer, transactions: transactionsReducer, api: apiReducer },
});

export default store;
