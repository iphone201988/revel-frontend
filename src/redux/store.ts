import { configureStore } from "@reduxjs/toolkit";
import { providerApi } from "./api/provider";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [providerApi.reducerPath]: providerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(providerApi.middleware),
});
setupListeners(store.dispatch);
