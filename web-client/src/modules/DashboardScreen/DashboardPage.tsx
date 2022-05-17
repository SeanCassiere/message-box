import React from "react";
import { flushSync } from "react-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Fade from "@mui/material/Fade";
import Masonry from "@mui/lab/Masonry";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import WidgetsIcon from "@mui/icons-material/Widgets";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import WidgetCardGridItem from "../../shared/components/Dashboard/WidgetCard";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

import { usePermission } from "../../shared/hooks/usePermission";
import { IWidgetOnDashboard } from "../../shared/interfaces/Dashboard.interfaces";

import { dummyPromise } from "../../shared/util/testingUtils";

const NORMAL_WIDGET_MIN_HEIGHT = 350;
const TALL_WIDGET_MIN_HEIGHT = 600;
const DEMO_WIDGETS: IWidgetOnDashboard[] = [
  {
    id: "22",
    widgetPosition: 1,
    widgetType: "EmployeeCalendar",
    widgetName: "My Calendar",
    isWidgetTall: false,
    widgetScale: 4,
    config: {},
  },
  {
    id: "33",
    widgetPosition: 2,
    widgetType: "TeamTaskCompletion",
    isWidgetTall: false,
    widgetName: "Widget 3",
    widgetScale: 4,
    config: {},
  },
  {
    id: "44",
    widgetPosition: 3,
    widgetType: "TeamTaskCompletion",
    isWidgetTall: false,
    widgetName: "Widget 4",
    widgetScale: 4,
    config: {},
  },
  {
    id: "55",
    widgetPosition: 4,
    widgetType: "TeamTaskCompletion",
    isWidgetTall: false,
    widgetName: "Widget 5",
    widgetScale: 4,
    config: {},
  },
];

const DashboardPage = () => {
  const canWriteToDashboard = usePermission("dashboard:write");

  const [loading, setLoading] = React.useState(true);
  const [widgets, setWidgets] = React.useState<IWidgetOnDashboard[]>([]);

  const sortedWidgets = React.useMemo(() => {
    return widgets.sort((a, b) => a.widgetPosition - b.widgetPosition);
  }, [widgets]);

  const fetchWidgets = React.useCallback(async () => {
    const items = await dummyPromise(500).then(() => {
      flushSync(() => {
        setLoading(false);
      });
      return DEMO_WIDGETS;
    });
    setWidgets(items);
  }, []);

  React.useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  const [deleteWidgetId, setDeleteWidgetId] = React.useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  const deleteWidgetById = React.useCallback(
    (id: string) => {
      let widgetList = [...widgets];

      const newWidgetList = [...widgetList].filter((w) => w.id !== id);
      for (let i = 0; i < newWidgetList.length; i++) {
        newWidgetList[i].widgetPosition = i + 1;
      }
      setWidgets(newWidgetList);
    },
    [widgets]
  );

  const openDeleteWidgetConfirmation = React.useCallback((id: string) => {
    setDeleteWidgetId(id);
    setShowDeleteConfirmation(true);
  }, []);

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
            <IconButton sx={{ mr: 1 }} aria-label="refresh" onClick={fetchWidgets}>
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
                onClick={fetchWidgets}
              >
                <RefreshOutlinedIcon />
              </IconButton>
              <Button
                aria-label="New Widget"
                startIcon={<WidgetsIcon />}
                onClick={() => ({})}
                disableElevation={false}
                disabled={!canWriteToDashboard}
              >
                New Widget
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Grid container gap={2} sx={{ width: "100%" }}>
          {loading && (
            <Grid container gap={2} sx={{ width: "100%" }}>
              {[...Array(3)].map((_, idx) => (
                <Fade in={loading} unmountOnExit key={`widget-skeleton-${idx}`}>
                  <Grid item xs={12} md={6} sx={{ m: { sx: 0, md: -1 }, p: { sx: 0, md: 1 } }}>
                    <Paper sx={{ p: { sx: 1, md: 2 } }}>
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width={"100%"}
                        height={NORMAL_WIDGET_MIN_HEIGHT}
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
              {widgets.length <= 0 ? (
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
                <Grid item xs={12} md={12}>
                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;

                      let newWidgetList = [...widgets];
                      if (newWidgetList[result.source.index]) {
                        newWidgetList = newWidgetList.filter((w) => w.id !== result.draggableId);
                        let newParsedWidget = widgets.find((w) => w.id === result.draggableId);
                        if (newParsedWidget) {
                          newParsedWidget.widgetPosition = result.destination.index + 1;
                          newWidgetList.splice(result.destination.index, 0, newParsedWidget);
                        }
                      }

                      newWidgetList = newWidgetList
                        .map((w, idx) => ({ ...w, widgetPosition: idx + 1 }))
                        .sort((a, b) => a.widgetPosition - b.widgetPosition);

                      setWidgets(newWidgetList);
                    }}
                  >
                    <Droppable droppableId="active-widgets">
                      {(provided) => (
                        <Grid
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          container
                          gap={2}
                          sx={{ width: "100%" }}
                        >
                          {sortedWidgets.map((widget, idx) => (
                            <Fade in={true} key={`widget-item-${widget.id}`} unmountOnExit>
                              <Grid
                                item
                                xs={12}
                                md={widget.widgetScale >= 12 ? 12 : widget.widgetScale}
                                sx={{ m: { sx: 0, md: -1 }, p: { sx: 0, md: 1 } }}
                              >
                                <WidgetCardGridItem
                                  index={idx}
                                  widget={widget}
                                  minHeight={widget.isWidgetTall ? TALL_WIDGET_MIN_HEIGHT : NORMAL_WIDGET_MIN_HEIGHT}
                                  deleteWidgetHandler={openDeleteWidgetConfirmation}
                                />
                              </Grid>
                            </Fade>
                          ))}
                          {provided.placeholder}
                        </Grid>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </PagePaperWrapper>
    </>
  );
};

export default DashboardPage;
