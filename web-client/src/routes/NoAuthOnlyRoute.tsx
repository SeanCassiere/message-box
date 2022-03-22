import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuthState } from "../shared/redux/store";

const NoAuthOnlyRoute: React.FC = ({ children }) => {
	const location = useLocation();

	const { isLoggedIn, access_token } = useSelector(selectAuthState);

	if (isLoggedIn || access_token) return <Navigate to='/chat' replace state={{ from: location }} />;

	return <>{children}</>;
};

export default NoAuthOnlyRoute;
