import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import CompanyEmployees from "./Company/CompanyEmployees";
import CompanyRoles from "./Company/CompanyRoles";
import CompanyTeams from "./Company/CompanyTeams";
import CompanyProfile from "./Company/CompanyProfile";

import { inactiveTabBgColor } from "./SettingsScreen";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      sx={{ minWidth: "calc(100% - 170px)" }}
      {...other}
    >
      {value === index && <Box sx={{ pl: { sm: 0, md: 4 }, pr: { sm: 0, md: 0.5 }, pt: 0, pb: 2 }}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const CompanySettingsModule = () => {
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setValue(Number(event.target.value));
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", minHeight: "100%", flexDirection: isOnMobile ? "column" : "row" }}>
      {!isOnMobile && (
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChangeTabs}
          aria-label="Vertical tabs example"
          sx={{
            borderColor: "divider",
            minWidth: 170,
            pl: 0,
            textAlign: "left",
            pr: 0,
            mr: 0,
            minHeight: "100%",
          }}
          TabIndicatorProps={{ style: { backgroundColor: "secondary" } }}
        >
          {TABS_TO_PRINT.map((t) => (
            <Tab
              key={`tab-label-${t.label}-${t.value}`}
              label={t.label}
              {...a11yProps(t.value)}
              sx={{ bgcolor: value === t.value ? "primary.50" : inactiveTabBgColor }}
            />
          ))}
        </Tabs>
      )}
      {isOnMobile && (
        <Box>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tab</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={String(value)}
              label="Age"
              onChange={handleChangeSelect}
            >
              {TABS_TO_PRINT.map((t) => (
                <MenuItem key={`select-label-${t.label}-${t.value}`} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Box sx={{ width: "100%" }}>
        <TabPanel value={value} index={0}>
          <CompanyProfile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CompanyEmployees />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CompanyRoles />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CompanyTeams />
        </TabPanel>
      </Box>
    </Box>
  );
};

const TABS_TO_PRINT = [
  { label: "Profile", value: 0 },
  { label: "Employees", value: 1 },
  { label: "Roles", value: 2 },
  { label: "Teams", value: 3 },
];

export default CompanySettingsModule;
