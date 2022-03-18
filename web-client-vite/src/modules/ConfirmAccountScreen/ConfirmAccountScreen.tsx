import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import BackdropLoader from "../../shared/components/SuspenseLoadingWrapper/BackdropLoader";

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
      }
      return navigate("/");
    })();
  }, [enqueueSnackbar, id, navigate]);

  return <BackdropLoader />;
};

export default ConfirmAccountScreen;
