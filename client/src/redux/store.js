import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/auth";
import api from "./api/api";
import miscSlice from "./reducer/misc";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (defaultMiddlware) => [...defaultMiddlware(), api.middleware]
});

export default store;
