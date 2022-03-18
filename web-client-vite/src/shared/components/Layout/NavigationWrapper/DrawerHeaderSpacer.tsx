import { styled } from "@mui/material/styles";

const DrawerHeaderSpacer = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-start",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

export default DrawerHeaderSpacer;
