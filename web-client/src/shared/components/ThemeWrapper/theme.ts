import { ThemeOptions } from "@mui/material";
import { teal, blueGrey } from "@mui/material/colors";

export const theme: ThemeOptions = {
  palette: {
    primary: {
      main: teal[400],
      contrastText: "#fff",
      dark: teal[700],
      light: teal[200],
      50: teal[50],
      100: teal[100],
      200: teal[200],
      300: teal[300],
      400: teal[400],
      500: teal[500],
      600: teal[600],
      700: teal[700],
      800: teal[800],
      900: teal[900],
    },
    secondary: blueGrey,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableRipple: true,
        disableElevation: true,
      },
      styleOverrides: {
        text: {
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        InputLabelProps: {},
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: teal[300],
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#db3131",
          "&$error": {
            color: "#db3131",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderTop: 0,
          marginBottom: "1rem",
          [`&::before`]: {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {},
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "#F9F8F8",
          borderRadius: 10,
        },
      },
    },
  },
};
