import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogoutThunk } from "../../shared/redux/slices/auth/thunks";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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

	return (
		<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} onClick={() => ({})}>
			<CircularProgress color='primary' size={50} thickness={4} />
		</Backdrop>
	);
};

export default LogoutScreen;
