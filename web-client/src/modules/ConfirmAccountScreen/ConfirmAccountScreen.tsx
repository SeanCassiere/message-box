import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { client } from "../../shared/api/client";

const ConfirmAccountScreen = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		(async () => {
			try {
				await client.post("/Users/ConfirmUser", {
					token: id,
				});
			} catch (error) {
				console.log(error);
				return navigate("/");
			}
		})();
	}, [id, navigate]);

	return (
		<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} onClick={() => ({})}>
			<CircularProgress color='primary' size={50} thickness={4} />
		</Backdrop>
	);
};

export default ConfirmAccountScreen;
