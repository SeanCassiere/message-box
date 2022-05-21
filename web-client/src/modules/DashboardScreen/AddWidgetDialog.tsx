import React from "react";

import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListSubheader from "@mui/material/ListSubheader";

import TextField from "../../shared/components/Form/TextField/TextField";
import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

import { IWidgetCreatorOptionFromApi } from "../../shared/interfaces/Dashboard.interfaces";
import { client } from "../../shared/api/client";
import { MESSAGES } from "../../shared/util/messages";
import store, { selectLookupListsState } from "../../shared/redux/store";

const validationSchema = yup.object().shape({
  widgetType: yup.string().required("WidgetType is required"),
  widgetName: yup.string().required("WidgetName is required"),
  widgetScale: yup.number().required("WidgetScale is required"),
  widgetHeight: yup.number().required("WidgetHeight is required"),
  position: yup.object().shape({
    x: yup.number().min(0, "Minimum is 0").required("X is required"),
    y: yup.number().min(0, "Minimum is 0").required("Y is required"),
  }),
  config: yup.array().of(
    yup.object().shape({
      parameter: yup.string().required("Parameter is required"),
      value: yup.string().required("Value is required"),
    })
  ),
  variableOptions: yup.array().of(
    yup.object().shape({
      parameter: yup.string().required("Parameter is required"),
      mode: yup.string().required("Mode is required"),
    })
  ),
});

interface IProps {
  showDialog: boolean;
  handleClose: () => void;
  handleRefreshList: () => void;
  getCoordinates: (width: number) => { x: number; y: number };
}

