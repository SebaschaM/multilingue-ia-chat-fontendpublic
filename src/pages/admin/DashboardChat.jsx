import { useEffect, useRef, useState } from "react";
import {
  BsCalendarWeek,
  BsJournalText,
  BsThreeDotsVertical,
} from "react-icons/bs";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { LayoutDashboard, LayoutDashboardContent } from "../../layout";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  Conversation,
  MessageFrom,
  MessageMe,
  ModalCustom,
} from "../../components";
import { useChat } from "../../hooks/useChat";
import FormTipify from "../../components/form/formTipify";
import { useNavigate } from "react-router-dom";
import { Fernet } from "fernet-ts";
import { verifyMessage } from "../../utils/dataBadWords.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxWidth: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const DashboardChat = () => {
  const router = useNavigate();
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const { getConversationsByID, getMessageByIdConversation } = useChat();
  const [allConversations, setAllConversations] = useState([]);
  const [dataChat, setDataChat] = useState([]);
  const [inputSearchMessage, setInputSearchMessage] = useState("");
  const [conversationSelected, setConversationSelected] = useState({});
  const [openModalRequest, setOpenModalRequest] = useState(false);
  const [openModalRequestTipificar, setOpenModalRequestTipificar] =
    useState(false);
  const [showOptionsRequest, setshowOptionsRequest] = useState(false);
  const [roomNameSelect, setRoomNameSelect] = useState("");

  const [selectedOption, setSelectedOption] = useState("");
  const [modalResponse, setModalResponse] = useState({
    show: false,
    message: "",
  });
  //fernet
  const [keyFernet, setKeyFernet] = useState();
  //toast
  const [toast, setToast] = useState(false);

  const socketRef = useRef();
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const userID = userData?.user?.id || null;
  const fullname = userData?.user?.fullname;
  const room_name = uuidv4();

  if (!userID) {
    router("/admin/auth");
  }

  const onGetAllConversations = async () => {
    setIsLoadingConversation(true);
    const { data, error } = await getConversationsByID(userID);

    // setAllConversations(data.conversations);
    const updatedConversations = data.conversations.map((conversation) => ({
      ...conversation,
      last_message: {
        ...conversation.last_message,
        // Update the desired properties of last_message here
      },
    }));

    setAllConversations(updatedConversations);
    setIsLoadingConversation(false);
  };

  const onGetMessagesByIdConversation = async (idConversation) => {
    const { data, error } = await getMessageByIdConversation(idConversation);
    // console.log(data);
    setDataChat(data.messages);
  };

  //CLOSE TOAST
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  const onSendMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataInputMessage = formData.get("message");
    const inputElement = e.target.elements.message;
    const isBadMessage = verifyMessage(2, dataInputMessage, true);

    if (isBadMessage) {
      inputElement.value = "";
      setToast(true);
      return;
    }

    const newMessage = {
      id: userData.user.id,
      room_name: conversationSelected.room_name,
      fullname: fullname,
      message: await encryptMessageTest(dataInputMessage),
      date: new Date().toLocaleString(),
    };

    socketRef.current.emit("send_message", newMessage,  () => {
      //setDataChat((prev) => [...prev, dataInputMessage]);
       onGetAllConversations();
    });
    inputElement.value = "";
  }

  socketRef?.current?.on("update_conversations", async (data) => {
    const isUpdated = data.update;

    if (isUpdated) {
      await onGetAllConversations();
    }
  });

  const encryptMessageTest = async (message) => {
    const f = await Fernet.getInstance(keyFernet);
    const messageEncrypt = await f.encrypt(message);
    return messageEncrypt;
  };

  useEffect(() => {
    const socket = io.connect("http://localhost:5000", { reconnection: true });
    socketRef.current = socket;
  
    socket.on("connect", () => {
      console.log("Socket conectado en CHAT");
      const roomName = "58942a47-931d-41fa-81cd-426e6d54c750"; // !Esperar a que el cliente cree el room
  
      // socket.emit("assign_user_to_room", {
      //   room_name: roomName,
      //   user: { ...userData, fullname: userData.user.fullname },
      // });
    });
  
    socket.on("error_joining_room", (error) => {
      console.log(error);
    });
  
    socket.on("error_send_message", (error) => {
      console.log(error);
    });
  
    socket.on("disconnect", () => {
      socket.emit("close_room", {
        room_name: "cuartito2",
        user: userData,
      });
  
      socket.on("private_room_closed", () => {
        console.log("Sala privada cerrada");
      });
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleEncryption = async () => {
      socketRef.current.on("get_messages", async (messages) => {
        const encryptedMessage_text = messages.message_text;
        const decryptedMessage = await desencryptMessageTest(encryptedMessage_text);
        messages.message_text = decryptedMessage;
        const encryptedMessage_traslated = messages.message_traslated_text;
        const decryptedMessage_traslated = await desencryptMessageTest(encryptedMessage_traslated);
        messages.message_traslated_text = decryptedMessage_traslated;
        setDataChat((prev) => [...prev, messages]);
  
        await onGetAllConversations();
      });
  
      socketRef.current.on("send_fernet_key_base_64", (data) => {
        const { key } = data;
        const keyFernetDecoded = atob(key);
        setKeyFernet(keyFernetDecoded);
      });
  
      const desencryptMessageTest = async (messageEncrypt) => {
        const f = await Fernet.getInstance(keyFernet);
        const decryptM = await f.decrypt(messageEncrypt);
        return decryptM;
      };
    };
  
    handleEncryption();
  }, [keyFernet]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) {
      router("/admin/auth");
    }
  }, []);

  useEffect(() => {
    setConversationSelected({});
  }, []);

  useEffect(() => {
    onGetAllConversations();

    return () => {
      setAllConversations([]);
    };
  }, []);

  useEffect(() => {
    onGetMessagesByIdConversation(conversationSelected.uuid);

    if (
      conversationSelected.room_name !== null &&
      conversationSelected.room_name !== undefined
    ) {
      socketRef.current.emit("assign_user_to_room", {
        room_name: conversationSelected.room_name,
        user: { ...userData, fullname: userData.user.fullname },
      });
    }
  }, [conversationSelected]);

  // useEffect(() => {
  //   const conversationSelectedTemp = JSON.parse(
  //     localStorage.getItem("conversationSelected")
  //   );

  //   if (conversationSelectedTemp) {
  //     setConversationSelected(conversationSelectedTemp);
  //   }
  // }, []);

  const onSelectConversation = (conversation) => {
    setConversationSelected(conversation);
    // localStorage.setItem("conversationSelected", JSON.stringify(conversation));
    setDataChat(conversation.all_messages);
  };

  //! COLOCAR EL MODAL DE RESPONSE
  useEffect(() => {}, [modalResponse, setModalResponse]);

  return (
    <LayoutDashboard title="Overall Holding">
      <LayoutDashboardContent title="Gestión de Chats">
        <Grid
          container
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              height: "fit-content",
              width: "fit-content",
            }}
            overflow={"auto"}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <Typography variant="h6" component="h3" textAlign="center">
                Mensajes
              </Typography>
              {/* <Badge badgeContent={allConversations.length} color="secondary" /> */}
            </Box>

            {/* Input search conversation */}
            <Box
              sx={{
                width: "90%",
                margin: "auto",
                marginTop: "20px",
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar mensajes..."
                onChange={(e) => setInputSearchMessage(e.target.value)}
                defaultValue={inputSearchMessage}
                sx={{ width: "100%" }}
              />
            </Box>

            {/* Conversation Desktop  */}
            {isLoadingConversation ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Conversation
                isDesktop={true}
                // setConversation={setConversationSelected}
                onSelectConversation={onSelectConversation}
                setDataChat={setDataChat}
                dataAllConversations={
                  allConversations &&
                  allConversations.length > 0 &&
                  allConversations.filter((conversation) => {
                    if (inputSearchMessage === "") {
                      return conversation;
                    } else if (
                      conversation?.client_conversation?.fullname
                        ?.toLowerCase()
                        .includes(inputSearchMessage.toLowerCase())
                    ) {
                      return conversation;
                    }
                  })
                }
              />
            )}
          </Grid>
          <Grid
            sx={{
              width: "fit-content",
              overflowX: "auto",
              display: {
                xs: "flex",
                md: "none",
              },
            }}
          >
            <Conversation
              isDesktop={false}
              onSelectConversation={onSelectConversation}
              // setConversation={setConversationSelected}
              setDataChat={setDataChat}
              dataAllConversations={allConversations}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              borderLeft: "2px solid #dedede",
              borderTop: {
                xs: "2px solid #dedede",
                md: "none",
              },
              borderRight: {
                xs: "2px solid #dedede",
                md: "none",
              },
              height: {
                xs: "fit-content",
                md: "100%",
              },
              marginTop: {
                xs: "20px",
                md: "0px",
              },
              marginBottom: {
                xs: "20px",
                md: "0px",
              },
            }}
          >
            {/* Header */}
            {conversationSelected?.client_conversation?.fullname && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: "20px",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" component="h3">
                      {conversationSelected?.client_conversation?.fullname}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <IconButton
                      onClick={() => setshowOptionsRequest(!showOptionsRequest)}
                      sx={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <BsThreeDotsVertical size="24px" color="#000" />
                    </IconButton>

                    {/* Poner las opciones de agendamiento */}
                    {showOptionsRequest && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          position: "absolute",
                          left: "-5.5rem",
                          top: "3rem",
                          zIndex: "100",
                        }}
                      >
                        <Button
                          onClick={() => {
                            setOpenModalRequest(true);
                            setshowOptionsRequest(false);
                            setSelectedOption("agendar");
                          }}
                          sx={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                            padding: "1rem",
                          }}
                        >
                          Agendar
                          <BsCalendarWeek />
                        </Button>
                        <Button
                          onClick={() => {
                            setOpenModalRequestTipificar(true);
                            setshowOptionsRequest(false);
                            setSelectedOption("tipificar");
                          }}
                          sx={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                            padding: "1rem",
                          }}
                        >
                          Tipificar
                          <BsJournalText />
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ marginTop: "10px" }} />

                {/* Body */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: {
                      xs: "fit-content",
                      md: "calc(100% - 60px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "20px",
                      paddingLeft: "20px",
                      // height: "25rem",
                      overflowY: "auto",
                      height: "fit-content",
                    }}
                  >
                    {/* Aqui  */}
                    {dataChat &&
                      dataChat?.map((chat) =>
                        chat?.id_user_sender === userID ? (
                          <MessageMe
                            key={chat.uuid}
                            message={chat.message_text}
                            date={chat.created_at}
                          />
                        ) : (
                          <MessageFrom
                            key={chat.uuid}
                            message={chat.message_traslated_text}
                            date={chat.created_at}
                          />
                        )
                      )}
                  </Box>

                  {/* Input */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "20px",
                      paddingLeft: {
                        xs: "10px",
                        md: "20px",
                      },
                      height: "10%",
                    }}
                  >
                    <form
                      onSubmit={(e) => onSendMessage(e)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: "10px",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Escribe un mensaje..."
                        sx={{ width: "100%" }}
                        name="message"
                        // value={dataInputMessage}
                        // onChange={(e) => setDataInputMessage(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: "fit-content", color: "#fff" }}
                        // onClick={() => onSendMessage()}
                      >
                        Enviar
                      </Button>
                    </form>
                  </Box>
                </Box>
              </>
            )}
          </Grid>
          {toast && (
            <Snackbar
              open={toast}
              autoHideDuration={3000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="warning"
                sx={{ width: "100%" }}
              >
                Mensaje eliminado por motivos de seguridad
              </Alert>
            </Snackbar>
          )}
        </Grid>

        {/* MODAL RESPONSE */}
        <ModalCustom
          openModal={modalResponse?.show}
          setOpenModal={setModalResponse}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              sx={{ fontSize: "25px", fontWeight: "bold" }}
              variant="h1"
            >
              {modalResponse?.message}
            </Typography>
          </div>
        </ModalCustom>

        <Modal
          open={openModalRequest}
          onClose={() => setOpenModalRequest(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
            >
              Agendamiento
            </Typography>
            <FormTipify
              onUserSelected={conversationSelected}
              onUserTyping={userData}
              openModal={setOpenModalRequest}
              onSelectedOption={selectedOption}
              onModalResponse={modalResponse}
              onSetModalResponse={setModalResponse}
            />
          </Box>
        </Modal>

        <Modal
          open={openModalRequestTipificar}
          onClose={() => setOpenModalRequestTipificar(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              textAlign={"center"}
            >
              Tipificación
            </Typography>
            <FormTipify
              onUserSelected={conversationSelected}
              onUserTyping={userData}
              openModal={setOpenModalRequestTipificar}
              onSelectedOption={selectedOption}
              onModalResponse={modalResponse}
              onSetModalResponse={setModalResponse}
            />
          </Box>
        </Modal>
      </LayoutDashboardContent>
    </LayoutDashboard>
  );
};

export default DashboardChat;
