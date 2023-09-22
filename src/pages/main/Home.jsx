import React from "react";
import styles from "./Home.module.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="">
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

      <h1 className={styles.title_page}>TRANSLATE COMMUNICATION</h1>

      <div className={styles.content_page}>
        <p>Nihil repellendus nesciunt ut autem numquam.</p>
        <p>Repellat debitis aut esse cum debitis a mollitia non.</p>

        <Link to={"/"}>
          <Button>Iniciar sesión</Button>
        </Link>
        {/*
        <Link to={"/register"}>
          <Button>
            Registrarse
          </Button>
  </Link>*/}
      </div>
      <img
        src="https://res.cloudinary.com/dmq5kmzij/image/upload/v1695003999/LANDING.png"
        alt="landing"
        className={styles.landing_img}
      />
    </div>
  );
}

export default Home;
