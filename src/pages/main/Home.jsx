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

import { category, responseInit, formTo2Cap } from "../../utils/dataChatbot";
import { useChatClient } from "../../hooks/useChatClient.JSX";

function Home() {
  //LANDING
  const [activePage, setActivePage] = useState(1);
  const [buttonChatDisable, setButtonChatDisable] = useState(true);
  const [buttonChat, setButtonChat] = useState(false);
  const [dataChat, setDataChat] = useState([]);
  const [showCap, setShowCap] = useState(0);

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
  const { register, handleSubmit } = useForm(); //FORMULARIO VALIDACIONES Y GUARDADO

  const [dataForm, setDataForm] = useState({
    form: [],
  });

  //SOCKET
  const socketRef = useRef(); //usar

  //2 CAP
  const [textFieldValue, setTextFieldValue] = useState("");
  const [chat, setChat] = useState([]);

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

      connectSocket(dataSave.user, data.consult);
      enviarPrimerMensaje(dataSave.user, data.consult);
      setShowCap(3);
    } catch (error) {
      console.error("Error al subir el formulario:", error);
    }
  };

  const connectSocket = (dataSaveUser, dataConsultForm) => {
    const socket = io.connect("http://localhost:5000", {
      reconnection: true,
    });
    socketRef.current = socket;
    let idRoomLocal = localStorage.getItem("idRoom");

    socket.on("connect", () => {
      console.log("Socket conectado en CHAT");
      let roomName = localStorage.getItem("idRoom");
      let room_name = uuidv4();

      if (roomName && roomName.length > 0) {
        localStorage.removeItem("idRoom");
        localStorage.setItem("idRoom", room_name);
      } else {
        // UUID
        //setRoomNameGlobal(room_name);
        localStorage.setItem("idRoom", room_name);
      }

      //const roomNameLocal = localStorage.getItem("idRoom");
      socket.emit("assign_user_to_room", {
        user: dataSaveUser,
        room_name: idRoomLocal,
        message: dataConsultForm,
      });
    });

    socket.on("error_joining_room", (error) => {
      console.log(error);
    });

    socket.on("error_send_message", (error) => {
      console.log(error);
    });

    socket.on("get_messages", (messages) => {
      setDataChat((prev) => [...prev, messages]);
    });

    //const roomNameLocal = localStorage.getItem("idRoom");
    socket.on("disconnect", () => {
      socket.emit("close_room", {
        room_name: idRoomLocal,
        user: dataSaveUser,
      });

      socket.on("private_room_closed", () => {
        console.log("Sala privada cerrada");
      });
    });
  };

  // Primer mensaje que envia el usuario en el textarea
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

    socketRef.current.on("response_bot", (data) => {
      // setear el setChat
      setChat((prev) => [
        ...prev,
        {
          message: data.message,
          user: data.user,
          room_name: data.room_name,
        },
      ]);
    });
  };

  const enviarMensajeUsuario = (dataSaveUser) => {
    //FUNCION DONDE USA CUANDO EL CLIENTE MANDA ALGUN MENSAJE EN LA CAPA 2
    const idRoomName = localStorage.getItem("idRoom");
    setChat((prev) => [
      ...prev,
      {
        message: textFieldValue, // " todo bien"
        user: dataSaveUser,
        room_name: idRoomName,
      },
    ]);

    socketRef.current.emit("respuesta_de_bot", {
      message: textFieldValue,
      room_name: idRoomName,
    });

    socketRef.current.on("response_bot", (data) => {
      setChat((prev) => [
        ...prev,
        {
          message: data.message,
          user: data.user,
          room_name: data.room_name,
        },
      ]);
    });
  };

  useEffect(() => {
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  console.log("conversacion", chat);

  //console.log("chat", chat);
  /*
  const enviarMensajeUsuario = () => {
    //FUNCION DONDE USA CUANDO EL CLIENTE MANDA ALGUN MENSAJE EN LA CAPA 2
    const roomNameLocalS = localStorage.getItem("idRoom");
    setChat((prev) => [
      ...prev,
      {
        message: textFieldValue, // " todo bien"
        user: "dataSaveUser",
        room_name: roomNameLocalS,
      },
    ]);

    socketRef.current.emit("respuesta_de_bot", {
      message: "mensaje",
      room_name: roomNameLocalS,
    });

    socketRef.current.on("response_bot", (data) => {
      // setear el setChat
      setChat((prev) => [
        ...prev,
        {
          message: data.message,
          user: data.user,
          room_name: data.room_name,
        },
      ]);
      console.log("response_bot", data);
    });
  };



  const handleTabChange = (tab) => {
    setView(tab);
  };

 
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

   const categoriaSeleccionada = category.find(
    (categoria) => categoria.id === categoriaSeleccionadaId
  );
  useEffect(() => {
    if (categoriaSeleccionada) {
      setPreguntasSeleccionadas((prevPreguntas) => [
        ...prevPreguntas,
        ...Object.values(categoriaSeleccionada.respuesta),
      ]);
    }
  }, []);

*/

  const showForm = () => {
    //MOSTRAR FORMULARIO DE ACUERDO AL IDIOMA
    const formTo2CapFind = formTo2Cap.find((form) =>
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
            },
          },
        ],
      };
    });
  };

  const setIdLocalStorageLanguage = () => {
    //SALUDO DEL BOT DE ACUERDO AL IDIOMA - LISTA CATEGORIAS
    localStorage.setItem("idLenguaje", selectLanguage);
    setSelectLanguage(selectLanguage);
    console.log(selectLanguage);
    const responseForLanguage = responseInit.find((response) =>
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
            },
          },
        ],
      };
    });
  };

  const cleanChatBot = () => {
    //removeLanguage
    //setCategoriaSeleccionadaId(null);
    //setPreguntasSeleccionadas([]);
    setChatMensajesFrecuentes({ messages: [] });
    setButtonChatDisable(true);
    setButtonChat(false);
  };

  /*
  const modalExitView = () => {
    setModalExit(!modalExit);
  };*/

  const ChatbotView = () => {
    setButtonChat(true);
    setShowCap(0);
    setModalExit(false);
    setButtonChatDisable(false); //observacion
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
                              <div>
                                {message.message.text}

                                <button
                                  onClick={() => {
                                    setShowCap(2);
                                    showForm();
                                  }}
                                >
                                  Chatear ahora
                                </button>
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
              </ul>
              {modalExit && (
                <div className={styles.container_modal}>
                  <div className={styles.modal}>
                    <div
                      className={styles.modal_button}
                      onClick={() => {
                        cleanChatBot();
                      }}
                    >
                      <span className={styles.text_button_modal}>
                        TERMINAR CHAT
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
                            ENVIAR
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
                            CANCELAR
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
                {chatMensajesFrecuentes.messages.map((message) => (
                  <>
                    {message.message.from === "bot" && (
                      <li
                        className={styles.chatincoming}
                        key={message.message.id}
                      >
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
                        {message.message.text && (
                          <p className={styles.chatoutgoing_response}>
                            {message.message.id === 5 && (
                              <>
                                {message.message.text}
                                <button onClick={() => setShowCap(2)}>
                                  {message.message.text}
                                </button>
                              </>
                            )}
                          </p>
                        )}
                      </ul>
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
                />
                <SendIcon
                  onClick={enviarMensajeUsuario}
                  sx={{ cursor: "pointer" }}
                />
              </div>
              {modalExit && (
                <div className={styles.container_modal}>
                  <div className={styles.modal}>
                    <div
                      className={styles.modal_button}
                      onClick={() => {
                        cleanChatBot();
                      }}
                    >
                      <span className={styles.text_button_modal}>
                        TERMINAR CHAT
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {showCap === 4 && (
            //CHATIA ASESOR
            <>
              <ul className={styles.chatbox}>
                {chatMensajesFrecuentes.messages.map((message) => (
                  <>
                    {message.message.from === "bot" && (
                      <li
                        className={styles.chatincoming}
                        key={message.message.id}
                      >
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
                        {message.message.text && (
                          <p className={styles.chatoutgoing_response}>
                            {message.message.id === 5 && (
                              <>
                                {message.message.text}
                                <button onClick={() => setShowCap(2)}>
                                  {message.message.text}
                                </button>
                              </>
                            )}
                          </p>
                        )}
                      </ul>
                    )}
                  </>
                ))}
              </ul>
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
                    <div
                      className={styles.modal_button}
                      onClick={() => {
                        cleanChatBot();
                      }}
                    >
                      <span className={styles.text_button_modal}>
                        TERMINAR CHAT
                      </span>
                    </div>
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
