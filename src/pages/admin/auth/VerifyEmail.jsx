import styles from "./auth.module.css";

import { Button, Input, Card, CardContent, Typography } from "@mui/material";
import { ArrowBackIos, Google } from "@mui/icons-material";
import { useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

function VerifyEmail() {
  const {handleVerifyEmail} = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [getToken, setGetToken] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (token) {
          setGetToken(token)
          console.log("Token recibido:", token);
          // Lógica de verificación aquí...
          const response = await handleVerifyEmail(getToken);
          console.log(response); // Esto imprimirá el resultado de la verificación
        } else {
          return <h1> Error </h1>
        }
      } catch (error) {
        console.error("Error al verificar el correo:", error);
      }
    };

    verifyEmail();
  }, [token, handleVerifyEmail]);

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
        <Link to={"/admin/auth"}>
          <p className={`${styles.text_link} ${styles.text_color}`}>Login</p>
        </Link>
      </div>
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
          <form className={styles.container_form}>
            <h2>Cuenta verificada 😊</h2>
            <Typography
              variant="h6"
              color="text.secondary"
              className={styles.form_description}
            >
              Tu cuenta ha sido activada correctamente.
            </Typography>
            {/* <Input
              placeholder="email@example.com"
              type="text"
              sx={{
                marginTop: "1rem",
                height: "2.1rem",
                borderColor: "#17C3CE",
                width: "80%",
                ":after": {
                  borderBottom: "3px solid #17C3CE",
                },
              }}
            /> */}
            {/* COMPONENT */}
            {/* <Button
              variant="contained"
              sx={{
                display: "flex",
                columnGap: "0.8rem",
                background: "#17C3CE",
                marginTop: "1.4rem",
                padding: "0.8rem 1.8rem",
                width: "auto",
                "&:hover": {
                  background: "#19B8C3",
                },
              }}
            >
              <Google
                sx={{
                  width: "1.5rem",
                }}
              />
              Abir Gmail
            </Button> */}
            <h1>✅✅✅✅</h1>
          </form>
          {/* <p className={styles.text_link}>
            <Link to={"/verify-email"} className={styles.link}>
              Reenviar correo electrónico
            </Link>
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmail;
