import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { SnackbarProvider } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import "moment-timezone";

import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import BackdropLoader from "./shared/components/SuspenseLoadingWrapper/BackdropLoader";
import AppRoutes from "./routes/Routes";

import { ThemeWrapper } from "./shared/components/ThemeWrapper/ThemeWrapper";
import { selectUserState, selectAuthState, selectLookupListsState } from "./shared/redux/store";
import { getProfilesThunk } from "./shared/redux/slices/user/thunks";
import { getRefreshedAccessTokenThunk } from "./shared/redux/slices/auth/thunks";
import { getAllLookupListsThunk } from "./shared/redux/slices/lookup/thunks";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  const { isLoadingProfileData } = useSelector(selectUserState);
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
    return <BackdropLoader />;
  }

  const notistackRef = React.createRef<any>();
  const onClickDismiss = (key: any) => () => {
    notistackRef?.current?.closeSnackbar(key);
  };

  return (
    <ThemeWrapper>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <SnackbarProvider
            maxSnack={4}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            ref={notistackRef}
            action={(key) => (
              <IconButton
                aria-label="Close"
                onClick={onClickDismiss(key)}
                size="small"
                onMouseDown={onClickDismiss(key)}
              >
                <CloseIcon sx={{ color: "#fff", fontSize: "1.3rem" }} />
              </IconButton>
            )}
            disableWindowBlurListener
            preventDuplicate
          >
            <AppRoutes />
          </SnackbarProvider>
        </LocalizationProvider>
        {import.meta.env.MODE !== "production" && <ReactQueryDevtools initialIsOpen={false} />}
        {/** only show devtools in development */}
      </QueryClientProvider>
    </ThemeWrapper>
  );
};

export default App;