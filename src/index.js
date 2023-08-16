import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthContext, { AuthContextProvider } from "./Store/user-ctx";
import { Provider } from "react-redux";
import store from "./redux/MainRedux";
import { combineReducers } from "redux";




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthContextProvider>
);

