import styles from "./auth.module.css";

import {
  Button,
  Input,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { socketAtom, userAtom } from "../../../store/store";
import { useAtom } from "jotai";

function Login() {
  const navigate = useNavigate();

  /*  Estados   */
  const [showCounterIntent, setShowCounterIntent] = useState(false);
  const [counterIntent, setCounterIntent] = useState();
  const [inputPassword, setInputPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typeBottom, setTypeBottom] = useState("onClick");
  const [dataVerifyMaintenance, setDatatVerifyMaintenance] = useState({
    id: "",
    message_notification: "",
    date_start: "",
    date_end: "",
    status: "",
  });
  const [dataToast, setDataToast] = useState({
    show: false,
    severity: "",
    message: "",
  });
  const [dataIntent, setDataIntent] = useState({
    intents: "",
    message: "",
  });
  /*  Estados para el formulario   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({});

  /*  Hooks   */
  const {
    handleLogin,
    handleCheckEmailExists,
    user,
    setUserAtom,
    handleVerifyMaintenance,
  } = useAuth();

  /*  useEffects   */
  useEffect(() => {
    if (user != null) {
      navigate("/admin/dashboard");
    }
    if (user) {
      if (user.role.id == 1) {
        navigate("/admin/dashboard");
      }

      if (user.role.id == 2) {
        navigate("/admin/dashboard/chats");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    onValidateMaintenance();
  }, []);

  /*  Función que valida si el sistema está en mantenimiento   */
  const onValidateMaintenance = async () => {
    const response = await handleVerifyMaintenance();
    if (response) {
      setDatatVerifyMaintenance(response);
      return response;
    } else {
      setDataToast({
        show: true,
        severity: "error",
        message: response,
      });
    }
  };

  if (dataVerifyMaintenance.status === "active") {
    return (
      <div>
        {" "}
        El sistema está en mantenimiento: Desde{" "}
        {dataVerifyMaintenance.date_start} hasta{" "}
        {dataVerifyMaintenance.date_end}, el motivo es{" "}
        {dataVerifyMaintenance.message_notification}{" "}
      </div>
    );
  }

  /*  Función de login, valida si el email existe y luego valida la cuenta, cuando valida la cuenta aplica el contador de intentos   */
  const onLogin = async () => {
    const email = getValues("email");
    const password = getValues("password");

    if (email && !inputPassword) {
      await onCheckEmailExists(email);
    }

    if (password && inputPassword) {
      const response = await handleLogin({
        email: getValues("email"),
        password: getValues("password"),
      });

      if (response.success) {
        setDataToast({
          show: true,
          severity: "success",
          message: response.message,
        });
        setUserAtom(response.user);
      } else {
        setDataToast({
          show: true,
          severity: "error",
          message: response.error,
        });
        validateCounter(response.intents, response.error);
      }
    }
  };

  const validateCounter = async (counterIntent, messageError) => {
    setDataIntent({
      intents: counterIntent,
      message: messageError,
    });
    if (dataIntent.intents > 0) {
      setShowCounterIntent(true);
    } else {
      setCounterIntent(0);
      setShowCounterIntent(true);
    }
    return;
  };

  /* Función para validar si el correo existe  */
  const onCheckEmailExists = async (email) => {
    if (email) {
      setIsLoading(true);
      const response = await handleCheckEmailExists(email);

      if (response.success) {
        setInputPassword(true);
        setIsLoading(false);
        setTypeBottom("onSubmit");
        return true;
      } else {
        setIsLoading(false);
        setDataToast({
          show: true,
          severity: "error",
          message: response.message,
        });
        return false;
      }
    } else {
      setDataToast({
        show: true,
        severity: "error",
        message: "El email es requerido",
      });
    }
    return false;
  };

  /*  Aquí es donde el usuario presiona el editar en caso quiera ingresar con otro correo, esto cambiar por que está mal   */
  const onEdit = () => {
    setTypeBottom("onClick");
    setInputPassword(false);
  };

  return (
    /*  REFACTORIZAR 1 */
    <div className={styles.container}>
      <Snackbar
        open={showCounterIntent}
        autoHideDuration={3000}
        onClose={() => setShowCounterIntent(false)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={() => setShowCounterIntent(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {dataIntent.intents > 0 ? (
            <> Te quedan {dataIntent.intents} intentos </>
          ) : (
            <> {dataIntent.message} </>
          )}
        </Alert>
      </Snackbar>

      {/*Este código es para validar la respuesta del backend */}
      <Snackbar
        open={dataIntent.intents >= 0 && dataIntent.message}
        autoHideDuration={3000}
        onClose={() =>
          setDataToast({
            show: false,
            severity: "",
            message: "",
          })
        }
      >
        <Alert
          onClose={() =>
            setDataToast({
              show: false,
              severity: "",
              message: "",
            })
          }
          severity={dataToast.severity}
          sx={{ width: "100%" }}
        >
          {dataToast.message}
        </Alert>
      </Snackbar>

      <img
        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/v1694734856/Otros/Vector_right_qtg8j1.png"
        alt="vector_right"
        className={styles.vector_img_right}
      />
      <img
        src="https://res.cloudinary.com/dvzjgzqbn/image/upload/v1694734856/Otros/Vector_left_qym4aq.png"
        alt="vector_right"
        className={styles.vector_img_left}
      />
      {/* Estilos de la página, más no del card del login*/}
      <div className={styles.container_button_back}>
        <ArrowBackIos
          sx={{
            fontWeight: "bold",
            width: "2rem",
          }}
        />
        <Link to={"/"}>
          <p className={`${styles.text_link} ${styles.text_color}`}>Home</p>
        </Link>
      </div>
      <h1 className={styles.title_page}>Iniciar sesión</h1>

      {/* Declaración de una card*/}
      <Card
        sx={{
          minWidth: "30rem",
          width: "40rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Contenido de una card*/}
        <CardContent>
          <form
            onSubmit={handleSubmit(onLogin)}
            className={styles.container_form}
          >
            <h2>Bienvenido 👋</h2>
            <Typography
              variant="h6"
              color="text.secondary"
              className={styles.form_description}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
              quos.
            </Typography>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                justifyContent: "center",
              }}
            >
              <Input
                placeholder="email@example.com"
                disabled={inputPassword}
                type="email"
                error={errors.email ? true : false}
                {...register("email", {
                  required: { value: true, message: "Campo requerido" },
                  validate: (value) => {
                    const regex =
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
                    return regex.test(value) || "Email invalido";
                  },
                })}
                sx={{
                  marginTop: "1rem",
                  height: "2.1rem",
                  borderColor: "#17C3CE",
                  width: "80%",
                  ":after": {
                    borderBottom: "3px solid #17C3CE",
                  },
                }}
              />
              {errors.email && (
                <Typography
                  color="red"
                  sx={{ width: "80%" }}
                  textAlign={"left"}
                >
                  {errors.email.message}
                </Typography>
              )}

              {inputPassword && (
                <>
                  <Button
                    style={{ height: "2.1rem" }}
                    variant="contained"
                    color="primary"
                    sise="small"
                    text="Editar"
                    sx={{
                      textTransform: "capitalize",
                      position: "absolute",
                      right: "-1.5rem",
                      bottom: "0",
                      color: "#FFF",
                    }}
                    onClick={onEdit}
                  >
                    Editar
                  </Button>
                </>
              )}
            </div>

            {inputPassword && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Input
                  placeholder="**********"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "La contraseña es requerida",
                    },
                  })}
                  type="password"
                  error={errors.password}
                  // onInput={() => countValidations(getValues("password"))}
                  helpertext={errors.password && "Contraseña requerida"}
                  sx={{
                    marginTop: "1rem",
                    height: "2.1rem",
                    borderColor: "#17C3CE",
                    width: "80%",
                    ":after": {
                      borderBottom: "3px solid #17C3CE",
                    },
                  }}
                />
                {errors.password && (
                  <Typography
                    color="red"
                    sx={{ width: "80%" }}
                    textAlign={"left"}
                  >
                    {errors.password.message}
                  </Typography>
                )}
              </div>
            )}

            {!isLoading ? (
              <Button
                type={typeBottom}
                variant="contained"
                sx={{
                  marginTop: "1.8rem",
                  padding: "0.8rem 1.8rem",
                  width: "auto",
                  color: "#FFF",
                  "&:hover": {
                    background: "#19B8C3",
                  },
                }}
              >
                Entrar
              </Button>
            ) : (
              <CircularProgress />
            )}
          </form>

          {/* Botón para registrarse*/}
          {/* <p className={styles.text_link}>
            ¿No tienes cuenta?
            <Link to={"/register"} className={styles.link}>
              {" "}
              Registrate aquí
            </Link>
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
