import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClientProfile } from "../../../interfaces/Client.interfaces";
import { IUserProfile } from "../../../interfaces/User.interfaces";

import { getProfilesThunk } from "./thunks";

interface UserSliceState {
  isLoadingProfileData: boolean;
  userProfile: IUserProfile | null;
  clientProfile: IClientProfile | null;
  roles: string[];
  permissions: string[];
}

const initialState: UserSliceState = {
  isLoadingProfileData: false,
  userProfile: null,
  clientProfile: null,
  roles: [],
  permissions: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setClearedUserState: (state) => {
      state.clientProfile = null;
      state.userProfile = null;
    },
    setUserProfileData(state, action: PayloadAction<IUserProfile>) {
      state.userProfile = action.payload;
    },
    setClientProfileData(state, action: PayloadAction<IClientProfile>) {
      state.clientProfile = action.payload;
    },
    setPermissionsAndRoles(state, action: PayloadAction<{ roles: string[]; permissions: string[] }>) {
      state.roles = action.payload.roles;
      state.permissions = action.payload.permissions;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProfilesThunk.pending, (state) => {
      state.isLoadingProfileData = true;
    });
    builder.addCase(getProfilesThunk.fulfilled, (state) => {
      state.isLoadingProfileData = false;
    });
    builder.addCase(getProfilesThunk.rejected, (state) => {
      state.isLoadingProfileData = false;
    });
  },
});

export const { setClearedUserState, setClientProfileData, setUserProfileData, setPermissionsAndRoles } =
  userSlice.actions;
export default userSlice;
