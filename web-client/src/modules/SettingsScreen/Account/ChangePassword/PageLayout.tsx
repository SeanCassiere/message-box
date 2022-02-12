import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { COMMON_ITEM_BORDER_COLOR } from "../../../../shared/util/constants";

const PageLayout = () => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
        <Box>
          <Typography variant="h5">Change Password</Typography>
        </Box>
        <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
          <Button startIcon={<MarkEmailReadIcon />} size="medium">
            Via E-Mail
          </Button>
        </Box>
      </Box>
      <Stack direction="column">
        <BlockItem title="Using your old password"></BlockItem>
        <BlockItem title="Using your 2FA code"></BlockItem>
      </Stack>
    </Box>
  );
};

const BlockItem: React.FC<{ title: string }> = ({ children, title }) => {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        mt: 2,
        py: 2,
        px: 2,
        borderRadius: 2,
        borderColor: COMMON_ITEM_BORDER_COLOR,
        borderWidth: 3,
        borderStyle: "solid",
      }}
    >
      <Typography fontSize={16} fontWeight={400} sx={{ textTransform: "uppercase" }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default PageLayout;
