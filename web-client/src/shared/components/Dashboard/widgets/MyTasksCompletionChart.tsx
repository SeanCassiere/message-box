import React from "react";

import { PieChart, Pie, Cell, ResponsiveContainer, PieLabelRenderProps, Sector } from "recharts";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { indigo, deepOrange } from "@mui/material/colors";

import { client } from "../../../api/client";
import { IParsedWidgetOnDashboard } from "../../../interfaces/Dashboard.interfaces";
import { MIN_DASHBOARD_WIDGET_HEIGHT } from "../../../../modules/DashboardScreen/DashboardPage";
import { PieChartStatistics } from "../../../interfaces/Statistics.interfaces";
import { parseDynamicParameters } from "../widget.helpers";

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = (props: PieLabelRenderProps) => {
//   const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
//   console.log(props);

//   if (!Number(percent)) {
//     return <React.Fragment></React.Fragment>;
//   }

//   const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;

//   const x = (cx as number) + (radius as number) * Math.cos(-midAngle * RADIAN);
//   const y = (cy as number) + (radius as number) * Math.sin(-midAngle * RADIAN);

//   return (
//     <Typography
//       component="text"
//       x={x}
//       y={y}
//       fill={"white"}
//       fontSize={15}
//       textAnchor="middle"
//       dominantBaseline="central"
//       fontWeight={500}
//     >
//       {props?.name} {Number(Number(percent) * 100).toFixed(1)}%
//     </Typography>
//   );
// };

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <Typography
        component="text"
        x={cx}
        y={cy - 20}
        dy={8}
        textAnchor="middle"
        fontSize={30}
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
    </g>
  );
};

interface IProps {
  widget: IParsedWidgetOnDashboard;
}

const PIE_CHART_COLORS = ["#2DD4BF", "#FB7185", indigo[300], deepOrange[300]];

const MyTasksCompletionChart = (props: IProps) => {
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
            // label={renderCustomizedLabel}
            fill="#8884d8"
            nameKey="name"
            dataKey="value"
            innerRadius="45%"
            onMouseEnter={(_, idx) => {
              setActiveIndex(idx);
            }}
            onMouseLeave={() => {
              setActiveIndex(undefined);
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
