import styles from "./auth.module.css";

import {
  Button,
  Input,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar,
  Stack,
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { socketAtom, userAtom } from "../../store/store";
import { useAtom } from "jotai";

function Login() {
  const navigate = useNavigate();
  const { handleLogin, handleVerifyEmail } = useAuth();
  const [user, setUserAtom] = useAtom(userAtom);
  // const [socket] = useAtom(socketAtom);
  // console.log(socket, "valor del atomo global socket")

  const [inputPassword, setInputPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [counterIntent, setCounterIntent] = useState(3);
  const [showCounterIntent, setShowCounterIntent] = useState(false);
  const [dataToast, setDataToast] = useState({
    show: false,
    severity: "",
    message: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log(user, "valor del atomo global");
    if (user != null) {
      // localStorage.setItem("userData", JSON.stringify(user));
      navigate("/home-chat");
    }
  }, [user, navigate]);

  const onLogin = async (data) => {
    if (data.email) {
      setIsLoading(true);
      const response = await handleVerifyEmail(data.email);

      if (response.success) {
        setInputPassword(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setDataToast({
          show: true,
          severity: "error",
          message: response.message,
        });
      }
    }
    if (data.password) {
      const response = await handleLogin(data);
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
        if (counterIntent > 0) {
          setCounterIntent(counterIntent - 1);
        } else {
          setCounterIntent(0);
        }
        setShowCounterIntent(true);
      }
    }
  };

  return (
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
          {counterIntent === 0 ? (
            <>Vuelvelo a intentarlo en 1 hora</>
          ) : (
            <>Te quedan {counterIntent} intentos</>
          )}
        </Alert>
      </Snackbar>

      <Snackbar
        open={counterIntent > 0 && dataToast.show}
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
      <div className={styles.container_button_back}>
        <ArrowBackIos
          sx={{
            fontWeight: "bold",
            width: "2rem",
          }}
        />
        <Link to={"/home"}>
          <p className={`${styles.text_link} ${styles.text_color}`}>Home</p>
        </Link>
      </div>
      <h1 className={styles.title_page}>Iniciar sesión</h1>
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
            <Input
              placeholder="email@example.com"
              type="email"
              {...register("email", { required: true })}
              error={errors.email}
              helpertext={errors.email && "email requerido"}
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
            {inputPassword && (
              <Input
                placeholder="**********"
                {...register("password", { required: true })}
                type="password"
                error={errors.password}
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
            )}
            {!isLoading ? (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "#17C3CE",
                  marginTop: "1.8rem",
                  padding: "0.8rem 1.8rem",
                  width: "auto",
                  "&:hover": {
                    background: "#19B8C3",
                  },
                }}
                onClick={onLogin}
              >
                Entrar
              </Button>
            ) : (
              <CircularProgress />
            )}
          </form>
          <p className={styles.text_link}>
            ¿No tienes cuenta?{" "}
            <Link to={"/register"} className={styles.link}>
              {" "}
              Registrate aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
