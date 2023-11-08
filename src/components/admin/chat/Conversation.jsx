import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";

const Conversation = ({
  isDesktop = true,
  setConversation,
  setDataChat,
  dataAllConversations,
}) => {
  const conversations = dataAllConversations || [];

  const onSelectConversation = (conversation) => {
    setConversation(conversation);
    // * Aqui setear la conversaciones
    setDataChat(conversation.all_messages);
  };

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
        {conversations.map((conversation) => (
          <Card
            key={conversation.uuid}
            onClick={() => onSelectConversation(conversation)}
            sx={{
              width: "90%",
              margin: "auto",
              marginTop: "20px",
              backgroundColor: "transparent",
              boxShadow: "none",
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
          onClick={() => onSelectConversation(conversation)}
          sx={{
            width: "100%",
            margin: "auto",
            marginTop: "20px",
            backgroundColor: "transparent",
            boxShadow: "none",
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
