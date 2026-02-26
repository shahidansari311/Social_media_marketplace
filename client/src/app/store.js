import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./features/listingSlice";
import chatReducer from "./features/chatSlice";
import adminReducer from "./features/adminSlice";

export const store = configureStore({
  reducer: {
    listing: listingReducer,
    chat: chatReducer,
    admin: adminReducer,
  },
});
