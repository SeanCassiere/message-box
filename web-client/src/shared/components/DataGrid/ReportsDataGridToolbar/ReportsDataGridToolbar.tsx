import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const ReportsDataGridToolbar = () => {
  return (
    <GridToolbarContainer
      style={{ display: "flex", gap: 3, paddingTop: "0.5rem", paddingBottom: "0.5rem", paddingLeft: "0.5rem" }}
    >
      <GridToolbarColumnsButton variant="text" />
      <GridToolbarFilterButton {...({ variant: "text" } as any)} />
      <GridToolbarExport variant="text" printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
};

export default ReportsDataGridToolbar;
