import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Tab, { TabProps } from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel, { TabPanelProps } from "@mui/lab/TabPanel";

import CompanySettingsModule from "./CompanySettingsModule";
import AccountSettingsModule from "./AccountSettingsModule";
import PagePaperWrapper from "../../shared/components/PagePaperWrapper/PagePaperWrapper";

export const inactiveTabBgColor = "#F9F9F9";
const primaryOptions = ["account", "company"];

export const SettingsScreen = () => {
  const navigate = useNavigate();

  const { tab } = useParams<{ tab: string }>();
  const [primaryTabValue, setPrimaryTabValue] = useState("account");

  useEffect(() => {
    const lowercasePrimaryOptions = primaryOptions.map((option) => option.toLowerCase());
    if (tab && lowercasePrimaryOptions.includes(tab?.toLowerCase())) {
      setPrimaryTabValue(tab.toLowerCase());
    }
  }, [navigate, tab]);

  const handleChangePrimaryValue = (_: React.SyntheticEvent, newValue: string) => {
    setPrimaryTabValue(newValue);
    navigate(`/settings/${newValue}`);
  };
  return (
    <PagePaperWrapper>
      <Typography variant="h4" fontWeight={500} component="h1">
        Configuration
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TabContext value={primaryTabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "transparent" }}>
            <TabList
              onChange={handleChangePrimaryValue}
              aria-label="lab API tabs example"
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons.Mui-disabled": {
                  opacity: 0.3,
                },
              }}
            >
              <Tab label="Account" value="account" sx={formCommonTabStyle(primaryTabValue, "account")} />
              <Tab label="Company" value="company" sx={formCommonTabStyle(primaryTabValue, "company")} />
            </TabList>
          </Box>
          <TabPanel value="account" sx={commonTabPanelStyle}>
            <AccountSettingsModule />
          </TabPanel>
          <TabPanel value="company" sx={commonTabPanelStyle}>
            <CompanySettingsModule />
          </TabPanel>
        </TabContext>
      </Box>
    </PagePaperWrapper>
  );
};

const formCommonTabStyle = (value: string, identifier: string): TabProps["sx"] => {
  return {
    backgroundColor: value === identifier ? "primary.50" : inactiveTabBgColor,
    px: 4,
  };
};

const commonTabPanelStyle: TabPanelProps["sx"] = {
  p: 0,
  pt: 1.5,
  maxHeight: "100%",
};
