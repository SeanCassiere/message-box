import React from "react";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";

import { COMMON_ITEM_BORDER_STYLING } from "../../shared/util/constants";
import { useSocket } from "../../shared/hooks/useSocket";
import { formatDateTimeShort } from "../../shared/util/dateTime";
import { IUserProfile } from "../../shared/interfaces/User.interfaces";
import { client } from "../../shared/api/client";
import { selectLookupListsState } from "../../shared/redux/store";
import { IChatMessage, IChatRoom } from "../../shared/interfaces/Chat.interfaces";
import { DEFAULT_USER_STATUSES } from "../../shared/util/general";
import { usePermission } from "../../shared/hooks/usePermission";

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
  selectedChatConversation: IChatRoom;
  setSelectedChatConversation: (chat: IChatRoom | null) => void;
  currentUser: IUserProfile;
  openEditDialogTrigger: (id: string) => void;
}

const TAKE_SIZE_MESSAGES = 35;

const ChatContentPane = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedChatConversation } = props;

  const PERM_CHAT_ADMIN = usePermission("chat:delete");
  const PERM_CHAT_DELETE = usePermission("chat:delete");

  const { usersList, onlineUsersList } = useSelector(selectLookupListsState);

  const { socket_joinChatRoom, socket_leaveChatRoom, socket_sendNewMessage } = useSocket();

  const [hasMoreMessages, setHasMoreMessages] = React.useState(true);

  const [typingMessageText, setTypingMessageText] = React.useState("");
  const [loadingMessages, setLoadingMessages] = React.useState(true);

  const [roomMessages, setRoomMessages] = React.useState<IChatMessage[]>([]);
  const scrollBottomRef = React.useRef<HTMLAnchorElement>(null);

  function fetchChatMessages(roomId: string, cursor?: string) {
    const urlParams = new URLSearchParams();
    urlParams.append("size", `${TAKE_SIZE_MESSAGES}`);
    if (cursor) {
      urlParams.append("cursor", cursor);
    }
    client
      .get(`/Chats/${roomId}/Messages`, { params: urlParams })
      .then((res) => {
        if (res.status === 200) {
          const formattedNewMessages = [...res.data].map((r) => ({ ...r, message: r?.content }));
          if (formattedNewMessages.length < TAKE_SIZE_MESSAGES) {
            setHasMoreMessages(false);
          } else {
            setHasMoreMessages(true);
          }
          setRoomMessages((prev) => [...formattedNewMessages, ...prev]);
        }
      })
      .catch(() => {
        // enqueueSnackbar("Failed to fetch more messages", { variant: "error" });
      })
      .finally(() => {
        setLoadingMessages(false);
        if (!cursor) {
          scrollBottomRef.current?.scrollIntoView();
        }
      });
  }

  const observer = React.useRef<IntersectionObserver>();
  const lastMessageCallback = React.useCallback(
    (node: HTMLLIElement) => {
      if (loadingMessages || hasMoreMessages === false) return;
      if (observer?.current) observer?.current?.disconnect();

      let options: IntersectionObserverInit = {
        rootMargin: "250px",
      };

      observer.current = new IntersectionObserver((entries) => {
        if (entries.length > 0 && entries[0] && entries[0].isIntersecting && hasMoreMessages) {
          fetchChatMessages(selectedChatConversation.roomId, roomMessages[0]?.timestamp);
        }
      }, options);

      if (node) observer.current.observe(node);
    },
    [hasMoreMessages, loadingMessages, roomMessages, selectedChatConversation.roomId]
  );

  function pushNewChatToStack(newMessage: IChatMessage) {
    setRoomMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  React.useEffect(() => {
    socket_joinChatRoom(selectedChatConversation.roomId, pushNewChatToStack);
    fetchChatMessages(selectedChatConversation.roomId);

    return () => {
      socket_leaveChatRoom(selectedChatConversation.roomId);
    };
  }, [selectedChatConversation.roomId, socket_joinChatRoom, socket_leaveChatRoom]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

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

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuOpenClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = async () => {
    setMenuAnchorEl(null);
  };
  const handleMenuDelete = async () => {
    client
      .delete(`/Chats/${selectedChatConversation.roomId}`)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar("Deleted Chat", { variant: "success" });
        } else {
          enqueueSnackbar("An error occurred", { variant: "error" });
        }
      })
      .catch((err) => {
        console.log("Error occurred trying to delete a chat room", err);
        enqueueSnackbar("An error occurred", { variant: "error" });
      })
      .finally(() => {
        setMenuAnchorEl(null);
        props.setSelectedChatConversation(null);
      });
  };

  const listChatMessages =
    roomMessages.length === 0 ? (
      <ListItem alignItems="center" sx={{ width: "100%" }}>
        <ListItemText
          primary="No messages yet"
          primaryTypographyProps={{
            sx: {
              textAlign: "center",
            },
          }}
        />
      </ListItem>
    ) : (
      roomMessages.map((messageObj, index) => {
        return (
          <ListItem
            alignItems="center"
            key={`message-${messageObj.messageId}`}
            sx={{
              justifyContent: "flex-end",
              width: "100%",
              py: {
                xs: 1,
                sm: 0,
              },
            }}
            ref={index === 0 ? lastMessageCallback : undefined}
          >
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
              secondary={messageObj.type === "text/text" ? messageObj.message : null}
              primaryTypographyProps={{
                sx: {
                  textAlign: messageObj.senderId !== props.currentUser.userId ? "left" : "right",
                  pr: messageObj.senderId !== props.currentUser.userId ? 0 : 1,
                },
              }}
              secondaryTypographyProps={{
                sx: {
                  textAlign: messageObj.senderId !== props.currentUser.userId ? "left" : "right",
                  pr: messageObj.senderId !== props.currentUser.userId ? 0 : 1,
                },
              }}
            />
          </ListItem>
        );
      })
    );

  const renderUsersInChat = () => {
    const participants = selectedChatConversation.participants;
    const users = usersList
      .filter((u) => participants.includes(u.userId))
      .filter((u) => u.userId !== props.currentUser.userId);
    const namesOnly = users.map((u) => `${u.firstName} ${u.lastName}`);
    return namesOnly.join(", ");
  };

  const currentAvatarIndicatorColor = React.useMemo(() => {
    let currentColor = DEFAULT_USER_STATUSES[2].color;
    const avatarUserId = selectedChatConversation.participants.filter((uId) => uId !== props.currentUser.userId)[0];

    if (avatarUserId) {
      const onlineUser = onlineUsersList.find((u) => u.userId === avatarUserId);
      if (onlineUser) {
        currentColor = onlineUser?.color ?? DEFAULT_USER_STATUSES[0].color;
      }
    }
    return currentColor;
  }, [onlineUsersList, props.currentUser.userId, selectedChatConversation.participants]);

  return (
    <Stack
      component={Paper}
      direction="column"
      justifyContent={{
        xs: "space-between",
        md: "space-between",
      }}
      sx={{
        minHeight: "calc(100% - 2%)",
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
              {selectedChatConversation.roomType === "group" ? (
                <Avatar alt={selectedChatConversation.roomName}>
                  <PeopleIcon />
                </Avatar>
              ) : (
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
                  <Avatar alt={selectedChatConversation.roomName}>
                    <PersonIcon />
                  </Avatar>
                </StyledBadge>
              )}
            </Box>
            <Box>
              <Typography fontWeight={500} fontSize={16}>
                {selectedChatConversation.roomName.length > 0 ? selectedChatConversation.roomName : "No Name"}
              </Typography>
              <Typography fontWeight={200} fontSize={13}>
                {selectedChatConversation.participants.length > 0 ? <>{renderUsersInChat()}</> : "No participants"}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ px: { xs: 1, md: 1 } }}>
            {(PERM_CHAT_ADMIN || PERM_CHAT_DELETE) && (
              <IconButton aria-label="More" onClick={handleMenuOpenClick} onMouseDown={handleMenuOpenClick}>
                {<MoreVertIcon />}
              </IconButton>
            )}
            <Menu
              id="basic-menu"
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {props.selectedChatConversation.roomType !== "private" && PERM_CHAT_ADMIN && (
                <MenuItem
                  onClick={() => {
                    props.openEditDialogTrigger(props.selectedChatConversation.roomId);
                    setMenuAnchorEl(null);
                  }}
                >
                  Edit
                </MenuItem>
              )}
              {PERM_CHAT_DELETE && <MenuItem onClick={handleMenuDelete}>Quick Delete</MenuItem>}
            </Menu>
          </Box>
        </Stack>
      </Box>
      {/*  */}
      <Box
        flexGrow={1}
        sx={{
          borderBottom: COMMON_ITEM_BORDER_STYLING,
        }}
      >
        <Stack sx={{ minHeight: { md: "68vh" }, maxHeight: { xs: "35vh", md: "69vh" }, py: 1, overflow: "auto" }}>
          <List id="chat-window-messages" sx={{ width: "100%" }}>
            {loadingMessages ? (
              <ListItem alignItems="center" sx={{ width: "100%" }}>
                <ListItemText
                  primary="Loading messages..."
                  primaryTypographyProps={{
                    sx: {
                      textAlign: "center",
                    },
                  }}
                />
              </ListItem>
            ) : (
              <>{listChatMessages}</>
            )}
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
              autoComplete="off"
              autoCapitalize="true"
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

export default ChatContentPane;
