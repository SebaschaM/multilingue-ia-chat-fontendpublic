import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { category, responseInit } from "../../utils/dataChatbot";
import { Button } from "@mui/material";

function Home() {
  const [activePage, setActivePage] = useState(1);
  const [buttonChat, setButtonChat] = useState(false);
  const [buttonChatDisable, setButtonChatDisable] = useState(true);
  const [selectLanguage, setSelectLanguage] = useState();
  const [view, setView] = useState("language");
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState(null);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);
  const [chatMensajesFrecuentes, setChatMensajesFrecuentes] = useState({
    messages: [],
  });

  const [modalExit, setModalExit] = useState(false);

  const modalExitView = () => {
    setModalExit(!modalExit);
  };

  const removeLanguage = () => {
    localStorage.removeItem("idLenguaje");
    setSelectLanguage(null);
    setView("language");
    setCategoriaSeleccionadaId(null);
    setPreguntasSeleccionadas([]);
    setChatMensajesFrecuentes({ messages: [] });
  };

  //SIRVE PARA MOSTRAR LA RESPUESTA A LA CATEGORUA SELECCIONADA
  const showQuestions = (id) => {
    setCategoriaSeleccionadaId(id);
    const categoryFind = category.find((categoria) => categoria.id === id);

    const responseForConsult = category.find((response) =>
      response.categoria.hasOwnProperty(selectLanguage)
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
              text: categoryFind.categoria[selectLanguage],
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
              text: responseForConsult.respuesta[selectLanguage] || null,
              opciones: [categoryFind.respuesta[selectLanguage]],
            },
          },
        ],
      };
    });
  };

  //console.log(chatMensajesFrecuentes);

  const setIdLocalStorageLanguage = () => {
    localStorage.setItem("idLenguaje", selectLanguage);
    setSelectLanguage(selectLanguage);

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
    handleTabChange("main");
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
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      setPreguntasSeleccionadas((prevPreguntas) => [
        ...prevPreguntas,
        ...Object.values(categoriaSeleccionada.respuesta),
      ]);
    }
  }, [categoriaSeleccionada]);

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

          {view === "language" ? (
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

              <div
                className={styles.guardar}
                onClick={() => {
                  setIdLocalStorageLanguage();
                  setModalExit(false);
                }}
              >
                <p>GUARDAR CONFIGURACIÓN</p>
              </div>
            </ul>
          ) : (
            // Chat de mensajes frecuentes
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
                            {message.message.text}
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
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        ChatbotView();
                        removeLanguage();
                        setButtonChatDisable(true);
                      }}
                    >
                      SALIR
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
