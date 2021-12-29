import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuthState } from "../shared/redux/store";

const AuthRoute: React.FC = ({ children }) => {
	const location = useLocation();

	const { isLoggedIn, access_token } = useSelector(selectAuthState);

	if (!isLoggedIn || !access_token) return <Navigate to='/login' replace state={{ from: location }} />;

	return <>{children}</>;
};

export default AuthRoute;
