import { createAsyncThunk } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

import { client } from "../../../api/client";
import { AccessTokenPair, JwtPayload } from "../../../interfaces/AccessToken.interfaces";
import { setClearedLookupState } from "../lookup/lookupSlice";
import { setClearedUserState, setPermissionsAndRoles } from "../user/userSlice";
import { setAccessToken, setClearedAuthState } from "./authSlice";

export const userLogoutThunk = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  try {
    await client.get("/Authentication/Logout");

    dispatch(setClearedAuthState());
    dispatch(setClearedUserState());
    dispatch(setClearedLookupState());
  } catch (error) {
    console.log(error);
  }
});

export const getRefreshedAccessTokenThunk = createAsyncThunk("auth/getNewAccessToken", async (_, { dispatch }) => {
  try {
    const response = await client.get("/Authentication/Login/Refresh");
    const data = response.data as AccessTokenPair;

    if (data.access_token) {
      const { permissions, roles } = jwt_decode<JwtPayload>(data.access_token);
      dispatch(setPermissionsAndRoles({ roles, permissions }));
      dispatch(setAccessToken({ accessToken: data.access_token }));
    } else {
      dispatch(userLogoutThunk());
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
});
