import React from "react";
import { useTheme } from "@mui/material/styles";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { grey } from "@mui/material/colors";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QRCodeIcon from "@mui/icons-material/QrCode";
import PhoneIcon from "@mui/icons-material/PhoneIphone";
import PasswordIcon from "@mui/icons-material/Password";

const TEXT_COLOR = grey[700];

const commonIconProps = {
  style: {
    marginRight: "5px",
    fontSize: "2,5rem",
  },
  sx: {
    color: "primary.500",
  },
};

type StartIconModes = "add-icon" | "edit-icon" | "delete-icon" | "qrcode-icon" | "phone-icon" | "password-icon";

interface Props {
  title: string;
  onClose?: () => void;
  startIconMode?: StartIconModes;
}

const DialogHeaderClose = (props: Props) => {
  const theme = useTheme();

  return (
    <DialogTitle
      sx={{
        color: TEXT_COLOR,
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap={1}>
        {props?.startIconMode === "add-icon" && <AddOutlinedIcon {...commonIconProps} />}
        {props?.startIconMode === "edit-icon" && <EditIcon {...commonIconProps} />}
        {props?.startIconMode === "delete-icon" && <DeleteIcon {...commonIconProps} />}
        {props?.startIconMode === "qrcode-icon" && <QRCodeIcon {...commonIconProps} />}
        {props?.startIconMode === "phone-icon" && <PhoneIcon {...commonIconProps} />}
        {props?.startIconMode === "password-icon" && <PasswordIcon {...commonIconProps} />}
        <Box flexGrow={1}>
          <Typography fontSize={18} fontWeight={500} color={theme.palette.mode === "light" ? undefined : "primary.500"}>
            {props?.title}
          </Typography>
        </Box>
        {props.onClose && (
          <>
            <IconButton aria-label="Close" onClick={props.onClose} size="small" onMouseDown={props.onClose}>
              <CloseIcon sx={{ fontSize: "1.5rem", color: TEXT_COLOR }} />
            </IconButton>
          </>
        )}
      </Stack>
    </DialogTitle>
  );
};

export default React.memo(DialogHeaderClose);
