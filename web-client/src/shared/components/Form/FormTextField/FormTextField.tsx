import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const Component = styled(TextField)((props) => ({}));

const FormTextField = ({
  asteriskRequired = undefined,
  ...componentProps
}: TextFieldProps & { asteriskRequired?: boolean }) => {
  const { InputLabelProps, InputProps, ...restOfProps } = componentProps;
  const theme = useTheme();

  const propsToOverlay: TextFieldProps = {
    autoComplete: "off",
    variant: "outlined",
    InputLabelProps: { required: restOfProps.required ? true : asteriskRequired, ...InputLabelProps },
    InputProps: {
      ...InputProps,
      sx: {
        bgcolor: theme.palette.mode === "light" ? "rgba(0,0,0, 0.01)" : undefined,
        transition: "background-color ease-in 0.15s",
        "&:not(.Mui-error):focus, &:not(.Mui-error):focus-within": {
          // bgcolor: theme.palette.mode === "light" ? "primary.50" : undefined,
          bgcolor: theme.palette.mode === "light" ? "rgba(224,242,241,0.5)" : "rgba(0,77,64,0.1)",
        },
        ...(asteriskRequired && {
          "& .MuiOutlinedInput-notchedOutline": {
            padding: "0 14px",
          },
        }),
      },
    },
    fullWidth: true,
    ...restOfProps,
  };

  return <Component {...propsToOverlay} />;
};

export default React.memo(FormTextField);
