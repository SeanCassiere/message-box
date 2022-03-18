import React from "react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const BackdropLoader = () => {
  return (
    <Backdrop sx={{ color: "#fff" }} open={true} onClick={() => ({})}>
      <CircularProgress color="primary" size={50} thickness={4} />
    </Backdrop>
  );
};

export default BackdropLoader;
