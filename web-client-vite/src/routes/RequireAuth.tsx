import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuthState } from "../shared/redux/store";
import NavigationWrapper from "../shared/components/Layout/NavigationWrapper";

const RequireAuth = () => {
  const { isLoggedIn, access_token } = useSelector(selectAuthState);
  const location = useLocation();

  return isLoggedIn && access_token !== "" ? (
    <NavigationWrapper>
      <Outlet />
    </NavigationWrapper>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default RequireAuth;
