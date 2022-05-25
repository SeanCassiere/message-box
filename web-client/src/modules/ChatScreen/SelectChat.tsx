import React from "react";
import { useSelector } from "react-redux";

import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
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
import MessageIcon from "@mui/icons-material/Message";
import ClearIcon from "@mui/icons-material/Clear";

import FormTextField from "../../shared/components/Form/FormTextField";

import { COMMON_ITEM_BORDER_COLOR, COMMON_ITEM_BORDER_STYLING, PRIMARY_BTN_COLOR } from "../../shared/util/constants";
import { IChatRoom } from "../../shared/interfaces/Chat.interfaces";
import { selectLookupListsState } from "../../shared/redux/store";
import { DEFAULT_USER_STATUSES } from "../../shared/util/general";

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
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

interface Props {
  selectedChatConversation: IChatRoom | null;
  setSelectedChatConversation: (chat: IChatRoom | null) => void;
  availableChatConversations: IChatRoom[];
  openDialogTrigger: () => void;
}

const SelectChat = (props: Props) => {
  const theme = useTheme();

  const { setSelectedChatConversation } = props;

  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelectChat = React.useCallback(
    (chat: IChatRoom) => {
      setSelectedChatConversation(chat);
    },
    [setSelectedChatConversation]
  );

  const queriedChatConversations = React.useMemo(() => {
    let chats = props.availableChatConversations;
    if (props.availableChatConversations.length > 0 && searchQuery?.trim()?.length > 0) {
      chats = props.availableChatConversations.filter((dto) =>
        String(dto.roomName?.toLowerCase()).includes(searchQuery?.trim().toLowerCase())
      );
    }

    return chats;
  }, [props.availableChatConversations, searchQuery]);

  return (
    <Stack
      sx={{
        border: theme.palette.mode === "light" ? COMMON_ITEM_BORDER_STYLING : undefined,
        px: 1.5,
        py: 2,
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
      <Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 1 }}>
          <FormTextField
            size="small"
            value={searchQuery}
            onChange={(evt) => setSearchQuery(evt.target.value)}
            placeholder="Search for a chat..."
            InputProps={{
              endAdornment:
                searchQuery?.length > 0 ? (
                  <IconButton sx={{ mr: -1.5, borderRadius: 0 }} aria-label="Clear" onClick={() => setSearchQuery("")}>
                    <ClearIcon />
                  </IconButton>
                ) : null,
            }}
          />

          <Button onClick={() => props.openDialogTrigger()}>
            <MessageIcon />
          </Button>
        </Stack>
      </Box>
      {queriedChatConversations.filter((c) => c.roomType === "group").length > 0 && (
        <Typography fontSize={18} fontWeight={500} color="primary.500" sx={{ pl: 1, mt: 3 }}>
          Groups
        </Typography>
      )}

      {queriedChatConversations
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

      {queriedChatConversations.filter((c) => c.roomType !== "group").length > 0 && (
        <Typography fontSize={18} fontWeight={500} color="primary.500" sx={{ pl: 1, mt: 1.5 }}>
          Conversations
        </Typography>
      )}

      {queriedChatConversations
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
    const theme = useTheme();

    const { onlineUsersList } = useSelector(selectLookupListsState);
    const selectChatOption = React.useCallback(() => {
      props.handleSelectChat(props.chatOption);
    }, [props]);

    const avatarUserId = React.useMemo(() => {
      let userId = props.chatOption?.participantUserId;
      return userId;
    }, [props.chatOption?.participantUserId]);

    const currentAvatarIndicatorColor = React.useMemo(() => {
      let currentColor = DEFAULT_USER_STATUSES[2].color;
      if (avatarUserId) {
        const onlineUser = onlineUsersList.find((u) => u.userId === avatarUserId);
        if (onlineUser) {
          currentColor = onlineUser?.color ?? DEFAULT_USER_STATUSES[0].color;
        }
      }
      return currentColor;
    }, [avatarUserId, onlineUsersList]);
    return (
      <Box
        key={`chat-option-${props.chatOption.roomId}`}
        sx={{
          borderWidth: 3,
          borderRadius: 2,
          borderStyle: "solid",
          borderColor:
            theme.palette.mode === "light"
              ? () => {
                  return props.selectedChatConversation?.roomId === props.chatOption.roomId
                    ? PRIMARY_BTN_COLOR
                    : COMMON_ITEM_BORDER_COLOR;
                }
              : () => {
                  return props.selectedChatConversation?.roomId === props.chatOption.roomId ? "#494949" : "#292929";
                },
          my: "4px",
          py: 1,
          px: 2,
          bgcolor:
            theme.palette.mode === "light"
              ? () => {
                  return props.selectedChatConversation?.roomId === props.chatOption.roomId ? "#f0fdfa" : "#fff";
                }
              : () => {
                  return props.selectedChatConversation?.roomId === props.chatOption.roomId ? "something" : "something";
                },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minHeight: "3rem" }}>
          <Box onClick={selectChatOption} sx={{ cursor: "pointer" }}>
            {avatarUserId ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: currentAvatarIndicatorColor,
                    color: currentAvatarIndicatorColor,
                  },
                }}
              >
                <Avatar alt={props.chatOption.roomName}>
                  <PersonIcon />
                </Avatar>
              </StyledBadge>
            ) : (
              <Avatar alt={props.chatOption.roomName}>
                <PeopleIcon />
              </Avatar>
            )}
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
    );
  }
);

export default SelectChat;
