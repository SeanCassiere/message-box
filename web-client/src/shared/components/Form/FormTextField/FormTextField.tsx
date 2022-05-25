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
    InputLabelProps: { required: asteriskRequired, ...InputLabelProps },
    InputProps: {
      ...InputProps,
      sx: {
        bgcolor: theme.palette.mode === "light" ? "rgba(0,0,0, 0.03)" : undefined,
        transition: "background-color ease-in 0.15s",
        "&:not(.Mui-error):focus, &:not(.Mui-error):focus-within": {
          bgcolor: theme.palette.mode === "light" ? "primary.50" : undefined,
        },
      },
    },
    fullWidth: true,
    ...restOfProps,
  };

  return <Component {...propsToOverlay} />;
};

export default React.memo(FormTextField);
