import styles from "./auth.module.css";

import { Button, Card, CardContent, Typography } from "@mui/material";
import { ArrowBackIos, Google } from "@mui/icons-material";

import { Link } from "react-router-dom";

function Verify_Email() {

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
        <Link to={"/"}>
          <p className={`${styles.text_link} ${styles.text_color}`}>Login</p>
        </Link>
      </div>

      <h1 className={styles.title_page}>Cuenta verificada ✅</h1>
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
            <Typography
              variant="h6"
              color="text.secondary"
              className={styles.form_description}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
              quos.
            </Typography>

            {/* COMPONENT */}
            <Link to={"/"}>
              <Button
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
                Home
              </Button>
            </Link>
          </form>
          <p className={styles.text_link}>
            <Link to={"/"} className={styles.link}></Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Verify_Email;
