import React from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const TasksScreen = () => {
	return (
		<Paper sx={{ px: 2, my: 2, py: 2, minHeight: "90vh" }}>
			<Typography variant='h4' component='h1'>
				Tasks Screen
			</Typography>
		</Paper>
	);
};

export default TasksScreen;
