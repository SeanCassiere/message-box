import React from "react";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";

import { ISelectedChat } from "./ChatScreen";
import { COMMON_ITEM_BORDER_STYLING } from "../../shared/util/constants";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface Props {
  selectedChatConversation: ISelectedChat | null;
}

const ChatContentPane = (props: Props) => {
  const { selectedChatConversation } = props;

  if (!selectedChatConversation) {
    return (
      <Box component={Paper} sx={{ minHeight: "88vh", border: COMMON_ITEM_BORDER_STYLING, borderRadius: 1 }}>
        <Typography>No chat selected</Typography>
      </Box>
    );
  }

  return (
    <Stack
      component={Paper}
      direction="column"
      justifyContent={{
        xs: "space-between",
        md: "space-between",
      }}
      sx={{
        minHeight: "100%",
        border: COMMON_ITEM_BORDER_STYLING,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          borderBottom: COMMON_ITEM_BORDER_STYLING,
          py: {
            md: 2,
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 1, md: 2 }, py: { xs: 1, md: 0 } }}>
            <Box>
              <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                <Avatar alt="Sean Cassiere" />
              </StyledBadge>
            </Box>
            <Box>
              <Typography fontWeight={500} fontSize={16}>
                {selectedChatConversation.conversationName}
              </Typography>
              <Typography fontWeight={200} fontSize={13}>
                Last seen 12 hours ago
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ px: { xs: 1, md: 1 } }}>
            <IconButton aria-label="More" onClick={() => ({})} onMouseDown={() => ({})}>
              {<MoreVertIcon />}
            </IconButton>
          </Box>
        </Stack>
      </Box>
      {/*  */}
      <Box
        flexGrow={1}
        sx={{
          borderBottom: COMMON_ITEM_BORDER_STYLING,
          py: {
            xs: 1,
            md: 1,
          },
          px: {
            md: 2,
          },
        }}
      >
        <Stack sx={{ minHeight: { md: "68vh" }, maxHeight: { xs: "35vh", md: "69vh" }, py: 1, overflow: "auto" }}>
          {Array.from(Array(30)).map((_, index) => (
            <Box sx={{ mt: 3 }} key={`box-stack-${index}`}>
              <Typography fontSize={12} sx={{ mx: 1 }} textAlign={index % 2 === 0 ? "left" : "right"}>
                11:00 AM 2022-01-15
              </Typography>
              <Typography sx={{ textAlign: index % 2 === 0 ? "left" : "right", mt: 2 }}>
                <span
                  style={{
                    maxWidth: "max-content",
                    backgroundColor: "#f0fdfa",
                    paddingTop: "0.7rem",
                    paddingBottom: "0.7rem",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    border: "1px solid",
                    borderColor: "#14b8a6",
                    borderRadius: 4,
                  }}
                >
                  I&apos;m a {index % 2 === 0 ? "left" : "right"} message
                </span>
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      {/*  */}
      <Box
        sx={{
          py: {
            xs: 1,
            md: 2,
          },
          px: {
            xs: 1,
            md: 2,
          },
          mb: {
            xs: 3,
            md: 0,
          },
        }}
      >
        <Grid container sx={{ width: "100%" }} spacing={1}>
          <Grid item xs={12} md={11}>
            <TextField
              variant="outlined"
              placeholder="Type your message here"
              fullWidth
              size="small"
              InputProps={{ sx: { bgcolor: "#eef2ff" } }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              aria-label="Send"
              fullWidth
              onClick={() => ({})}
              onMouseDown={() => ({})}
              sx={{ height: "100%" }}
              size="medium"
            >
              <SendIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default ChatContentPane;
