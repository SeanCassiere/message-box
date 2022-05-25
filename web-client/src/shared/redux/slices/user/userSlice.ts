import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClientProfile } from "../../../interfaces/Client.interfaces";
import { ICurrentUserStatusInterface, IUserProfile } from "../../../interfaces/User.interfaces";
import { DEFAULT_USER_STATUSES } from "../../../util/general";

import { getProfilesThunk } from "./thunks";

const themeKey = "MessageBox-Theme";

function setTheme(key: "light" | "dark") {
  localStorage.setItem(themeKey, key);
}

function getTheme() {
  const storage = localStorage.getItem(themeKey);
  if (storage?.toLowerCase() === "dark") {
    return "dark";
  } else {
    setTheme("light");
    return "light";
  }
}

interface UserSliceState {
  isLoadingProfileData: boolean;
  userProfile: IUserProfile | null;
  clientProfile: IClientProfile | null;
  roles: string[];
  permissions: string[];
  formats: {
    shortDateFormat: string;
    shortDateTimeFormat: string;
    longDateFormat: string;
    longDateTimeFormat: string;
    timeFormat: string;
    defaultDateRefreshInterval: number;
  };
  theme: "light" | "dark";
  statusList: ICurrentUserStatusInterface[];
  showAwakeDialog: boolean;
}

const initialState: UserSliceState = {
  isLoadingProfileData: false,
  userProfile: null,
  clientProfile: null,
  roles: [],
  permissions: [],
  formats: {
    shortDateFormat: "MM/DD/YYYY",
    shortDateTimeFormat: "MM/DD/YYYY h:mm a",
    longDateFormat: "MMMM Do YYYY",
    longDateTimeFormat: "MMMM Do YYYY h:mm a",
    timeFormat: "h:mm a",
    defaultDateRefreshInterval: 30000,
  },
  theme: getTheme(),
  statusList: DEFAULT_USER_STATUSES,
  showAwakeDialog: false,
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
    setAwakeDialogState(state, action: PayloadAction<boolean>) {
      state.showAwakeDialog = action.payload;
    },
    setToggleTheme(state) {
      setTheme(state.theme === "light" ? "dark" : "light");
      state.theme = state.theme === "light" ? "dark" : "light";
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

export const {
  setClearedUserState,
  setClientProfileData,
  setUserProfileData,
  setPermissionsAndRoles,
  setAwakeDialogState,
  setToggleTheme,
} = userSlice.actions;
export default userSlice;
