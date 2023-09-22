import styles from "./auth.module.css";

import { Button, Input, Card, CardContent, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { userAtom } from "../../store/store";
import { useAtom } from "jotai";

function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [user, setUserAtom] = useAtom(userAtom);

  const [inputPassword, setInputPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log(user, "valor del atomo global");
    if (user != null) {

      navigate("/home-chat");
    }
  }, [user]);

  const onLogin = async (data) => {
    if (data.email) {
      setInputPassword(true);
    }
    if (data.password) {
      const response = await handleLogin(data);
      if ("error" in response) {
        console.log(response.error);
      } else {
        setUserAtom(response.user);
      }
    }
  };

  return (
    <div className={styles.container}>
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
