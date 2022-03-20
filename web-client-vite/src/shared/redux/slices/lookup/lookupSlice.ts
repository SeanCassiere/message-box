import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoleProfile, ITeamProfile } from "../../../interfaces/Client.interfaces";
import { ISocketUserStatus } from "../../../interfaces/Socket.interfaces";
import { IUserProfile } from "../../../interfaces/User.interfaces";

import { getAllLookupListsThunk } from "./thunks";

interface LookupSliceState {
  isLoadingLookupData: boolean;
  rolesList: IRoleProfile[];
  usersList: IUserProfile[];
  teamsList: ITeamProfile[];
  onlineUsersList: ISocketUserStatus[];
}

const initialState: LookupSliceState = {
  isLoadingLookupData: false,
  rolesList: [],
  usersList: [],
  teamsList: [],
  onlineUsersList: [],
};

const lookupSlice = createSlice({
  name: "lookup",
  initialState,
  reducers: {
    setClearedLookupState: (state) => {
      state.isLoadingLookupData = false;
      state.rolesList = [];
      state.usersList = [];
      state.teamsList = [];
    },
    setLookupRoles: (state, action: PayloadAction<IRoleProfile[]>) => {
      state.rolesList = action.payload;
    },
    setLookupUsers: (state, action: PayloadAction<IUserProfile[]>) => {
      state.usersList = action.payload;
    },
    setLookupTeams: (state, action: PayloadAction<ITeamProfile[]>) => {
      state.teamsList = action.payload;
    },
    setOnlineUsersLookupList: (state, action: PayloadAction<ISocketUserStatus[]>) => {
      state.onlineUsersList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllLookupListsThunk.pending, (state) => {
      state.isLoadingLookupData = true;
    });
    builder.addCase(getAllLookupListsThunk.fulfilled, (state) => {
      state.isLoadingLookupData = false;
    });
    builder.addCase(getAllLookupListsThunk.rejected, (state) => {
      state.isLoadingLookupData = false;
    });
  },
});

export const { setClearedLookupState, setLookupRoles, setLookupUsers, setLookupTeams, setOnlineUsersLookupList } =
  lookupSlice.actions;
export default lookupSlice;
