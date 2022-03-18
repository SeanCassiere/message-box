import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoleProfile, ITeamProfile } from "../../../interfaces/Client.interfaces";
import { IUserProfile } from "../../../interfaces/User.interfaces";

import { getAllLookupListsThunk } from "./thunks";

interface LookupSliceState {
	isLoadingLookupData: boolean;
	rolesList: IRoleProfile[];
	usersList: IUserProfile[];
	teamsList: ITeamProfile[];
}

const initialState: LookupSliceState = {
	isLoadingLookupData: false,
	rolesList: [],
	usersList: [],
	teamsList: [],
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

export const { setClearedLookupState, setLookupRoles, setLookupUsers, setLookupTeams } = lookupSlice.actions;
export default lookupSlice;
