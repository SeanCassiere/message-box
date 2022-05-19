import React from "react";
import { flushSync } from "react-dom";
import { Responsive, WidthProvider, Layouts } from "react-grid-layout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Fade from "@mui/material/Fade";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import WidgetsIcon from "@mui/icons-material/Widgets";

import WidgetCardItem from "../../shared/components/Dashboard/WidgetCard";
import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

import { usePermission } from "../../shared/hooks/usePermission";
import { IParsedWidgetOnDashboard, IWidgetFromApi } from "../../shared/interfaces/Dashboard.interfaces";

import { dummyPromise } from "../../shared/util/testingUtils";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ROW_LENGTH = 12;
const NORMAL_WIDGET_MIN_HEIGHT = 150;
const DEMO_WIDGETS = [
  {
    id: "11",
    widgetType: "EmployeeCalendar",
    widgetName: "Widget ID 11",
    isWidgetTall: false,
    widgetScale: 4,
    position: { x: 0, y: 0 },
    config: {},
  },
  {
    id: "12",
    widgetType: "EmployeeTasks",
    isWidgetTall: true,
    widgetName: "Remaining Tasks for Today",
    widgetScale: 4,
    position: { x: 4, y: 0 },
    config: {
      for: "Today",
      currentDate: new Date().toISOString(),
    },
  },
  {
    id: "13",
    widgetType: "TeamTaskCompletion",
    isWidgetTall: false,
    widgetName: "Widget ID 13",
    widgetScale: 4,
    position: { x: 0, y: 2 },
    config: {},
  },
];

