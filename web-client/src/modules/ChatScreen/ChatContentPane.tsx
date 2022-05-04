import React from "react";
import { grey } from "@mui/material/colors";
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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";

import { ISelectedChat } from "./ChatScreen";
import { COMMON_ITEM_BORDER_STYLING } from "../../shared/util/constants";
import { useSocket } from "../../shared/hooks/useSocket";
import { formatDateTimeShort } from "../../shared/util/dateTime";
import { IUserProfile } from "../../shared/interfaces/User.interfaces";

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

interface IChatMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  type: string;
  message: string;
  timestamp: string;
}

interface Props {
  selectedChatConversation: ISelectedChat;
  currentUser: IUserProfile;
}

const ChatContentPane = (props: Props) => {
  const { selectedChatConversation } = props;
  const { socket_joinChatRoom, socket_leaveChatRoom, socket_sendNewMessage } = useSocket();

  const [typingMessageText, setTypingMessageText] = React.useState("");

  const [roomMessages, setRoomMessages] = React.useState<IChatMessage[]>(DEMO_MESSAGES);
  const scrollBottomRef = React.useRef<HTMLAnchorElement>(null);

  function pushNewChatToStack(newMessage: IChatMessage) {
    setRoomMessages((prevMessages) => [...prevMessages, newMessage]);
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  React.useEffect(() => {
    socket_joinChatRoom(selectedChatConversation.roomId, pushNewChatToStack);
    return () => {
      socket_leaveChatRoom(selectedChatConversation.roomId);
    };
  }, [selectedChatConversation.roomId, socket_joinChatRoom, socket_leaveChatRoom]);

  React.useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSendMessage = () => {
    const text = typingMessageText;
    if (!text || text.trim().length === 0) {
      return;
    }

    socket_sendNewMessage(selectedChatConversation.roomId, {
      type: "text/text",
      content: text,
      senderId: props.currentUser.userId,
      senderName: `${props.currentUser.firstName} ${props.currentUser.lastName}`,
    });
    setTypingMessageText("");
  };

  const listChatMessages = roomMessages.map((messageObj) => (
    <ListItem alignItems="center" key={messageObj.messageId} sx={{ justifyContent: "flex-end", width: "100%" }}>
      {messageObj.senderId !== props.currentUser.userId && (
        <ListItemAvatar>
          <Avatar alt={messageObj.senderName} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={
          <Box sx={{ display: "inline-flex", flexDirection: "row", alignItems: "center" }}>
            {messageObj.senderId === props.currentUser.userId ? (
              <>
                <Typography fontSize={13} color={grey[600]}>
                  {formatDateTimeShort(messageObj.timestamp)}
                </Typography>
                &nbsp;-&nbsp;
                <Typography>{messageObj.senderName}</Typography>
              </>
            ) : (
              <>
                <Typography>{messageObj.senderName}</Typography>&nbsp;-&nbsp;
                <Typography fontSize={13} color={grey[600]}>
                  {formatDateTimeShort(messageObj.timestamp)}
                </Typography>
              </>
            )}
          </Box>
        }
        secondary={messageObj.message}
        primaryTypographyProps={{
          sx: {
            textAlign: messageObj.senderId !== props.currentUser.userId ? "left" : "right",
          },
        }}
        secondaryTypographyProps={{
          sx: {
            textAlign: messageObj.senderId !== props.currentUser.userId ? "left" : "right",
          },
        }}
      />
    </ListItem>
  ));

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
                {selectedChatConversation.roomName}
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
        <Stack sx={{ minHeight: { md: "68vh" }, maxHeight: { xs: "35vh", md: "69vh" }, py: 2, overflow: "auto" }}>
          <List id="chat-window-messages" sx={{ width: "100%" }}>
            {listChatMessages}
            <ListItem ref={scrollBottomRef as any}></ListItem>
          </List>
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
              value={typingMessageText}
              onChange={(e) => setTypingMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              aria-label="Send"
              fullWidth
              onClick={handleSendMessage}
              onMouseDown={handleSendMessage}
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

const DEMO_MESSAGES: IChatMessage[] = [
  {
    messageId: "1",
    senderId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    senderName: "Sean Cassiere",
    message: "I'm a right message",
    type: "text/text",
    timestamp: "2022-05-04T07:32:16.633Z",
  },
  {
    messageId: "2",
    senderId: "2",
    senderName: "Guest",
    message: "Im a left message",
    type: "text/text",
    timestamp: "2022-05-04T07:33:20.633Z",
  },
  {
    messageId: "4",
    senderId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    senderName: "Sean Cassiere",
    message: "Im a right message",
    type: "text/text",
    timestamp: "2022-05-04T07:35:34.633Z",
  },
  {
    messageId: "5",
    senderId: "1",
    senderName: "Guest",
    message: "Im a right message",
    type: "text/text",
    timestamp: "2022-05-04T07:35:34.633Z",
  },
  {
    messageId: "6",
    senderId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    senderName: "Sean Cassiere",
    message: "Im a right message",
    type: "text/text",
    timestamp: "2022-05-04T07:35:34.633Z",
  },
  {
    messageId: "7",
    senderId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    senderName: "Sean Cassiere",
    message: "Im a right message",
    type: "text/text",
    timestamp: "2022-05-04T07:35:34.633Z",
  },
  {
    messageId: "8",
    senderId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    senderName: "Sean Cassiere",
    message: "Im a right message",
    type: "text/text",
    timestamp: "2022-05-04T07:35:34.633Z",
  },
  {
    messageId: "9",
    senderId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    senderName: "Sean Cassiere",
    message: "Im a right message",
    type: "text/text",
    timestamp: "2022-05-04T07:35:34.633Z",
  },
  {
    messageId: "10",
    senderId: "2",
    senderName: "Guest",
    message: "Im a left message",
    type: "text/text",
    timestamp: "2022-05-04T07:33:20.633Z",
  },
  {
    messageId: "11",
    senderId: "2",
    senderName: "Guest",
    message: "Im a left message",
    type: "text/text",
    timestamp: "2022-05-04T07:33:20.633Z",
  },
];

export default ChatContentPane;
