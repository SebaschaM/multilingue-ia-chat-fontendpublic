import { useEffect, useState } from "react";
import { AppRouter } from "./routes/AppRouter.jsx";
import { ContextSocketProvider } from "./store/context.jsx";
import { useNotifications } from "./hooks/useNotifications.jsx";

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
    return (
      <div>
        El sistema está en mantenimiento: Desde {activeNotification.start_time}{" "}
        hasta {activeNotification.end_time}, el motivo es{" "}
        {activeNotification.message}
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
