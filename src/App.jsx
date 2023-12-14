import { useEffect, useState } from "react";
import { AppRouter } from "./routes/AppRouter.jsx";
import { ContextSocketProvider } from "./store/context.jsx";
import { useNotifications } from "./hooks/useNotifications.jsx";
import  ActiveMaintenance  from "./pages/admin/auth/ActiveMaintenance.jsx";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import styles from "./pages/admin/auth/auth.module.css";
import { format } from 'date-fns';

function App() {
  const { getAllNotificationsActive } = useNotifications();

  const [responseNotifications, setResponseNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onValidateNotifications();
  }, []);

  const onValidateNotifications = async () => {
    try {
      const response = await getAllNotificationsActive();
      console.log(response)
      if (response.success) {
        setResponseNotifications(response.data);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const activeNotification = responseNotifications.find(
    (notification) => notification.state === "active"
  );
  if (activeNotification) {
    const startTimeFormatted = format(new Date(activeNotification.start_time), 'dd/MM/yyyy HH:mm:ss');
    const endTimeFormatted = format(new Date(activeNotification.end_time), 'dd/MM/yyyy HH:mm:ss');
  
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
      </div>
      <h1>Mantenimiento Programado del Sistema</h1>
      <br />

      <h1 className={styles.title_page}>{activeNotification.message} 🤝</h1>
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
              <b>Desde: </b> { startTimeFormatted } <br />
              <b> Hasta: </b>{ endTimeFormatted }
            </Typography>


          </form>
          <p className={styles.text_link}>
          </p>
        </CardContent>
      </Card>
    </div>
    );
  }

  return <AppRouter />;
}

export default App;
