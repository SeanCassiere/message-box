import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectAuthState } from "../../shared/redux/store";
import NavigationWrapper from "../../shared/components/Layout/NavigationWrapper";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NotFoundScreen = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(selectAuthState);

  const handleNavigateToHome = () => navigate("/");

  const Component = () => (
    <Box
      sx={{
        px: isLoggedIn ? 0 : 2,
        pt: 3,
        minHeight: isLoggedIn ? "calc(100vh - 7%)" : "100vh",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: isLoggedIn ? "85vh" : "95vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
            Resource not found
          </Typography>
          <Button onClick={handleNavigateToHome}>Go Home</Button>
        </Box>
      </Paper>
    </Box>
  );

  if (isLoggedIn) {
    return (
      <NavigationWrapper>
        <Component />
      </NavigationWrapper>
    );
  }

  return <Component />;
};

export default NotFoundScreen;
