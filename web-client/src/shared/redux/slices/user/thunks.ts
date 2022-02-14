import { createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "../../../api/client";
import { IClientProfile } from "../../../interfaces/Client.interfaces";
import { IUserProfile } from "../../../interfaces/User.interfaces";
import { setUserProfileData, setClientProfileData } from "./userSlice";

export const getProfilesThunk = createAsyncThunk("user/getProfiles", async (_, { dispatch }) => {
  // fetch the user's profile
  try {
    const response = await client.get("/Users/Profile");
    if (response.status === 200) {
      const data = response.data as IUserProfile;
      dispatch(setUserProfileData(data));
    }
  } catch (error) {
    console.log(error);
  }

  // fetch the client's profile
  try {
    const response = await client.get("/Clients/Profile");
    const data = response.data as IClientProfile;
    if (response.status === 200) {
      dispatch(setClientProfileData(data));
    }
  } catch (error) {
    console.log(error);
  }
});

export const refreshUserProfileThunk = createAsyncThunk("user/refreshUserProfile", async (_, { dispatch }) => {
  try {
    const response = await client.get("/Users/Profile");

    if (response.status === 200) {
      const data = response.data as IUserProfile;
      dispatch(setUserProfileData(data));
    }
  } catch (error) {
    console.log(error);
  }
});
