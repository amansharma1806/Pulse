// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import jwtReducer from "./Slices/JwtSlice";
import userReducer from "./Slices/UserSlice";

const store = configureStore({
  reducer: {
    jwt: jwtReducer,
    user: userReducer,
  },
});

export default store;
