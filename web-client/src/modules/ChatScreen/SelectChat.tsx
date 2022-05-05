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
  selectedChatConversation: IChatRoom | null;
  setSelectedChatConversation: (chat: IChatRoom | null) => void;
  availableChatConversations: IChatRoom[];
  openDialogTrigger: () => void;
}

const SelectChat = (props: Props) => {
  const { setSelectedChatConversation } = props;

  const handleSelectChat = React.useCallback(
    (chat: IChatRoom) => {
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
          <ChatOption
            key={`select-group-chat-${chat.roomId}`}
            chatOption={chat}
            selectedChatConversation={props.selectedChatConversation}
            setSelectedChatConversation={setSelectedChatConversation}
            handleSelectChat={handleSelectChat}
          />
        ))}
      <Typography fontSize={18} fontWeight={500} color="primary.500" sx={{ pl: 1, mt: 2 }}>
        Conversations
      </Typography>
      {props.availableChatConversations
        .filter((c) => c.roomType !== "group")
        .map((chat) => (
          <ChatOption
            key={`select-conversation-chat-${chat.roomId}`}
            chatOption={chat}
            selectedChatConversation={props.selectedChatConversation}
            setSelectedChatConversation={setSelectedChatConversation}
            handleSelectChat={handleSelectChat}
          />
        ))}
    </Stack>
  );
};

const ChatOption = React.memo(
  (props: {
    chatOption: IChatRoom;
    setSelectedChatConversation: (chat: IChatRoom | null) => void;
    selectedChatConversation: IChatRoom | null;
    handleSelectChat: (chat: IChatRoom) => void;
  }) => {
    const selectChatOption = React.useCallback(() => {
      props.handleSelectChat(props.chatOption);
    }, [props]);
    return (
      <>
        <Box
          key={`chat-option-${props.chatOption.roomId}`}
          sx={{
            borderWidth: 3,
            borderRadius: 2,
            borderStyle: "solid",
            borderColor:
              props.selectedChatConversation?.roomId === props.chatOption.roomId
                ? PRIMARY_BTN_COLOR
                : COMMON_ITEM_BORDER_COLOR,
            my: "4px",
            py: 1,
            px: 2,
            bgcolor: props.selectedChatConversation?.roomId === props.chatOption.roomId ? "#f0fdfa" : "#fff",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ minHeight: "3rem" }}>
            <Box onClick={selectChatOption} sx={{ cursor: "pointer" }}>
              <Avatar alt={props.chatOption.roomName}>
                {props.chatOption.roomType === "group" ? <PeopleIcon /> : <PersonIcon />}
              </Avatar>
            </Box>
            <Box flexGrow={1} onClick={selectChatOption} sx={{ cursor: "pointer" }}>
              {props.chatOption.roomName}
            </Box>
            <Box>
              {props.selectedChatConversation?.roomId !== props.chatOption.roomId && (
                <IconButton aria-label="View" onClick={selectChatOption} onMouseDown={selectChatOption}>
                  {<KeyboardArrowRightIcon />}
                </IconButton>
              )}
              {props.selectedChatConversation?.roomId === props.chatOption.roomId && (
                <IconButton
                  aria-label="Close"
                  onClick={() => {
                    props.setSelectedChatConversation(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Stack>
        </Box>
      </>
    );
  }
);

export default SelectChat;
