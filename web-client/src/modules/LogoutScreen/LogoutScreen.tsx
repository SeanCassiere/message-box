import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import BackdropLoader from "../../shared/components/SuspenseLoadingWrapper/BackdropLoader";

import { userLogoutThunk } from "../../shared/redux/slices/auth/thunks";

const LogoutScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userLogoutThunk());
    const timeout = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, navigate]);

  return <BackdropLoader />;
};

export default LogoutScreen;
