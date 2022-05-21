import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authSlice from "./slices/auth/authSlice";
import lookupSlice from "./slices/lookup/lookupSlice";
import userSlice from "./slices/user/userSlice";
import dynamicDialogSlice from "./slices/dynamicDialog/dynamicDialogSlice";

const batchedReducers = combineReducers({
  [lookupSlice.name]: lookupSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [dynamicDialogSlice.name]: dynamicDialogSlice.reducer,
  [authSlice.name]: authSlice.reducer,
});

const store = configureStore({
  reducer: batchedReducers,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof batchedReducers>;

export const selectAuthState = (state: RootState) => state[authSlice.name];
export const selectUserState = (state: RootState) => state[userSlice.name];
export const selectLookupListsState = (state: RootState) => state[lookupSlice.name];
export const selectDynamicDialogState = (state: RootState) => state[dynamicDialogSlice.name];

export default store;
