import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Paper from "@mui/material/Paper";
import Tab, { TabProps } from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel, { TabPanelProps } from "@mui/lab/TabPanel";

import CompanySettingsModule from "./CompanySettingsModule";
import AccountSettingsModule from "./AccountSettingsModule";

export const inactiveTabBgColor = "#FCFCFC";
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
		<Paper sx={{ px: 2, my: 2, py: 2, minHeight: "90vh" }}>
			<Typography variant='h4' component='h1'>
				Settings
			</Typography>
			<Box sx={{ bgcolor: "background.paper", mt: 3 }}>
				<TabContext value={primaryTabValue}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList
							onChange={handleChangePrimaryValue}
							aria-label='lab API tabs example'
							variant='scrollable'
							scrollButtons={true}
							allowScrollButtonsMobile
							sx={{
								"& .MuiTabs-scrollButtons.Mui-disabled": {
									opacity: 0.3,
								},
							}}
						>
							<Tab label='Account' value='account' sx={formCommonTabStyle(primaryTabValue, "account")} />
							<Tab label='Company' value='company' sx={formCommonTabStyle(primaryTabValue, "company")} />
						</TabList>
					</Box>
					<TabPanel value='account' sx={commonTabPanelStyle}>
						<AccountSettingsModule />
					</TabPanel>
					<TabPanel value='company' sx={commonTabPanelStyle}>
						<CompanySettingsModule />
					</TabPanel>
				</TabContext>
			</Box>
		</Paper>
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
};
