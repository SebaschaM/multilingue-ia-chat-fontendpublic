import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styles from "./Home.module.css";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { LandingPart3, LandingPart2 } from "../../components/index";

import {
  Box,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import {
  category,
  responseInit,
  formTo2Cap,
  textModal,
} from "../../utils/dataChatbot";
import { useChatClient } from "../../hooks/useChatClient.JSX";
import { set } from "date-fns";

function Home() {
  //LANDING
  const [activePage, setActivePage] = useState(1);
  const [buttonChatDisable, setButtonChatDisable] = useState(true);
  const [buttonChat, setButtonChat] = useState(false);
  const [showCap, setShowCap] = useState(0);
  const [dataModalOptions, setDataModalOptions] = useState({
    textModal: [],
  });

  //MODAL
  const [modalExit, setModalExit] = useState(false);

  //0 CAPAS
  const [selectLanguage, setSelectLanguage] = useState(2);

  //1 CAP
  const [, setCategoriaSeleccionadaId] = useState(null);
  const [chatMensajesFrecuentes, setChatMensajesFrecuentes] = useState({
    messages: [],
  });

  //HOOK - CAPA FORMULARIO
  const { handleRegisterUserChat } = useChatClient(); //HOOK PARA REGISTRO EN FORMULARIO
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(); //FORMULARIO VALIDACIONES Y GUARDADO

  const [dataForm, setDataForm] = useState({
    form: [],
  });

  //SOCKET
  const socketRef = useRef(); //usar

  //2 CAP
  const [textFieldValue, setTextFieldValue] = useState("");
  const [chat, setChat] = useState([]);
  const [userCap2, setUserCap2] = useState(null);
  const [showTextField, setShowTextField] = useState(true);

  //3 CAP
  //const [dataChat, setDataChat] = useState([]); //observacion
  const [showLoader, setShowLoader] = useState(false);
  const [chatCap3, setChatCap3] = useState([]);
  const [userId, setUserId] = useState(null);
  // const userData = JSON.parse(localStorage.getItem("userData"));

  const showLoaderTo3Cap = async () => {
    setModalExit(false);
    setChat([]);
    setTimeout(() => {
      setShowLoader(true);
      setShowTextField(false);
    }, 200);
    setTimeout(() => {
      setShowLoader(false);
    }, 3500);
    setTimeout(() => {
      setShowCap(4);
    }, 2000);

    await connectSocket(userCap2, textFieldValue);
  };

  const handleChange = (e) => {
    setTextFieldValue(e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      const languageIdLocalStorage = localStorage.getItem("idLenguaje");
      const dataRegister = {
        email: data.email,
        fullname: data.fullname,
        cellphone: data.cellphone,
        language_id: languageIdLocalStorage,
      };
      const dataSave = await handleRegisterUserChat(dataRegister);
      setUserCap2(dataSave.user);
      await connectSocket(dataSave.user, data.consult);
      enviarPrimerMensaje(dataSave.user, data.consult);
      setShowCap(3);
      localStorage.setItem("userData", JSON.stringify(dataSave.user));
      reset();
    } catch (error) {
      console.error("Error al subir el formulario:", error);
    }
  };

  // socketRef?.current?.on("get_messages", (messages) => {
  //   console.log(messages);
  //   setChat((prev) => [...prev, messages]);
  // });

  const connectSocket = async (dataSaveUser, dataConsultForm) => {
    const socket = io.connect("http://localhost:5000", {
      reconnection: true,
    });

    socketRef.current = socket;
    let roomName = localStorage.getItem("idRoom");
    let room_name;

    if (roomName && roomName.length > 0) {
      room_name = roomName;
    } else {
      room_name = uuidv4();
      localStorage.setItem("idRoom", room_name);
    }

    socket.on("connect", () => {
      console.log("Socket conectado en CHAT");
      socket.emit("assign_user_to_room", {
        user: dataSaveUser,
        room_name: room_name,
        message: dataConsultForm,
      });
    });

    socket.on("error_joining_room", (error) => {
      console.log(error);
    });

    socket.on("error_send_message", (error) => {
      console.log(error);
    });

    socket.on("disconnect", () => {
      socket.emit("close_room", {
        room_name: room_name,
        user: dataSaveUser,
      });

      socket.on("private_room_closed", () => {
        console.log("Sala privada cerrada");
      });
    });

    return room_name;
  };

  //3ERA CAP
  const EnviarMensajeUsuario3Cap = () => {
    //FUNCION DONDE USA CUANDO EL CLIENTE MANDA ALGUN MENSAJE EN LA CAPA 3
    const idRoomName = localStorage.getItem("idRoom");
    if (textFieldValue.trim() !== "") {
      // setChatCap3((prev) => [
      //   ...prev,
      //   {
      //     message: textFieldValue,
      //     user: userCap2,
      //     room_name: idRoomName,
      //   },
      // ]);

      socketRef.current.emit("send_message", {
        fullname: userCap2.fullname,
        id: userCap2.id,
        date: new Date().toLocaleDateString(),
        room_name: idRoomName,
        message: textFieldValue,
      });

      setTextFieldValue("");
    } else {
      // Puedes agregar una alerta o manejar el caso de mensaje vacío de alguna manera
      console.log("No se puede enviar un mensaje vacío");
    }
  };

  console.log("DATA CHAT:" + String(chat));

  //2 CAP
  const enviarPrimerMensaje = (dataSaveUser, dataConsultForm) => {
    const idRoomName = localStorage.getItem("idRoom");
    setChat((prev) => [
      ...prev,
      {
        message: dataConsultForm, // " todo bien"
        user: dataSaveUser,
        room_name: idRoomName,
      },
    ]);

    socketRef.current.emit("respuesta_de_bot", {
      message: dataConsultForm,
      room_name: idRoomName,
    });

    socketRef?.current?.on("response_bot", (data) => {
      // setear el setChat
      setChat((prev) => [
        ...prev,
        {
          message: data.message,
          user: data.user,
          room_name: data.room_name,
        },
      ]);

      socketRef?.current?.off("response_bot");
      socketRef?.current?.off("respuesta_de_bot");
    });
  };

  const enviarMensajeUsuario = () => {
    //FUNCION DONDE USA CUANDO EL CLIENTE MANDA ALGUN MENSAJE EN LA CAPA 2
    const idRoomName = localStorage.getItem("idRoom");
    if (textFieldValue.trim() !== "") {
      setChat((prev) => [
        ...prev,
        {
          message: textFieldValue,
          user: userCap2,
          room_name: idRoomName,
        },
      ]);

      socketRef.current.emit("respuesta_de_bot", {
        message: textFieldValue,
        room_name: idRoomName,
      });

      socketRef?.current?.on("response_bot", (data) => {
        // setear el setChat
        setChat((prev) => [
          ...prev,
          {
            message: data.message,
            user: data.user,
            room_name: data.room_name,
          },
        ]);
        socketRef?.current?.off("respuesta_de_bot");
        socketRef?.current?.off("response_bot");
      });

      setTextFieldValue("");
    } else {
      // Puedes agregar una alerta o manejar el caso de mensaje vacío de alguna manera
      console.log("No se puede enviar un mensaje vacío");
    }
  };

  const showModalOptions = () => {
    const textModalOption = textModal.find((option) =>
      // eslint-disable-next-line no-prototype-builtins
      option.textModalClose.hasOwnProperty(selectLanguage)
    );

    setDataModalOptions(() => {
      return {
        textModal: {
          textModalClose: textModalOption.textModalClose[selectLanguage],
          textModal3Cap: textModalOption.textModal3Cap[selectLanguage],
        },
      };
    });
  };

  const showForm = () => {
    //MOSTRAR FORMULARIO DE ACUERDO AL IDIOMA
    const formTo2CapFind = formTo2Cap.find((form) =>
      // eslint-disable-next-line no-prototype-builtins
      form.titleForm.hasOwnProperty(selectLanguage)
    );

    setDataForm((prev) => {
      return {
        ...prev,
        form: [
          ...prev.form,
          {
            form: {
              from: "form",
              title: formTo2CapFind.titleForm[selectLanguage],
              fullanme: formTo2CapFind.form.fullaname[selectLanguage],
              consult: formTo2CapFind.form.consult[selectLanguage],
              email: formTo2CapFind.form.email[selectLanguage],
              phone: formTo2CapFind.form.phone[selectLanguage],
              optionSend: formTo2CapFind.form.optionSend[selectLanguage],
              optionCancel: formTo2CapFind.form.optionCancel[selectLanguage],
            },
          },
        ],
      };
    });
  };

  socketRef?.current?.on("get_messages", (data) => {
    // setear el setChat
    setChatCap3((prev) => [
      ...prev,
      {
        message: data.message_traslated_text,
        user: data.id,
        room_name: data.room_name,
      },
    ]);
  });

  // useEffect(() => {
  //   if (socketRef.current) {
  //     socketRef.current.on("get_messages", (data) => {
  //       // setear el setChat
  //       setChatCap3((prev) => [
  //         ...prev,
  //         {
  //           message: data.message_traslated_text,
  //           user: data.id,
  //           room_name: data.room_name,
  //         },
  //       ]);

  //       console.log(data);
  //       console.log("DATA CHAT:" + chatCap3);
  //     });
  //   }

  //   return () => {
  //     // Limpiar el evento al desmontar el componente o cuando el efecto cambie
  //     socketRef.current.off("get_messages");
  //   };
  // }, [textFieldValue]);

  const setIdLocalStorageLanguage = () => {
    //SALUDO DEL BOT DE ACUERDO AL IDIOMA - LISTA CATEGORIAS
    localStorage.setItem("idLenguaje", selectLanguage);
    setSelectLanguage(selectLanguage);
    const responseForLanguage = responseInit.find((response) =>
      // eslint-disable-next-line no-prototype-builtins
      response.respuesta.hasOwnProperty(selectLanguage)
    );

    // Modificamos el json de chatMensajeFrecuentes para el bot
    setChatMensajesFrecuentes((prev) => {
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            message: {
              from: "bot",
              text: responseForLanguage.respuesta[selectLanguage],
            },
          },
        ],
      };
    });

    // Modificamos el json de chatMensajeFrecuentes para el usuario
    setChatMensajesFrecuentes((prev) => {
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            message: {
              from: "user",
              opciones: category.map((categoria) => ({
                id: categoria.id,
                pregunta: categoria.categoria[selectLanguage],
              })),
            },
          },
        ],
      };
    });
  };

  const showQuestions = (id) => {
    //REPETIR LA SELECCION - DAR LAS RESPUESTA DE ACUERDO AL IDIOMA
    setCategoriaSeleccionadaId(id);
    const categoryFind = category.find((categoria) => categoria.id === id);
    const idCategoria = categoryFind.id;

    // Modificamos el json de chatMensajeFrecuentes para el bot
    setChatMensajesFrecuentes((prev) => {
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            message: {
              from: "bot",
              id: new Date().getTime(),
              text: categoryFind.categoria[selectLanguage],
            },
          },
        ],
      };
    });

    setChatMensajesFrecuentes((prev) => {
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            message: {
              from: "user",
              id: idCategoria,
              text: [categoryFind.respuesta[selectLanguage] || null],
              buttonToForm:
                idCategoria === 5
                  ? categoryFind.buttonToForm[selectLanguage] || null
                  : null,
            },
          },
        ],
      };
    });
  };

  const cleanChatBot = () => {
    setDataForm({ form: [] });
    setChat([]);
    setChatMensajesFrecuentes({ messages: [] });
    setButtonChatDisable(true);
    setButtonChat(false);
    setShowTextField(true);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    localStorage.removeItem("idRoom");
    //localStorage.removeItem("idLenguaje");
  };

  const ChatbotView = () => {
    setButtonChat(true);
    setShowCap(0);
    setModalExit(false);
    setButtonChatDisable(false);
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollPosition < windowHeight) {
      setActivePage(1);
    } else if (scrollPosition < windowHeight * 2) {
      setActivePage(2);
    } else {
      setActivePage(3);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className={styles.container}>
      <section className={activePage === 1 ? styles.active : ""}>
        <img
          className={styles.fondo1}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698270354/exe%20digital/vmmpglnqkjmof2bcqbz8.jpg"
          alt="fondo1"
        />
        <img
          className={styles.logo}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698270673/exe%20digital/uubwmilnxnlahvgj6ufl.png"
          alt="logo"
        />
        {buttonChatDisable && (
          <img
            className={styles.bot}
            src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698271161/exe%20digital/bkncyocxtsg3oeywvrjr.png"
            alt="bot"
            onClick={() => {
              ChatbotView();
            }}
          />
        )}
      </section>

      <LandingPart2 activePage={activePage} />

      <LandingPart3 activePage={activePage} />

      {buttonChat && (
        <div className={styles.chatbot}>
          <header>
            <img
              className={styles.minibot}
              src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698271161/exe%20digital/bkncyocxtsg3oeywvrjr.png"
            />
            <div className={styles.h2s}>
              <h2>Exe Digital</h2>
              <h2>Exe@digital.exe</h2>
            </div>
          </header>

          {showCap === 0 && (
            //CHOOSE LANGUAGE
            <ul className={styles.chatbox}>
              <p className={styles.text_select_lang}>
                SELECCIONA TU IDIOMA DE PREFERENCIA
              </p>

              <Box sx={{ width: "15rem", margin: "0 auto" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">IDIOMA</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectLanguage}
                    label="IDIOMA"
                    onChange={(e) => {
                      setSelectLanguage(e.target.value);
                    }}
                  >
                    <MenuItem value={1}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/omfyl323bmlrpugbcqnt"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Inglés</span>
                    </MenuItem>
                    <MenuItem value={2}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/eq00wpurgsniuw5seu8f"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Español</span>
                    </MenuItem>
                    <MenuItem value={3}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/a8ofd9yegmttqzz4nize"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Chino</span>
                    </MenuItem>
                    <MenuItem value={4}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/iohlrr6picwcjujiqtkw"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Ruso</span>
                    </MenuItem>
                    <MenuItem value={5}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/hegi2awnvagp3gmrwx5b"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Árabe</span>
                    </MenuItem>
                    <MenuItem value={6}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/cs3zt6uhlejuztofwxav"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Quechua</span>
                    </MenuItem>
                    <MenuItem value={7}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/kueapg0vdgoi7mlxjn9m"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Japonés</span>
                    </MenuItem>
                    <MenuItem value={8}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/hpfpy5ahw0lwvm3jtbwi"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Portugués</span>
                    </MenuItem>
                    <MenuItem value={9}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/o0104akjkwujhfgal2vc"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Francés</span>
                    </MenuItem>
                    <MenuItem value={10}>
                      <img
                        className={styles.bandera}
                        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/f_auto,q_auto/v1/IA_MULTILINGUE/ohcwpyx8deujvnwx1nus"
                        alt="españa"
                      />
                      <span style={{ marginLeft: "1rem" }}>Coreano</span>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <div className={styles.container_button}>
                <div
                  className={styles.guardar}
                  onClick={() => {
                    setIdLocalStorageLanguage();
                    setShowCap(1);
                    showModalOptions();
                  }}
                >
                  <p>GUARDAR CONFIGURACIÓN</p>
                </div>

                <div
                  className={styles.guardar}
                  onClick={() => {
                    setButtonChat(!buttonChat);
                    setButtonChatDisable(true);
                  }}
                >
                  <p>CANCELAR</p>
                </div>
              </div>
            </ul>
          )}
          {showCap === 1 && (
            //CHATBOT CAP1
            <>
              <ul className={styles.chatbox}>
                {chatMensajesFrecuentes.messages.map((message) => (
                  <div key={message.id}>
                    <pre>{JSON.stringify(message.id)}</pre>
                    {message.message.from === "bot" && (
                      <li className={styles.chatincoming}>
                        <img
                          className={styles.minibot2}
                          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699065957/exe%20digital/unbrk0uzq1pdvwysiqpg.png"
                          alt="Bot Avatar"
                        />

                        <p className={styles.texto}>{message.message.text}</p>
                      </li>
                    )}

                    {message.message.from === "user" && (
                      <ul
                        className={styles.chatoutgoing}
                        key={message.message.id}
                      >
                        {message.message.text ? (
                          <p
                            className={styles.chatoutgoing_response}
                            key={message.message.id}
                          >
                            {message.message.id === 5 ? (
                              <div
                                className={
                                  styles.container_response_button_chat
                                }
                              >
                                {message.message.text}

                                <Button
                                  onClick={() => {
                                    setShowCap(2);
                                    setDataForm({ form: [] });
                                    showForm();
                                  }}
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "black",
                                    "&:hover": {
                                      backgroundColor: "#17C3CE",
                                      color: "white",
                                    },
                                  }}
                                >
                                  {message.message.buttonToForm}
                                </Button>
                              </div>
                            ) : (
                              message.message.text
                            )}
                          </p>
                        ) : (
                          <>
                            {message.message.opciones.map((pregunta) => (
                              <li
                                key={pregunta.id}
                                onClick={() => showQuestions(pregunta.id)}
                              >
                                {pregunta.pregunta}
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                ))}

                <div className={styles.footer_area}>
                  <img
                    className={styles.barras}
                    src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699070715/exe%20digital/fyczge5dyxnvxsbz6xyb.png"
                    onClick={() => {
                      setModalExit(!modalExit);
                    }}
                  />
                </div>
                {modalExit && (
                  <div className={styles.container_modal}>
                    <div className={styles.modal}>
                      <Button
                        sx={{
                          backgroundColor: "#17C3CE",
                          color: "white",
                          fontWeight: "bold",

                          "&:hover": {
                            backgroundColor: "#17C3CE",
                          },
                        }}
                        onClick={() => {
                          cleanChatBot();
                        }}
                      >
                        {dataModalOptions.textModal.textModalClose}
                      </Button>
                    </div>
                  </div>
                )}
              </ul>
            </>
          )}
          {showCap === 2 && (
            //FORM
            <ul className={styles.chatbox}>
              {dataForm.form.map((data) => {
                return (
                  <>
                    {data.form.from === "form" && (
                      <form
                        className={styles.form_container}
                        key={data.form.id}
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <span className={styles.form_tittle}>
                          {data.form.title}
                        </span>
                        <TextField
                          id="standard-basic"
                          sx={{ width: "100%" }}
                          label={data.form.fullanme}
                          type="text"
                          variant="standard"
                          {...register("fullname")}
                        />

                        <TextField
                          id="standard-basic"
                          sx={{ width: "100%" }}
                          label={data.form.phone}
                          type="text"
                          variant="standard"
                          {...register("cellphone")}
                        />

                        <TextField
                          id="standard-basic"
                          sx={{ width: "100%" }}
                          label={data.form.email}
                          variant="standard"
                          type="email"
                          {...register("email")}
                        />
                        <TextField
                          id="standard-multiline-static"
                          label={data.form.consult}
                          sx={{ width: "100%" }}
                          multiline
                          rows={3}
                          type="text"
                          variant="standard"
                          {...register("consult")}
                        />
                        <div className={styles.btn_container}>
                          <Button
                            variant="contained"
                            type="submit"
                            sx={{
                              width: "100%",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            {data.form.optionSend}
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              width: "100%",
                              color: "white",
                              fontWeight: "bold",
                            }}
                            onClick={() => setShowCap(1)}
                          >
                            {data.form.optionCancel}
                          </Button>
                        </div>
                      </form>
                    )}
                  </>
                );
              })}
            </ul>
          )}
          {showCap === 3 && (
            //CHAT IA CAP2
            <>
              <ul className={styles.chatbox}>
                {chat.map((message) => (
                  <>
                    {message.user === "Bot" && (
                      <li className={styles.chatincoming} key={message.id}>
                        <img
                          className={styles.minibot2}
                          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699065957/exe%20digital/unbrk0uzq1pdvwysiqpg.png"
                          alt="Bot Avatar"
                        />

                        <p className={styles.texto}>{message.message}</p>
                      </li>
                    )}

                    {typeof message.user == "object" && (
                      <ul className={styles.chatoutgoing} key={message.id}>
                        {message.message && (
                          <p className={styles.chatoutgoing_response}>
                            {message.message}
                          </p>
                        )}
                      </ul>
                    )}
                  </>
                ))}
                {showTextField && (
                  <div className={styles.footer_area_cap2}>
                    <img
                      className={styles.barras}
                      src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699070715/exe%20digital/fyczge5dyxnvxsbz6xyb.png"
                      onClick={() => {
                        setModalExit(!modalExit);
                      }}
                    />
                    <TextField
                      id="standard-basic"
                      variant="standard"
                      placeholder="Escribe tu mensaje"
                      sx={{ width: "100%" }}
                      onChange={handleChange}
                      value={textFieldValue}
                    />
                    <SendIcon
                      onClick={enviarMensajeUsuario}
                      sx={{ cursor: "pointer" }}
                    />
                  </div>
                )}

                {modalExit && (
                  <div className={styles.container_modal}>
                    <div className={styles.modal}>
                      <Button
                        sx={{
                          backgroundColor: "#17C3CE",
                          color: "white",
                          fontWeight: "bold",

                          "&:hover": {
                            backgroundColor: "#17C3CE",
                          },
                        }}
                        onClick={() => {
                          showLoaderTo3Cap();
                        }}
                      >
                        {dataModalOptions.textModal.textModal3Cap}
                      </Button>
                      <Button
                        sx={{
                          backgroundColor: "#17C3CE",
                          color: "white",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#17C3CE",
                          },
                        }}
                        onClick={() => {
                          cleanChatBot();
                        }}
                      >
                        {dataModalOptions.textModal.textModalClose}
                      </Button>
                    </div>
                  </div>
                )}
                {showLoader && (
                  <div className={styles.container_modal}>
                    <div className={styles.loader}>
                      <div className={`${styles.box} ${styles["box-1"]}`}>
                        <div className={styles["side-left"]}></div>
                        <div className={styles["side-right"]}></div>
                        <div className={styles["side-top"]}></div>
                      </div>
                      <div className={`${styles.box} ${styles["box-2"]}`}>
                        <div className={styles["side-left"]}></div>
                        <div className={styles["side-right"]}></div>
                        <div className={styles["side-top"]}></div>
                      </div>
                      <div className={`${styles.box} ${styles["box-3"]}`}>
                        <div className={styles["side-left"]}></div>
                        <div className={styles["side-right"]}></div>
                        <div className={styles["side-top"]}></div>
                      </div>
                      <div className={`${styles.box} ${styles["box-4"]}`}>
                        <div className={styles["side-left"]}></div>
                        <div className={styles["side-right"]}></div>
                        <div className={styles["side-top"]}></div>
                      </div>
                    </div>
                  </div>
                )}
              </ul>
            </>
          )}
          {showCap === 4 && (
            //CHATIA ASESOR
            <>
              <ul className={styles.chatbox}>
                {chatCap3.map((message) => (
                  <>
                    {/* <pre>{JSON.parse(chat)}</pre> */}
                    {/* {message.user === "user" && (
                      <li className={styles.chatincoming} key={message.id}>
                        <p className={styles.texto}>{message.message}</p>
                      </li>
                    )} */}

                    {message.id_user_receiver ==
                    JSON.parse(localStorage.getItem("userData")).id ? (
                      <li className={styles.chatoutgoing} key={message.id}>
                        <p className={styles.chatoutgoing_response}>
                          {message.message}
                        </p>
                      </li>
                    ) : (
                      <li className={styles.chatincoming} key={message.id}>
                        {/* <pre>
                          {JSON.parse(localStorage.getItem("userData")).id}
                        </pre> */}
                        {/* <pre>{message.id_user_receiver} </pre> */}
                        <p className={styles.texto}>{message.message}</p>
                      </li>
                    )}
                  </>
                ))}
              </ul>
              <div className={styles.footer_area_cap2}>
                <img
                  className={styles.barras}
                  src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699070715/exe%20digital/fyczge5dyxnvxsbz6xyb.png"
                  onClick={() => {
                    setModalExit(!modalExit);
                  }}
                />
                <TextField
                  id="standard-basic"
                  variant="standard"
                  placeholder="Escribe tu mensaje"
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                  value={textFieldValue}
                />
                <SendIcon
                  onClick={EnviarMensajeUsuario3Cap}
                  sx={{ cursor: "pointer" }}
                />
              </div>
              {modalExit && (
                <div className={styles.container_modal}>
                  <div className={styles.modal}>
                    <Button
                      sx={{
                        backgroundColor: "#17C3CE",
                        color: "white",
                        fontWeight: "bold",

                        "&:hover": {
                          backgroundColor: "#17C3CE",
                        },
                      }}
                      onClick={() => {
                        cleanChatBot();
                      }}
                    >
                      {dataModalOptions.textModal.textModalClose}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
