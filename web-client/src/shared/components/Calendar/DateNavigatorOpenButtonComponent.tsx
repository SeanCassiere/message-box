import { DateNavigator } from "@devexpress/dx-react-scheduler-material-ui";
import Button from "@mui/material/Button";

const DateNavigatorOpenButtonComponent = ({ onVisibilityToggle, text }: DateNavigator.OpenButtonProps) => (
  <Button onClick={onVisibilityToggle} variant="outlined">
    {text}
  </Button>
);

export default DateNavigatorOpenButtonComponent;
