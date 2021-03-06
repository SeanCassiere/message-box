import React, { useCallback } from "react";
import { flushSync } from "react-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import ChatContentPane from "./ChatContentPane";
import SelectChat from "./SelectChat";
import AddChatRoomDialog from "./AddChatRoomDialog";

import { selectUserState } from "../../shared/redux/store";
import { client } from "../../shared/api/client";
import { IChatRoom } from "../../shared/interfaces/Chat.interfaces";
import { useSocket } from "../../shared/hooks/useSocket";

const ChatScreen = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { userProfile } = useSelector(selectUserState);
  const {
    socket_listenForChatRoomCacheUpdate,
    socket_unsubscribeFromChatRoomCacheUpdate,
    socket_unsubscribeFromLiveChatMessages,
  } = useSocket();

  const [selectedChatConversation, setSelectedChatConversation] = React.useState<IChatRoom | null>(null);
  const [chatRooms, setChatRooms] = React.useState<IChatRoom[]>([]);

  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showEditId, setShowEditId] = React.useState("NOT");

  const fetchChatRooms = React.useCallback(async () => {
    client
      .get(`/Chats`)
      .then((res) => {
        if (res.status === 200) {
          setChatRooms(res.data);
        } else {
          enqueueSnackbar(`Could not get chat rooms`, { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar(`Could not get chat rooms`, { variant: "error" });
      })
      .finally(() => {});
  }, [enqueueSnackbar]);

  const handleSetSelectedChat = useCallback(
    (chat: IChatRoom | null) => {
      flushSync(() => {
        setSelectedChatConversation(null);
      });
      if (chat) {
        setSelectedChatConversation(chat);
        client
          .get(`/Chats/${chat.roomId}`)
          .then((res) => {
            if (res.status === 200) {
              setSelectedChatConversation((prev) => ({ ...prev, ...res.data }));
            }
          })
          .catch(() => {});
      }
      fetchChatRooms();
    },
    [fetchChatRooms]
  );

  React.useEffect(() => {
    fetchChatRooms();
    socket_listenForChatRoomCacheUpdate(fetchChatRooms);
    return () => {
      socket_unsubscribeFromChatRoomCacheUpdate();
      socket_unsubscribeFromLiveChatMessages();
    };
  }, [
    fetchChatRooms,
    socket_listenForChatRoomCacheUpdate,
    socket_unsubscribeFromChatRoomCacheUpdate,
    socket_unsubscribeFromLiveChatMessages,
  ]);

  return (
    <>
      <AddChatRoomDialog
        roomId={showEditId}
        currentUserId={userProfile?.userId || "NOT"}
        showDialog={showEditDialog}
        handleRefreshList={fetchChatRooms}
        handleClose={(formSubmitted?: boolean) => {
          setShowEditDialog(false);
          setShowEditId("NOT");
          if (formSubmitted) {
            setSelectedChatConversation(null);
          }
        }}
      />
      <PagePaperWrapper>
        <Grid
          spacing={2}
          container
          sx={{
            flexGrow: 1,
            maxHeight: {
              xs: "100%",
              sm: "100%",
              md: "88vh",
            },
          }}
        >
          <Grid item xs={12} md={4}>
            <Stack
              sx={{
                minHeight: {
                  sm: "600px",
                  md: "88vh",
                },
                maxHeight: {
                  sm: "200px",
                  // md: "88vh",
                },
              }}
            >
              <Typography variant="h4" fontWeight={500} component="h1" sx={{ mb: { xs: 2, md: 2 } }}>
                Chat
              </Typography>
              <SelectChat
                selectedChatConversation={selectedChatConversation}
                setSelectedChatConversation={handleSetSelectedChat}
                availableChatConversations={chatRooms}
                openDialogTrigger={() => {
                  setShowEditId("NOT");
                  setShowEditDialog(true);
                }}
              />
            </Stack>
          </Grid>
          {/*  */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              minHeight: "100%",
            }}
          >
            {selectedChatConversation && userProfile && (
              <ChatContentPane
                selectedChatConversation={selectedChatConversation}
                currentUser={userProfile}
                setSelectedChatConversation={handleSetSelectedChat}
                openEditDialogTrigger={(id: string) => {
                  setShowEditId(id);
                  setShowEditDialog(true);
                }}
              />
            )}
          </Grid>
        </Grid>
      </PagePaperWrapper>
    </>
  );
};

export default ChatScreen;