const AddWidgetDialog = (props: IProps) => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { usersList, teamsList } = useSelector(selectLookupListsState);

  const { enqueueSnackbar } = useSnackbar();
  const [pageMode, setPageMode] = React.useState(0);

  // creator options
  const [loadingCreatorOptions, setLoadingCreatorOptions] = React.useState(true);
  const [creatorOptions, setCreatorOptions] = React.useState<IWidgetCreatorOptionFromApi[]>([]);
  const [selectedCreatorOption, setSelectedCreatorOption] = React.useState<IWidgetCreatorOptionFromApi | null>(null);

  const setToSelectionScreen = () => {
    setPageMode(0);
    setSelectedCreatorOption(null);
  };

  React.useEffect(() => {
    setPageMode(0);
    setSelectedCreatorOption(null);

    if (props.showDialog === false) return;

    const cancelToken = new AbortController();
    setLoadingCreatorOptions(true);

    client
      .get("/Dashboard/Widgets/Available", { signal: cancelToken.signal })
      .then((res) => {
        if (res.status === 200) {
          setCreatorOptions(res.data);
        }
      })
      .catch((err) => {
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      })
      .finally(() => {
        setLoadingCreatorOptions(false);
      });

    return () => {
      cancelToken.abort();
    };
  }, [enqueueSnackbar, props.showDialog]);

  const handleSelectCreatorOption = (creatorDTO: IWidgetCreatorOptionFromApi) => {
    setSelectedCreatorOption(creatorDTO);
    formik.setFieldValue("widgetName", creatorDTO.typeDisplayName);
    formik.setFieldValue("widgetType", creatorDTO.widgetType);
    formik.setFieldValue("widgetScale", `${creatorDTO.scaleOptions[0]}`);
    formik.setFieldValue("widgetHeight", `${creatorDTO.heightOptions[0]}`);
    formik.setFieldValue(
      "config",
      creatorDTO.mandatoryConfigOptions.map((opt) => ({ parameter: opt.parameter, value: null }))
    );
    formik.setFieldValue("variableOptions", creatorDTO.mandatoryVariableOptions);
    setPageMode(1);
  };

  // form
  const formik = useFormik({
    initialValues: {
      widgetType: "",
      widgetName: "",
      widgetScale: "4",
      widgetHeight: "2",
      position: {
        x: 0,
        y: 0,
      },
      config: [],
      variableOptions: [],
    },
    validationSchema,
    onSubmit: async ({ widgetScale, widgetHeight, ...values }, { resetForm }) => {
      const dto = {
        ...values,
        widgetScale: parseInt(widgetScale),
        widgetHeight: parseInt(widgetHeight),
      };

      client
        .post("/Dashboard/Widgets", dto)
        .then((res) => {
          if (res.status === 200) {
            setToSelectionScreen();
            resetForm();
            props.handleRefreshList();
            props.handleClose();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
  return (
    <Dialog
      open={props.showDialog}
      maxWidth={pageMode === 1 ? "sm" : "md"}
      fullWidth
      onClose={() => ({})}
      disableEscapeKeyDown
      fullScreen={isOnMobile}
    >
      <DialogHeaderClose
        title={`Add Widget`}
        onClose={() => {
          setPageMode(0);
          setSelectedCreatorOption(null);
          props.handleClose();
        }}
        startIconMode={"add-icon"}
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ minHeight: 400 }}>
          {pageMode === 0 && (
            <>
              {loadingCreatorOptions === false && (
                <>
                  {creatorOptions.length > 0 ? (
                    <ImageList sx={{ width: "100%" }} rowHeight={200} cols={isOnMobile ? 1 : 3}>
                      {creatorOptions.map((creationDTO, idx) => (
                        <ImageListItem key={`creator-option-${idx}`} cols={1}>
                          <img
                            src={`media/widgets/${creationDTO.widgetType}.png`}
                            alt={creationDTO.typeDisplayName}
                            loading="lazy"
                            style={{ maxHeight: "100%", objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={creationDTO.typeDisplayName}
                            actionIcon={
                              <IconButton
                                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                aria-label={`info about ${creationDTO.typeDisplayName}`}
                                onClick={() => handleSelectCreatorOption(creationDTO)}
                              >
                                <AddCircleOutlineOutlinedIcon />
                              </IconButton>
                            }
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <Box>
                          <Typography>No widgets to be shown</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
            </>
          )}
          {pageMode === 1 && selectedCreatorOption && (
            <Grid container gap={2}>
              <Grid item xs={12} md={12}>
                <Button
                  color="secondary"
                  onClick={setToSelectionScreen}
                  startIcon={<ChevronLeftIcon />}
                  disableElevation={false}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={{ maxWidth: "300px", margin: "0 auto" }}>
                  <img
                    src={`media/widgets/${selectedCreatorOption.widgetType}.png`}
                    alt={selectedCreatorOption.typeDisplayName}
                    loading="lazy"
                    style={{ maxHeight: "100%", objectFit: "cover", width: "100%" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Title"
                  id="widgetName"
                  name="widgetName"
                  autoComplete="off"
                  variant="outlined"
                  value={formik.values.widgetName}
                  onChange={formik.handleChange}
                  error={formik.touched.widgetName && Boolean(formik.errors.widgetName)}
                  helperText={formik.touched.widgetName && formik.errors.widgetName}
                  disabled={formik.isSubmitting}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id={`widget-span-autocomplete`}
                    options={selectedCreatorOption.scaleOptions.map((o) => `${o}`)}
                    value={formik.values.widgetScale}
                    getOptionLabel={(option) => `${option}`}
                    onChange={(evt, value) => {
                      if (!value) return;
                      const { x, y } = props.getCoordinates(parseInt(value));

                      formik.setFieldValue("widgetScale", value);
                      formik.setFieldValue("position.x", x);
                      formik.setFieldValue("position.y", y);
                    }}
                    sx={{ mr: 2, width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Width"
                        name="widgetScale"
                        InputLabelProps={{ disableAnimation: false, shrink: undefined }}
                        fullWidth
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id={`widget-height-autocomplete`}
                    options={selectedCreatorOption.heightOptions.map((o) => `${o}`)}
                    value={formik.values.widgetHeight}
                    getOptionLabel={(option) => `${option}`}
                    onChange={(evt, value) => {
                      if (!value) return;

                      formik.setFieldValue("widgetHeight", value);
                    }}
                    sx={{ mr: 2, width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Height"
                        name="widgetHeight"
                        InputLabelProps={{ disableAnimation: false, shrink: undefined }}
                        fullWidth
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              {selectedCreatorOption.mandatoryConfigOptions.map((optDTO) => (
                <Grid key={`widget-mandatory-option-${optDTO.parameter}`} item xs={12} md={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id={`widget-config-${optDTO.parameter}`}
                      options={getOptionValuesForClientFillInstruction(optDTO.clientFill)}
                      value={
                        (formik.values.config.find((param: any) => param.parameter === optDTO.parameter) as any)?.value
                      }
                      getOptionLabel={(option) => {
                        if (optDTO.clientFill === "system-users") {
                          const user = usersList.find((u) => u.userId === option);
                          if (user) {
                            return `${user.firstName} ${user.lastName}`;
                          } else {
                            return "user not found";
                          }
                        }

                        if (optDTO.clientFill === "calendar-view-names") {
                          if (option.toLowerCase() === "3-days") {
                            return "Next 3 Days";
                          } else if (option.toLowerCase() === "day") {
                            return "Today";
                          } else if (option.toLowerCase() === "week") {
                            return "This Week";
                          } else {
                            return `${option}`;
                          }
                        }

                        if (optDTO.clientFill === "user-participating-team-names") {
                          const team = teamsList.find((t) => t.teamId === option);
                          if (team) {
                            return `${team.teamName}`;
                          } else {
                            return "team not found";
                          }
                        }

                        return `${option}`;
                      }}
                      onChange={(evt, selectedValue) => {
                        if (!selectedValue) {
                          return;
                        }
                        //
                        if (optDTO.clientFill === "user-participating-team-names") {
                          const team = teamsList.find((t) => t.teamId === selectedValue);
                          if (team) {
                            formik.setFieldValue("widgetName", `${team.teamName} team's current activity`);
                          }
                        }
                        //
                        let allMandatoryParams = [...formik.values.config] as any[];

                        const paramIdx = allMandatoryParams.findIndex((p) => p.parameter === optDTO.parameter);

                        if (paramIdx > -1) {
                          allMandatoryParams[paramIdx].value = selectedValue;
                        }
                        formik.setFieldValue("config", allMandatoryParams);
                      }}
                      sx={{ mr: 2, width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={optDTO.displayName}
                          name={optDTO.parameter}
                          InputLabelProps={{ disableAnimation: false, shrink: undefined }}
                          fullWidth
                          required
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        {pageMode === 1 && <DialogBigButtonFooter submitButtonText="ADD WIDGET" />}
      </Box>
    </Dialog>
  );
};

function getOptionValuesForClientFillInstruction(instruction: string) {
  const reduxState = store.getState();

  switch (instruction.toLowerCase()) {
    case "task-for-time-periods":
      return ["Today", "Tomorrow", "Overdue"];
    case "system-users":
      const users = reduxState.lookup.usersList.map((u) => u.userId);
      return [...users];
    case "task-completion-time-periods":
      return ["Week", "Month"];
    case "calendar-view-names":
      return ["Day", "3-days", "Week"];
    case "user-participating-team-names":
      const teams = reduxState?.user?.userProfile?.teams;
      return teams ?? [];
    default:
      return [];
  }
}

export default AddWidgetDialog;
