import { DateNavigator } from "@devexpress/dx-react-scheduler-material-ui";
import Button from "@mui/material/Button";

const DateNavigatorButtonComponent = ({ onVisibilityToggle, text }: DateNavigator.OpenButtonProps) => (
  <Button onClick={onVisibilityToggle} variant="outlined">
    {text}
  </Button>
);

export default DateNavigatorButtonComponent;
