import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { inactiveTabBgColor } from "./SettingsScreen";

import AccountProfile from "./Account/AccountProfile";
import ChangePassword from "./Account/ChangePassword";

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
      {value === index && <Box sx={{ pl: 4, pr: 0.5, pt: 0, pb: 2 }}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const AccountSettingsModule = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", minHeight: "100%" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
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
        <Tab label="Profile" {...a11yProps(0)} sx={{ bgcolor: value === 0 ? "primary.50" : inactiveTabBgColor }} />
        <Tab
          label="Change Password"
          {...a11yProps(1)}
          sx={{ bgcolor: value === 1 ? "primary.50" : inactiveTabBgColor }}
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <AccountProfile />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ChangePassword />
      </TabPanel>
    </Box>
  );
};

export default AccountSettingsModule;
