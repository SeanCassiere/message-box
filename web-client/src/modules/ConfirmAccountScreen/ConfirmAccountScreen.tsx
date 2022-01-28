import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { client } from "../../shared/api/client";

const ConfirmAccountScreen = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      try {
        await client.post("/Users/ConfirmUser", {
          token: id,
        });
        enqueueSnackbar(`Success: Account confirmed.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 7500,
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar(`Error: Account confirmation failed.`, {
          variant: "error",
          autoHideDuration: 7500,
          anchorOrigin: { horizontal: "center", vertical: "top" },
        });
        return navigate("/");
      }
    })();
  }, [enqueueSnackbar, id, navigate]);

  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} onClick={() => ({})}>
      <CircularProgress color="primary" size={50} thickness={4} />
    </Backdrop>
  );
};

export default ConfirmAccountScreen;
