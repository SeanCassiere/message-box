import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authSlice from "./slices/auth/authSlice";
import lookupSlice from "./slices/lookup/lookupSlice";
import userSlice from "./slices/user/userSlice";

const batchedReducers = combineReducers({
	[lookupSlice.name]: lookupSlice.reducer,
	[userSlice.name]: userSlice.reducer,
	[authSlice.name]: authSlice.reducer,
});

const store = configureStore({
	reducer: batchedReducers,
	middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof batchedReducers>;

export const selectAuthState = (state: RootState) => state.auth;
export const selectAppProfileState = (state: RootState) => state.user;
export const selectLookupListsState = (state: RootState) => state.lookup;

export default store;
