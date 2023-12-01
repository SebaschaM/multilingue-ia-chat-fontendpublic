import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const Conversation = ({
  isDesktop = true,
  onSelectConversation,
  setDataChat,
  dataAllConversations,
}) => {
  const conversations = dataAllConversations || [];
  const [conversationSelectedTemp, setConversationSelectedTemp] = useState(
    JSON.parse(localStorage.getItem("conversationSelected")) || {}
  );
  const onSelectConversation2 = (conversation) => {
    onSelectConversation(conversation);
    setConversationSelectedTemp(conversation);
    localStorage.setItem("conversationSelected", JSON.stringify(conversation));
    setDataChat(conversation.all_messages);
  };

  // useEffect(() => {
  //   const conversationSelected = JSON.parse(
  //     localStorage.getItem("conversationSelected")
  //   );
  //   if (conversationSelected) {
  //     setConversationSelectedTemp(conversationSelected);
  //     setDataChat(conversationSelected.all_messages);
  //   }
  // }, []);


  if (isDesktop) {
    return (
      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          flexDirection: {
            xs: "row",
            md: "column",
          },
          overflowX: "auto",
          width: "100%",
        }}
      >
        {conversations
          .slice()
          .reverse()
          .map((conversation) => (
            <Card
              key={conversation.uuid}
              onClick={() => onSelectConversation2(conversation)}
              sx={{
                width: "90%",
                margin: "auto",
                marginTop: "20px",
                // backgroundColor: "transparent",
                boxShadow: "none",
                pointerEvents:
                  conversation.uuid === conversationSelectedTemp.uuid
                    ? "none"
                    : "auto",
                backgroundColor:
                  conversation.uuid === conversationSelectedTemp.uuid
                    ? "#e8e8e8"
                    : "transparent",
              }}
            >
              <CardActionArea
                sx={{
                  display: "flex",
                  // alignItems: "start",
                  gap: "1rem",
                  width: "100%",
                  padding: "10px",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  justifyContent: "start",
                  alignItems: {
                    xs: "start",
                    md: "start",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: "45px",
                    height: "45px",
                    backgroundColor: "#666666",
                  }}
                  variant="rounded"
                  src="/avatar_user.jpg"
                />
                <Box>
                  <Typography
                    variant="body1"
                    component="p"
                    fontWeight={"bold"}
                    sx={{
                      textAlign: {
                        xs: "center",
                        md: "start",
                      },
                    }}
                  >
                    {conversation.client_conversation.fullname}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{
                      display: {
                        xs: "none",
                        md: "block",
                      },
                    }}
                  >
                    {conversation.last_message.message_text}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    {/* <Chip
                    label="Cotizacion"
                    size="small"
                    sx={{
                      backgroundColor: "#feebc8",
                      color: "#e38340",
                      fontWeight: "bold",
                    }}
                  />
                  <Chip
                    label="Contratar"
                    size="small"
                    sx={{
                      backgroundColor: "#c6f6d5",
                      color: "#38a169",
                      fontWeight: "bold",
                    }}
                  /> */}
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "row",
          md: "column",
        },
        width: "fit-content",
      }}
    >
      {conversations.map((conversation) => (
        <Card
          key={conversation.uuid}
          onClick={() => onSelectConversation2(conversation)}
          sx={{
            width: "100%",
            margin: "auto",
            marginTop: "20px",
            backgroundColor:
              conversation === conversationSelectedTemp
                ? "#e8e8e8"
                : "transparent",
            boxShadow: "none",
            pointerEvents:
              conversation === conversationSelectedTemp ? "none" : "auto",
          }}
        >
          <CardActionArea
            sx={{
              display: "flex",
              // alignItems: "start",
              gap: "1rem",
              padding: "10px",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              justifyContent: "center",
              alignItems: {
                xs: "center",
                md: "start",
              },
            }}
          >
            <Avatar
              sx={{
                width: "45px",
                height: "45px",
                backgroundColor: "#666666",
              }}
              variant="rounded"
              src="/avatar_user.jpg"
            />
            <Box>
              <Typography
                variant="body1"
                component="p"
                fontWeight={"bold"}
                sx={{
                  textAlign: {
                    xs: "center",
                    md: "start",
                  },
                }}
              >
                {conversation.client_conversation.fullname}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
              >
                {conversation.last_message.message_text}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Chip
                  label="Cotizacion"
                  size="small"
                  sx={{
                    backgroundColor: "#feebc8",
                    color: "#e38340",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  label="Contratar"
                  size="small"
                  sx={{
                    backgroundColor: "#c6f6d5",
                    color: "#38a169",
                    fontWeight: "bold",
                  }}
                />
              </Box>
            </Box>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default Conversation;
