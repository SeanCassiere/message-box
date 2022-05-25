import React, { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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

const AccountSettingsModule = () => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { module } = useParams<{ module: string }>();

  useEffect(() => {
    const availableModules = TABS_TO_PRINT.map((tab) => tab.urlRef);
    if (module && availableModules.includes(module.toLowerCase())) {
      const findTab = TABS_TO_PRINT.find((tab) => tab.urlRef === module.toLowerCase());
      if (findTab) {
        setValue(findTab.value);
        navigate(`/settings/${TAB_NAME}/${module.toLowerCase()}`);
      }
    }
  }, [module, navigate]);

  const [value, setValue] = React.useState(0);

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    const findTab = TABS_TO_PRINT.find((tab) => tab.value === Number(newValue));
    if (findTab) {
      navigate(`/settings/${TAB_NAME}/${findTab.urlRef}`);
      // setValue(Number(newValue));
    }
    setValue(newValue);
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    const findTab = TABS_TO_PRINT.find((tab) => tab.value === Number(event.target.value));
    if (findTab) {
      navigate(`/settings/${TAB_NAME}/${findTab.urlRef}`);
      // setValue(Number(event.target.value));
    }
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
              sx={{
                bgcolor:
                  theme.palette.mode === "light"
                    ? () => {
                        return value === t.value ? "primary.50" : inactiveTabBgColor;
                      }
                    : () => {
                        return value === t.value ? "secondary.900" : "#292929";
                      },
              }}
            />
          ))}
        </Tabs>
      )}
      {isOnMobile && (
        <Box>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={String(value)}
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
          <AccountProfile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ChangePassword />
        </TabPanel>
      </Box>
    </Box>
  );
};

const TAB_NAME = "account";

const TABS_TO_PRINT = [
  { label: "My Account", value: 0, urlRef: "my-account" },
  { label: "Change Password", value: 1, urlRef: "change-password" },
];

export default AccountSettingsModule;
