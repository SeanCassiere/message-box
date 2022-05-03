import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import BackdropLoader from "../../shared/components/SuspenseLoadingWrapper/BackdropLoader";

import { useSocket } from "../../shared/hooks/useSocket";
import { userLogoutThunk } from "../../shared/redux/slices/auth/thunks";
import { setAwakeDialogState } from "../../shared/redux/slices/user/userSlice";

const LogoutScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { disconnectSocket } = useSocket();

  useEffect(() => {
    dispatch(userLogoutThunk());
    const timeout = setTimeout(() => {
      navigate("/");
      disconnectSocket();
    }, 1000);
    dispatch(setAwakeDialogState(false));

    return () => {
      clearTimeout(timeout);
    };
  }, [disconnectSocket, dispatch, navigate]);

  return <BackdropLoader />;
};

export default LogoutScreen;
