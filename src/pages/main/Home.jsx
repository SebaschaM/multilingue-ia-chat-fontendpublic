import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styles from "./Home.module.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";

import { category, responseInit, formTo2Cap } from "../../utils/dataChatbot";
import { useChatClient } from "../../hooks/useChatClient.JSX";

function Home() {
  const socketRef = useRef();
  const [activePage, setActivePage] = useState(1);
  const [buttonChat, setButtonChat] = useState(false);
  const [buttonChatDisable, setButtonChatDisable] = useState(true);
  const [selectLanguage, setSelectLanguage] = useState(2);
  const [view, setView] = useState("language");
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState(null);
  const [, setPreguntasSeleccionadas] = useState([]);
  const [chatMensajesFrecuentes, setChatMensajesFrecuentes] = useState({
    messages: [],
  });
  const [modalExit, setModalExit] = useState(false);
  const [showCap, setShowCap] = useState(0);
  const [dataForm, setDataForm] = useState({
    form: [],
  });
  const [dataSaveUser, setDataSaveUser] = useState({});
  const { handleRegisterUserChat } = useChatClient(); //HOOK PARA REGISTRO EN FORMULARIO
  const { register, handleSubmit, setValue } = useForm();
  const room_name = uuidv4();

  const onSubmit = async (data) => {
    try {
      const languageIdLocalStorage = localStorage.getItem("idLenguaje");
      const dataRegister = {
        email: data.email,
        fullname: data.fullname,
        cellphone: data.cellphone,
        //consult: data.consult,
        language_id: languageIdLocalStorage,
      };
      const dataSave = await handleRegisterUserChat(dataRegister);
      //console.log(dataSave.user);
      setDataSaveUser(dataSave);
      setShowCap(3);
      connectSocket();
    } catch (error) {
      console.error("Error al subir el formulario:", error);
    }
  };

  const connectSocket = () => {
    const socket = io.connect("http://localhost:5000", { reconnection: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket conectado en CHAT");
      //const roomName = "asd"; // DEBE SER ALEATORIO room_name

      // Obtener el valor actual desde localStorage
      const roomName = localStorage.getItem("idRoom");

      // Verificar si hay un valor y si tiene una longitud mayor a 1
      if (roomName && roomName.length > 0) {
        localStorage.setItem("idRoom", room_name);
      } else {
        // Si no hay un valor o tiene longitud 0 o 1, generarlo y almacenarlo en localStorage
        const newRoomName = room_name;
        localStorage.setItem("idRoom", newRoomName);
        console.log(
          "Nuevo ID generado y almacenado en localStorage:",
          newRoomName
        );
      }

      socket.emit("assign_user_to_room", {
        room_name: roomName,
        user: dataSaveUser,
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

    socket.on("disconnect", () => {
      socket.emit("close_room", {
        room_name: "cuartito2",
        user: userData,
      });

      socket.on("private_room_closed", () => {
        console.log("Sala privada cerrada");
      });
    });
  };

  const modalExitView = () => {
    setModalExit(!modalExit);
  };

  const removeLanguage = () => {
    localStorage.removeItem("idLenguaje");
    //setSelectLanguage(null);
    setView("language");
    setCategoriaSeleccionadaId(null);
    setPreguntasSeleccionadas([]);
    setChatMensajesFrecuentes({ messages: [] });
    setShowCap(0);
  };

  const setIdLocalStorageLanguage = () => {
    //SALUDO DEL BOT DE ACUERDO AL IDIOMA - LISTA CATEGORIAS
    localStorage.setItem("idLenguaje", selectLanguage);
    setSelectLanguage(selectLanguage);

    const responseForLanguage = responseInit.find((response) =>
      response.respuesta.hasOwnProperty(selectLanguage)
    );
    console.log(responseForLanguage);

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

  const showForm = () => {
    //MOSTRAR FORMULARIO
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

  const categoriaSeleccionada = category.find(
    (categoria) => categoria.id === categoriaSeleccionadaId
  );

  const ChatbotView = () => {
    setButtonChat(!buttonChat);
    setButtonChatDisable(false);
  };

  const handleTabChange = (tab) => {
    setView(tab);
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
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      setPreguntasSeleccionadas((prevPreguntas) => [
        ...prevPreguntas,
        ...Object.values(categoriaSeleccionada.respuesta),
      ]);
    }
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
              modalExitView();
            }}
          />
        )}
      </section>
      <section className={activePage === 2 ? styles.active : ""}>
        <img
          className={styles.fondo2}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698346151/exe%20digital/hy7fpughyyqvflxmzz96.jpg"
          alt="fondo2"
        />

        <img
          className={styles.branding}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348441/exe%20digital/tudykqggm5nqfqgsuttr.png"
          alt="branding"
        />
        <img
          className={styles.campañas}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348443/exe%20digital/nwetcptylam5itcmovo9.png"
          alt="campañas"
        />
        <img
          className={styles.sistemas}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348444/exe%20digital/srfs6r308v98wgac61dl.png"
          alt="sistemas"
        />
        <img
          className={styles.ecommerce}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348450/exe%20digital/vuyxw4qbly9hxylzzyv4.png"
          alt="ecommerce"
        />
        <img
          className={styles.produccion}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348448/exe%20digital/zuwklkiockl9qr63leyj.png"
          alt="produccion"
        />
        <img
          className={styles.sitioweb}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348447/exe%20digital/w4canhfdj0bwvmjneugj.png"
          alt="sitioweb"
        />
        <img
          className={styles.social}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348446/exe%20digital/l6hvnfktlfjh2e2faxpd.png"
          alt="social"
        />
        <p className={styles.text1}>LO QUE</p>
        <p className={styles.text2}>HACEMOS</p>
        <p className={styles.text3}>PERÚ • ECUADOR • MÉXICO</p>
      </section>
      <section className={activePage === 3 ? styles.active : ""}>
        <img
          className={styles.fondo2}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698346151/exe%20digital/hy7fpughyyqvflxmzz96.jpg"
          alt="fondo2"
        />
        <img
          className={styles.farmacia}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382655/exe%20digital/wwlwcemxdvjwhlvjpz8q.png"
          alt="farmacia"
        />
        <img
          className={styles.kativa}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382660/exe%20digital/hv7rg0ko2iamyyzimvfs.png"
          alt="kativa"
        />
        <img
          className={styles.ucv}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382663/exe%20digital/pb5cuelsqa4z73ozgnt2.png"
          alt="ucv"
        />
        <img
          className={styles.ekono}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382721/exe%20digital/gk8imgmtblvqy799fooz.png"
          alt="ekono"
        />
        <img
          className={styles.olva}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698393748/exe%20digital/avmmttjhg69xxjujmps7.png"
          alt="olva"
        />
        <img
          className={styles.universidad}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382669/exe%20digital/kdyglsrb0ciihg652oga.png"
          alt="universidad"
        />
        <img
          className={styles.fos}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382671/exe%20digital/gwgnmrhpcfq38axmjrtz.png"
          alt="fos"
        />
        <img
          className={styles.bengala}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382673/exe%20digital/b6o6zksnlvpvhleigfzk.png"
          alt="bengala"
        />
        <img
          className={styles.opcion}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382675/exe%20digital/tk0dcc0m6l1vbqgczz0l.png"
          alt="opcion"
        />
        <img
          className={styles.b}
          src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382677/exe%20digital/yuzxkf0w5fpjnadpfd2r.png"
          alt="b"
        />
        <p className={styles.text5}>MARCAS QUE</p>
        <p className={styles.text6}>CONFÍAN EN NOSOTROS</p>
        <p className={styles.text4}>PERÚ • ECUADOR • MÉXICO</p>
      </section>

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
                    defaultValue={selectLanguage}
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
                    setModalExit(false);
                    setShowCap(1);
                  }}
                >
                  <p>GUARDAR CONFIGURACIÓN</p>
                </div>

                <div
                  className={styles.guardar}
                  onClick={() => {
                    ChatbotView();
                    removeLanguage();
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
                        {message.message.text ? (
                          <p className={styles.chatoutgoing_response}>
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
                  </>
                ))}

                <div className={styles.footer_area}>
                  <img
                    className={styles.barras}
                    src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699070715/exe%20digital/fyczge5dyxnvxsbz6xyb.png"
                    onClick={() => {
                      modalExitView();
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
                        ChatbotView();
                        removeLanguage();
                        setButtonChatDisable(true);
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
                          //{...register("consult")}
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
            <>CHAT IA CAP2 </>
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
                    modalExitView();
                  }}
                />
              </div>
              {modalExit && (
                <div className={styles.container_modal}>
                  <div className={styles.modal}>
                    <div
                      className={styles.modal_button}
                      onClick={() => {
                        ChatbotView();
                        removeLanguage();
                        setButtonChatDisable(true);
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
