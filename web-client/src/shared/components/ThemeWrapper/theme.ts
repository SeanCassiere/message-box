import { createTheme } from "@mui/material/styles";

import { teal, blueGrey } from "@mui/material/colors";

export const theme = createTheme({
	palette: {
		mode: "light",
		primary: teal,
		secondary: blueGrey,
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
				disableRipple: true,
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
				InputLabelProps: {
					shrink: true,
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "white",
					color: teal[600],
					borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
				},
			},
		},
	},
});
