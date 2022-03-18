import React, { useCallback, useState } from "react";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { ISelectedChat } from "./ChatScreen";
import { COMMON_ITEM_BORDER_COLOR, COMMON_ITEM_BORDER_STYLING, PRIMARY_BTN_COLOR } from "../../shared/util/constants";

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
  setSelectedChatConversation: (chat: ISelectedChat) => void;
  availableChatConversations: ISelectedChat[];
}

const SelectChat = (props: Props) => {
  const { setSelectedChatConversation } = props;

  const [selectedId, setSelectedId] = useState("");

  const handleSelectChat = useCallback(
    (chat: ISelectedChat) => {
      setSelectedId(chat.conversationId);
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
          md: "auto",
        },
      }}
      component={Paper}
    >
      {CHAT_PEOPLE.map((chat) => (
        <Box
          key={chat.conversationId}
          onClick={() => handleSelectChat(chat)}
          sx={{
            cursor: "pointer",
            borderWidth: 3,
            borderRadius: 2,
            borderStyle: "solid",
            borderColor: selectedId === chat.conversationId ? PRIMARY_BTN_COLOR : COMMON_ITEM_BORDER_COLOR,
            my: "4px",
            py: 1,
            px: 2,
            bgcolor: selectedId === chat.conversationId ? "#f0fdfa" : "#fff",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ minHeight: "3rem" }}>
            <Box>
              <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                <Avatar alt={chat.conversationName} src="/static/images/avatar/1.jpg" />
              </StyledBadge>
            </Box>
            <Box flexGrow={1}>{chat.conversationName}</Box>
            <Box>
              <IconButton
                aria-label="View"
                onClick={() => handleSelectChat(chat)}
                onMouseDown={() => handleSelectChat(chat)}
              >
                {<KeyboardArrowRightIcon />}
              </IconButton>
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

function createChatPeople(count: number): ISelectedChat[] {
  const people = [];
  for (let i = 1; i <= count; i++) {
    people.push({
      conversationId: `conversation-${i}`,
      conversationName: `Chat ${i}`,
    });
  }
  return people;
}

const CHAT_PEOPLE: ISelectedChat[] = createChatPeople(25);

export default SelectChat;
