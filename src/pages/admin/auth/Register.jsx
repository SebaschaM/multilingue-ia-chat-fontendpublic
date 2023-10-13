import styles from "./auth.module.css";

import { Button, Input, Card, CardContent, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";

function Register() {
  const { handleRegister } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [inputPassword, setInputPassword] = useState(false);

  const onRegister = async (data) => {
    if (data.email) {
      setInputPassword(true);
    }
    if (data.password) {
      const response = await handleRegister(data);
      console.log(response);
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
      <h1 className={styles.title_page}>Crea tu cuenta</h1>
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
            onSubmit={handleSubmit(onRegister)}
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

            {/* COMPONENT */}
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
            >
              Entrar
            </Button>
          </form>
          <p className={styles.text_link}>
            ¿Ya tienes una cuenta?{" "}
            <Link to={"/"} className={styles.link}>
              {" "}
              Ingresa aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
