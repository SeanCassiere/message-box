import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

const TextFieldComponent = (componentProps: TextFieldProps) => {
  const { InputLabelProps, InputProps, ...restOfProps } = componentProps;

  const propsToOverlay: TextFieldProps = {
    autoComplete: "off",
    variant: "outlined",
    InputLabelProps: { ...InputLabelProps },
    InputProps: {
      ...InputProps,
      sx: {
        bgcolor: "rgba(0,0,0, 0.03)",
        transition: "background-color ease-in 0.15s",
        "&:not(.Mui-error):focus, &:not(.Mui-error):focus-within": {
          bgcolor: "primary.50",
        },
      },
    },
    fullWidth: true,
    ...restOfProps,
  };

  return <TextField {...propsToOverlay} />;
};

export default TextFieldComponent;
