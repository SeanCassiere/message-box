import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useDispatch, useSelector } from "react-redux";

import DateAdapter from "@mui/lab/AdapterMoment";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import AppRoutes from "./routes/Routes";

import { ThemeWrapper } from "./shared/components/ThemeWrapper/ThemeWrapper";
import { selectAppProfileState, selectAuthState, selectLookupListsState } from "./shared/redux/store";
import { getProfilesThunk } from "./shared/redux/slices/user/thunks";
import { getRefreshedAccessTokenThunk } from "./shared/redux/slices/auth/thunks";
import { getAllLookupListsThunk } from "./shared/redux/slices/lookup/thunks";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  const { isLoadingProfileData } = useSelector(selectAppProfileState);
  const { isLoadingLookupData } = useSelector(selectLookupListsState);
  const { isLoggedIn, expiresAt, access_token } = useSelector(selectAuthState);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getProfilesThunk());
      dispatch(getAllLookupListsThunk());
    } else {
      dispatch(getRefreshedAccessTokenThunk());
    }
  }, [dispatch, isLoggedIn]);

  // auto refresh token
  useEffect(() => {
    if (!isLoggedIn || !expiresAt || !access_token) return;

    const tokenExpiresAt = Date.parse(expiresAt);
    const remainingTime = tokenExpiresAt - Date.now();

    const refreshInterval = setInterval(() => {
      const dateTimeRightNow = new Date();
      console.log(`Refreshing the access_token ${dateTimeRightNow.toISOString()}`);
      dispatch(getRefreshedAccessTokenThunk());
    }, remainingTime - 3000); // refresh 3s before expiry

    return () => {
      clearInterval(refreshInterval);
    };
  }, [access_token, dispatch, expiresAt, isLoggedIn]);

  // if the initial data is loading, show a full-screen loader
  if (isLoadingProfileData || isLoadingLookupData) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} onClick={() => ({})}>
        <CircularProgress color="primary" size={50} thickness={4} />
      </Backdrop>
    );
  }

  return (
    <ThemeWrapper>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <AppRoutes />
        </LocalizationProvider>
        {process.env.NODE_ENV === "production" && <ReactQueryDevtools initialIsOpen={false} />}
        {/** only show devtools in development */}
      </QueryClientProvider>
    </ThemeWrapper>
  );
};

export default App;
