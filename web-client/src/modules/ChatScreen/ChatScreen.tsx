import React, { useCallback } from "react";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import PagePaperWrapper from "../../shared/components/PagePaperWrapper/PagePaperWrapper";

import ChatContentPane from "./ChatContentPane";
import SelectChat from "./SelectChat";

export type ISelectedChat = { conversationId: string; conversationName: string };

const ChatScreen = () => {
  const [selectedChatConversation, setSelectedChatConversation] = React.useState<ISelectedChat | null>(null);

  const handleSetSelectedChat = useCallback((chat: ISelectedChat) => {
    setSelectedChatConversation(chat);
  }, []);

  return (
    <PagePaperWrapper>
      <Grid
        spacing={2}
        container
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid item xs={12} md={5}>
          <Stack
            sx={{
              minHeight: {
                sm: "200px",
                md: "88vh",
              },
              maxHeight: {
                sm: "200px",
                // md: "88vh",
              },
            }}
          >
            <Typography variant="h4" fontWeight={500} component="h1" sx={{ mb: { xs: 2, md: 5 } }}>
              Chat
            </Typography>
            <SelectChat setSelectedChatConversation={handleSetSelectedChat} availableChatConversations={[]} />
          </Stack>
        </Grid>
        {/*  */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            minHeight: "100%",
          }}
        >
          <ChatContentPane selectedChatConversation={selectedChatConversation} />
        </Grid>
      </Grid>
    </PagePaperWrapper>
  );
};

export default ChatScreen;
