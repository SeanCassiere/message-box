import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { selectUserState } from "../../../shared/redux/store";

const ChangePassword = () => {
  const { userProfile } = useSelector(selectUserState);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
        <Box>
          <Typography variant="h5">Change Password</Typography>
        </Box>
        <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
          <IconButton color="secondary" aria-label="refresh">
            <RefreshOutlinedIcon />
          </IconButton>
          <Button startIcon={<EditOutlinedIcon />}>Edit</Button>
        </Box>
      </Box>
      <pre>{JSON.stringify(userProfile, null, 2)}</pre>
    </Box>
  );
};

export default ChangePassword;
