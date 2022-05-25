import React from "react";
import { useTheme } from "@mui/material/styles";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { indigo, deepOrange } from "@mui/material/colors";

import { client } from "../../../api/client";
import { IParsedWidgetOnDashboard } from "../../../interfaces/Dashboard.interfaces";
import { MIN_DASHBOARD_WIDGET_HEIGHT } from "../../../../modules/DashboardScreen/DashboardPage";
import { PieChartStatistics } from "../../../interfaces/Statistics.interfaces";
import { parseDynamicParameters } from "../widget.helpers";

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <Box component="g">
      <Typography
        component="text"
        x={cx}
        y={cy - 20}
        dy={8}
        textAnchor="middle"
        fontSize={36}
        fontWeight={900}
        fill="#5F5F5F"
      >
        {Number(Number(percent ?? 0) * 100).toFixed(0)}%
      </Typography>
      <Typography
        component="text"
        x={cx}
        y={cy + 20}
        dy={8}
        textAnchor="middle"
        fontSize={18}
        fontWeight={600}
        fill={fill}
      >
        {payload.name}
      </Typography>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius}
        outerRadius={outerRadius + 8}
        fill={fill}
        fillOpacity="0.5"
      />
    </Box>
  );
};

interface IProps {
  widget: IParsedWidgetOnDashboard;
}

const PIE_CHART_COLORS = ["#2DD4BF", "#FB7185", indigo[300], deepOrange[300]];

const MyTasksCompletionChart = (props: IProps) => {
  const theme = useTheme();
  const [data, setData] = React.useState<PieChartStatistics>([]);
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(0);

  React.useEffect(() => {
    const params = new URLSearchParams();
    for (const item of props.widget.config) {
      params.append(item.parameter, item.value);
    }

    for (const dynamicParam of props.widget.variableOptions) {
      const parsed = parseDynamicParameters(dynamicParam);
      params.append(parsed.parameter, parsed.value);
    }

    const abortController = new AbortController();

    client
      .get(props.widget.path, { params, signal: abortController.signal })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);

          if (res?.data?.length > 0) {
            setActiveIndex(0);
          }
        }
      })
      .catch((err) => {
        if (err?.message !== "canceled") {
          console.log("Failed MyTasksCompletionChart", err);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [props.widget.config, props.widget.path, props.widget.variableOptions]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ResponsiveContainer width="100%" height="95%">
        <PieChart
          width={props.widget.widgetScale * 200}
          height={props.widget.widgetHeight * MIN_DASHBOARD_WIDGET_HEIGHT}
        >
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            fill={theme.palette.mode === "light" ? "#8884d8" : "#292929"}
            nameKey="name"
            dataKey="value"
            innerRadius="45%"
            onMouseEnter={(_, idx) => {
              setActiveIndex(idx);
            }}
            onMouseLeave={() => {
              if (data && data?.length > 0) {
                setActiveIndex(0);
              } else {
                setActiveIndex(undefined);
              }
            }}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] as any} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MyTasksCompletionChart;
