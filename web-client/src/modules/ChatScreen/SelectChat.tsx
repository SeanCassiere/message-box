import React from "react";

// import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
// import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";

import { COMMON_ITEM_BORDER_COLOR, COMMON_ITEM_BORDER_STYLING, PRIMARY_BTN_COLOR } from "../../shared/util/constants";
import { IChatRoom } from "../../shared/interfaces/Chat.interfaces";

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   "& .MuiBadge-badge": {
//     backgroundColor: "#44b700",
//     color: "#44b700",
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     "&::after": {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       borderRadius: "50%",
//       animation: "ripple 1.2s infinite ease-in-out",
//       border: "1px solid currentColor",
//       content: '""',
//     },
//   },
//   "@keyframes ripple": {
//     "0%": {
//       transform: "scale(.8)",
//       opacity: 1,
//     },
//     "100%": {
//       transform: "scale(2.4)",
//       opacity: 0,
//     },
//   },
// }));

interface Props {
  setSelectedChatConversation: (chat: IChatRoom | null) => void;
  availableChatConversations: IChatRoom[];
  openDialogTrigger: () => void;
}

const SelectChat = (props: Props) => {
  const { setSelectedChatConversation } = props;

  const [selectedId, setSelectedId] = React.useState("");

  const handleSelectChat = React.useCallback(
    (chat: IChatRoom) => {
      setSelectedId(chat.roomId);
      setSelectedChatConversation(chat);
    },
    [setSelectedChatConversation]
  );

  return (
    <Stack
      sx={{
        border: COMMON_ITEM_BORDER_STYLING,
        px: 1,
        py: 1,
        overflowY: "auto",
        height: {
          sm: "75vh",
        },
        minHeight: {
          md: "100%",
        },
      }}
      component={Paper}
    >
      <Box sx={{ mb: 2 }}>
        <Button
          fullWidth
          onClick={() => {
            props.openDialogTrigger();
          }}
        >
          New Chat
        </Button>
      </Box>
      <Typography fontSize={18} fontWeight={500} color="primary.500" sx={{ pl: 1 }}>
        Groups
      </Typography>

      {props.availableChatConversations
        .filter((c) => c.roomType === "group")
        .map((chat) => (
          <Box
            key={`chat-option-${chat.roomId}`}
            sx={{
              borderWidth: 3,
              borderRadius: 2,
              borderStyle: "solid",
              borderColor: selectedId === chat.roomId ? PRIMARY_BTN_COLOR : COMMON_ITEM_BORDER_COLOR,
              my: "4px",
              py: 1,
              px: 2,
              bgcolor: selectedId === chat.roomId ? "#f0fdfa" : "#fff",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ minHeight: "3rem" }}>
              <Box>
                <Avatar alt={chat.roomName}>{chat.roomType === "group" ? <PeopleIcon /> : <PersonIcon />}</Avatar>
              </Box>
              <Box flexGrow={1}>{chat.roomName}</Box>
              <Box>
                <IconButton
                  aria-label="View"
                  onClick={() => handleSelectChat(chat)}
                  onMouseDown={() => handleSelectChat(chat)}
                >
                  {<KeyboardArrowRightIcon />}
                </IconButton>
                {selectedId === chat.roomId && (
                  <IconButton
                    aria-label="Close"
                    onClick={() => {
                      setSelectedChatConversation(null);
                      setSelectedId("");
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Box>
        ))}
      <Typography fontSize={18} fontWeight={500} color="primary.500" sx={{ pl: 1, mt: 2 }}>
        Conversations
      </Typography>
      {props.availableChatConversations
        .filter((c) => c.roomType !== "group")
        .map((chat) => (
          <Box
            key={`chat-option-${chat.roomId}`}
            sx={{
              borderWidth: 3,
              borderRadius: 2,
              borderStyle: "solid",
              borderColor: selectedId === chat.roomId ? PRIMARY_BTN_COLOR : COMMON_ITEM_BORDER_COLOR,
              my: "4px",
              py: 1,
              px: 2,
              bgcolor: selectedId === chat.roomId ? "#f0fdfa" : "#fff",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ minHeight: "3rem" }}>
              <Box>
                <Avatar alt={chat.roomName}>{chat.roomType === "group" ? <PeopleIcon /> : <PersonIcon />}</Avatar>
              </Box>
              <Box flexGrow={1}>{chat.roomName}</Box>
              <Box>
                <IconButton
                  aria-label="View"
                  onClick={() => handleSelectChat(chat)}
                  onMouseDown={() => handleSelectChat(chat)}
                >
                  {<KeyboardArrowRightIcon />}
                </IconButton>
                {selectedId === chat.roomId && (
                  <IconButton
                    aria-label="Close"
                    onClick={() => {
                      setSelectedChatConversation(null);
                      setSelectedId("");
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Box>
        ))}
    </Stack>
  );
};

export default SelectChat;