const DashboardPage = () => {
  const theme = useTheme();

  const canWriteToDashboard = usePermission("dashboard:write");
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = React.useState(true);
  const [layouts, setLayouts] = React.useState<Layouts | null>(null); // used for internal management of the layout
  const [dashboardWidgets, setDashboardWidgets] = React.useState<IParsedWidgetOnDashboard[]>([]);

  const fetchWidgets = React.useCallback(async ({ showSkeleton = false }) => {
    if (showSkeleton) setLoading(true);
    const items = await dummyPromise(1500).then(() => {
      flushSync(() => {
        setLoading(false);
      });
      const fetchedData: IWidgetFromApi[] = DEMO_WIDGETS as unknown as IWidgetFromApi[];
      const parsedWidgets: IParsedWidgetOnDashboard[] = fetchedData.map((w) => ({
        ...w,
        i: w.id,
        w: w.widgetScale,
        h: w.isWidgetTall ? 4 : 2,
        x: w.position.x,
        y: w.position.y,
      }));
      return parsedWidgets;
    });
    setDashboardWidgets(items);
  }, []);

  React.useEffect(() => {
    fetchWidgets({});
  }, [fetchWidgets]);

  const onLayoutChange = React.useCallback(
    (currentLayout: ReactGridLayout.Layout[], allLayouts: Layouts) => {
      const tempArray = dashboardWidgets;
      setLayouts(allLayouts);
      currentLayout?.forEach((position) => {
        tempArray[Number(position.i)].x = position.x;
        tempArray[Number(position.i)].y = position.y;
        tempArray[Number(position.i)].w = position.w;
        tempArray[Number(position.i)].h = position.h;
      });
      setDashboardWidgets(tempArray);
    },
    [dashboardWidgets]
  );

  const [deleteWidgetId, setDeleteWidgetId] = React.useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  const deleteWidgetById = React.useCallback(
    (id: string) => {
      const tempArray = [...dashboardWidgets.filter((w) => w.id !== id)];
      setDashboardWidgets(tempArray);
    },
    [dashboardWidgets]
  );

  const openDeleteWidgetConfirmation = React.useCallback((id: string) => {
    setDeleteWidgetId(id);
    setShowDeleteConfirmation(true);
  }, []);

  const demoAddNewWidget = React.useCallback(
    (widthParam: number = 4) => {
      const newWidth = widthParam;

      let newX = 0;
      let newY = 0;

      const sortRowByY = [...dashboardWidgets].sort((a, b) => a.y - b.y);
      const lastItem = sortRowByY[sortRowByY.length - 1];

      if (lastItem) {
        let currentY = 0;
        let remainingWidth = ROW_LENGTH;

        currentY = lastItem.y;

        const itemsInLastRow = sortRowByY.filter((item) => item.y === currentY);
        remainingWidth = ROW_LENGTH - itemsInLastRow.reduce((acc, item) => acc + item.w, 0);

        if (remainingWidth >= newWidth) {
          newX = lastItem.x + lastItem.w;
        } else {
          currentY++;
          newX = 0;
        }

        newY = currentY % 2 === 0 ? currentY : currentY + 1;
      }

      const newItem: IParsedWidgetOnDashboard = {
        ...DEMO_WIDGETS[0],
        id: "widget" + (dashboardWidgets.length + 1),
        widgetName: "// Widget ID " + (dashboardWidgets.length + 1),
        i: "widget" + (dashboardWidgets.length + 1),
        x: newX,
        y: newY,
        w: newWidth,
        h: DEMO_WIDGETS[0].isWidgetTall ? 4 : 2,
        position: { x: newX, y: newY },
      };
      const newArrayOfWidgets = [...dashboardWidgets, newItem];
      setDashboardWidgets(newArrayOfWidgets);
    },
    [dashboardWidgets]
  );

  return (
    <>
      <ConfirmDeleteDialog
        open={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setDeleteWidgetId(null);
        }}
        onConfirm={() => {
          if (!deleteWidgetId) return;
          deleteWidgetById(deleteWidgetId);

          setShowDeleteConfirmation(false);
          setDeleteWidgetId(null);
        }}
      />
      <PagePaperWrapper>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={10} md={7} sx={{ mb: 1 }}>
            <Typography variant="h4" fontWeight={500} component="h1">
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={2} md={0} sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
            <IconButton sx={{ mr: 1 }} aria-label="refresh" onClick={() => fetchWidgets({ showSkeleton: true })}>
              <RefreshOutlinedIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack
              gap={2}
              flexDirection={{ sm: "column", md: "row" }}
              justifyContent={{ sx: "start", md: "end" }}
              alignItems={{ sm: "start", md: "center" }}
            >
              <IconButton
                sx={{ mr: 1, display: { xs: "none", sm: "none", md: "block" } }}
                aria-label="refresh"
                onClick={() => fetchWidgets({ showSkeleton: true })}
              >
                <RefreshOutlinedIcon />
              </IconButton>
              <Button
                aria-label="New Widget"
                startIcon={<WidgetsIcon />}
                onClick={() => {
                  demoAddNewWidget();
                }}
                disableElevation={false}
                disabled={!canWriteToDashboard}
              >
                New Widget
              </Button>
            </Stack>
          </Grid>
        </Grid>
        {loading && (
          <Grid container gap={2} sx={{ width: "100%" }}>
            {[...Array(5)].map((_, idx) => (
              <Fade in={loading} unmountOnExit key={`widget-skeleton-${idx}`}>
                <Grid item xs={12} md={4} sx={{ m: { sx: 0, md: -1 }, p: { sx: 0, md: 1 } }}>
                  <Paper sx={{ p: { sx: 1, md: 2 } }}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width={"100%"}
                      height={NORMAL_WIDGET_MIN_HEIGHT * 2}
                      sx={{ bgcolor: "grey.100" }}
                    />
                  </Paper>
                </Grid>
              </Fade>
            ))}
          </Grid>
        )}
        {/*  */}
        {!loading && (
          <>
            {dashboardWidgets.length <= 0 ? (
              <Grid container gap={2} sx={{ width: "100%" }}>
                <Fade in={true} unmountOnExit>
                  <Grid item xs={12} md={12}>
                    <Paper sx={{ flexGrow: 1, px: { sx: 1, md: 2 }, py: { sx: 1, md: 2 }, textAlign: "center" }}>
                      <Grid container>
                        <Grid item xs={12} md={12} lg={12}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              fontSize={18}
                              fontWeight={400}
                              sx={{
                                flexGrow: 1,
                                color: "grey.700",
                              }}
                            >
                              No widgets to display.
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Fade>
              </Grid>
            ) : (
              <Grid item xs={12} sm={12} md={12} sx={{ p: 0, m: 0 }}>
                <ResponsiveGridLayout
                  onLayoutChange={onLayoutChange}
                  onBreakpointChange={() => {
                    fetchWidgets({});
                  }}
                  isResizable={false}
                  isDraggable={canWriteToDashboard}
                  verticalCompact={true}
                  compactType={isOnMobile ? "vertical" : "horizontal"}
                  layouts={layouts ?? undefined}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  preventCollision={false}
                  cols={{ lg: 12, md: 12, sm: 8, xs: 4, xxs: 4 }}
                  autoSize={true}
                  containerPadding={[0, 0]}
                  rowHeight={NORMAL_WIDGET_MIN_HEIGHT}
                  margin={{
                    lg: [20, 20],
                    md: [20, 20],
                    sm: [20, 20],
                    xs: [20, 20],
                    xxs: [20, 20],
                  }}
                  style={{
                    /*
                      don't really know why this position: sticky is needed
                      but without it the dragging motion and cards become really weird
                    */
                    position: "sticky",
                  }}
                  draggableCancel=".grid-not-draggable"
                >
                  {dashboardWidgets?.map((widget, idx) => {
                    return (
                      <Paper
                        key={idx}
                        data-grid={{
                          x: widget?.x,
                          y: widget?.y,
                          w: widget?.w,
                          h: widget?.h,
                          i: widget.i,
                        }}
                      >
                        <WidgetCardItem widget={widget} deleteWidgetHandler={openDeleteWidgetConfirmation} />
                      </Paper>
                    );
                  })}
                </ResponsiveGridLayout>
              </Grid>
            )}
          </>
        )}
      </PagePaperWrapper>
    </>
  );
};

export default DashboardPage;
