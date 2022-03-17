import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const AppointmentTooltipHeaderComponent = (
  props: AppointmentTooltip.HeaderProps & {
    openDeleteOverlay?: (id: string | null) => void;
    customOnOpenClose?: (eventId: string) => void;
  }
) => {
  const CommandButton = props.commandButtonComponent;

  const openClose = () => {
    if (props.customOnOpenClose) {
      props.customOnOpenClose(`${props.appointmentData?.id ? props.appointmentData.id : "new"}`);
    }

    if (props.onHide) {
      props?.onHide();
    }
  };

  const openDelete = () => {
    if (props.onHide) {
      props.onHide();
    }

    if (props.openDeleteOverlay) {
      props.openDeleteOverlay(`${props.appointmentData?.id}`);
    }
  };

  return (
    <Paper sx={{ pt: 1, pb: 1, pr: 1 }}>
      <Grid container spacing={1} justifyContent="end">
        <Grid item>{props.showOpenButton && <CommandButton id="open" onExecute={openClose} />}</Grid>
        <Grid item>{props.showDeleteButton && <CommandButton id="delete" onExecute={openDelete} />}</Grid>
        <Grid item>{props.showCloseButton && <CommandButton id="close" onExecute={props.onHide} />}</Grid>
      </Grid>
    </Paper>
  );
};

export default AppointmentTooltipHeaderComponent;
