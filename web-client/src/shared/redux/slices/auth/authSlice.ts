import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { JwtPayload } from "../../../interfaces/AccessToken.interfaces";

interface AuthSliceState {
  isLoggedIn: boolean;
  access_token: string | null;
  expiresAt: string | null;
}

const initialState: AuthSliceState = {
  isLoggedIn: false,
  access_token: null,
  expiresAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { exp } = jwt_decode<JwtPayload>(action.payload.accessToken);
      const expiresAt = new Date(exp * 1000);
      state.access_token = action.payload.accessToken;
      state.expiresAt = expiresAt.toISOString();
      state.isLoggedIn = true;
    },
    setClearedAuthState: (state) => {
      state.access_token = null;
      state.isLoggedIn = false;
      state.expiresAt = null;
    },
    setUserToLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.access_token = null;
      state.expiresAt = null;
    },
  },
});

export const { setAccessToken, setClearedAuthState, setUserToLoggedOut } = authSlice.actions;
export default authSlice;
