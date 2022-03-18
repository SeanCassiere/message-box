import { memo } from "react";
import { ViewSwitcher } from "@devexpress/dx-react-scheduler-material-ui";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ViewSwitcherComponent = ({
  currentView: switcherCurrentView,
  onChange: onViewChange,
  availableViews,
}: ViewSwitcher.SwitcherProps) => {
  const handleChangingView = (event: SelectChangeEvent<string>) => {
    onViewChange(event.target.value);
  };
  return (
    <Select
      value={switcherCurrentView.name}
      onChange={handleChangingView}
      size="small"
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      color="primary"
      variant="outlined"
    >
      {availableViews.map((view) => (
        <MenuItem key={`view-item-${view.name}`} value={view.name}>
          {view.displayName}
        </MenuItem>
      ))}
    </Select>
  );
};

export default memo(ViewSwitcherComponent);
