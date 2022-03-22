import React from "react";

import DialogActions from "@mui/material/DialogActions";
import LoadingButton from "@mui/lab/LoadingButton";

interface Props {
  submitButtonText: string;
  onSubmit?: () => void;
  isLoading?: boolean;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  hideButton?: boolean;
}

const DialogBigButtonFooter = (
  props: Props = { submitButtonText: "", isLoading: false, color: "primary", hideButton: false }
) => {
  return (
    <>
      <DialogActions>
        {!props.hideButton && (
          <LoadingButton
            type={props.onSubmit ? "button" : "submit"}
            onClick={props.onSubmit ? props.onSubmit : () => ({})}
            loading={props.isLoading}
            fullWidth
            variant="contained"
            sx={{ mb: 2, mx: 2 }}
            color={props.color}
          >
            {props.submitButtonText}
          </LoadingButton>
        )}
      </DialogActions>
    </>
  );
};

export default DialogBigButtonFooter;
