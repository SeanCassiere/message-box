import { memo } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { Toolbar } from "@devexpress/dx-react-scheduler-material-ui";

import { classes } from "./common";
const StyledDiv = styled("div")({
  [`&.${classes.toolbarRoot}`]: {
    position: "relative",
  },
});

const StyledLinearProgress = styled(LinearProgress)(() => ({
  [`&.${classes.progress}`]: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
}));

const ToolbarWithLoading = ({ children, ...restProps }: any) => (
  <StyledDiv className={classes.toolbarRoot}>
    <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
    <StyledLinearProgress className={classes.progress} />
  </StyledDiv>
);

export default memo(ToolbarWithLoading);
