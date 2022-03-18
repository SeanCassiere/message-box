import { createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "../../../api/client";
import { IRoleProfile, ITeamProfile } from "../../../interfaces/Client.interfaces";
import { IUserProfile } from "../../../interfaces/User.interfaces";
import { setLookupRoles, setLookupTeams, setLookupUsers } from "./lookupSlice";

export const getAllLookupListsThunk = createAsyncThunk("lookup/getLookupLists", async (_, { dispatch }) => {
  // fetch the all user roles for the client
  try {
    const response = await client.get("/Clients/Roles");
    if (response.status === 200) {
      const data = response.data as IRoleProfile[];
      dispatch(setLookupRoles(data));
    }
  } catch (error) {
    console.log(error);
  }

  // fetch the all teams for the client
  try {
    const response = await client.get("/Clients/Teams");
    if (response.status === 200) {
      const data = response.data as ITeamProfile[];
      dispatch(setLookupTeams(data));
    }
  } catch (error) {
    console.log(error);
  }

  // fetch the all users for the client
  try {
    const response = await client.get("/Clients/Users");
    if (response.status === 200) {
      const data = response.data as IUserProfile[];
      dispatch(setLookupUsers(data));
    }
  } catch (error) {
    console.log(error);
  }
});

export const getClientRolesLookupListThunk = createAsyncThunk(
  "lookup/getClientRolesLookupList",
  async (_, { dispatch }) => {
    // fetch the all user roles for the client
    try {
      const response = await client.get("/Clients/Roles");
      if (response.status === 200) {
        const data = response.data as IRoleProfile[];
        dispatch(setLookupRoles(data));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getClientTeamsLookupListThunk = createAsyncThunk(
  "lookup/getClientTeamsLookupList",
  async (_, { dispatch }) => {
    // fetch the all teams for the client
    try {
      const response = await client.get("/Clients/Teams");
      if (response.status === 200) {
        const data = response.data as ITeamProfile[];
        dispatch(setLookupTeams(data));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getClientUsersLookupListThunk = createAsyncThunk(
  "lookup/getClientUsersLookupList",
  async (_, { dispatch }) => {
    // fetch the all users for the client
    try {
      const response = await client.get("/Clients/Users");
      if (response.status === 200) {
        const data = response.data as IUserProfile[];
        dispatch(setLookupUsers(data));
      }
    } catch (error) {
      console.log(error);
    }
  }
);
