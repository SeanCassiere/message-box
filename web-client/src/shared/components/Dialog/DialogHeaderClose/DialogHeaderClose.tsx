import React from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { grey } from "@mui/material/colors";

import CloseIcon from "@mui/icons-material/Close";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QRCodeIcon from "@mui/icons-material/QrCode";
import PhoneIcon from "@mui/icons-material/PhoneIphone";
import PasswordIcon from "@mui/icons-material/Password";

interface Props {
  title: string;
  onClose?: () => void;
  startIconMode?: "add-icon" | "edit-icon" | "delete-icon" | "qrcode-icon" | "phone-icon" | "password-icon";
}

// const TEXT_COLOR = "whitesmoke";
const TEXT_COLOR = grey[700];

const COMMON_ICON_PROPS = { style: { marginRight: "5px" } };

const DialogHeaderClose = (props: Props) => {
  return (
    <DialogTitle
      sx={{
        color: TEXT_COLOR,
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap={1}>
        {props?.startIconMode === "add-icon" && <AddOutlinedIcon {...COMMON_ICON_PROPS} />}
        {props?.startIconMode === "edit-icon" && <EditIcon {...COMMON_ICON_PROPS} />}
        {props?.startIconMode === "delete-icon" && <DeleteIcon {...COMMON_ICON_PROPS} />}
        {props?.startIconMode === "qrcode-icon" && <QRCodeIcon {...COMMON_ICON_PROPS} />}
        {props?.startIconMode === "phone-icon" && <PhoneIcon {...COMMON_ICON_PROPS} />}
        {props?.startIconMode === "password-icon" && <PasswordIcon {...COMMON_ICON_PROPS} />}
        <Box flexGrow={1}>
          <Typography fontSize={18} fontWeight={500}>
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

export default DialogHeaderClose;
