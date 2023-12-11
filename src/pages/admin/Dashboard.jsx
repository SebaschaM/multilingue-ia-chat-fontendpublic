import { BsCheckAll, BsClock, BsPerson } from "react-icons/bs";

import { LayoutDashboard, LayoutDashboardContent } from "../../layout";

import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import {
  Cell,
  Pie,
  PieChart,
  Tooltip,
  Bar,
  BarChart,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "../../hooks/useDashboard";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const data = [
  { name: "Grupo A", value: 400 },
  { name: "Grupo B", value: 300 },
  { name: "Grupo C", value: 300 },
  { name: "Grupo D", value: 200 },
];
const barChartDataRequestsMock = [
  { month: "Enero", requests: 50 },
  { month: "Febrero", requests: 75 },
  { month: "Marzo", requests: 60 },
  // Agrega más datos según sea necesario
];
const pieChartDataMock = [
  { role: "Admin", percentage: 25 },
  { role: "User", percentage: 50 },
  { role: "Guest", percentage: 25 },
  // Agrega más datos según sea necesario
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const {
    handleGetRequestsForMonth,
    handleGetCountClientsByMonth,
    getTotalAttendedChats,
    getPercentageOfUsersByRole,
    getCountChatsByHour,
    getTotalOfUsers,
  } = useDashboard();
  const [barChartDataRequests, setBarChartDataRequests] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartDataClients, setBarChartDataClients] = useState([]);
  const [totalAttendedChats, setTotalAttendedChats] = useState(0);
  const [lastHourChats, setLastHourChats] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const inactivityTimeout = 300000; // 5 MINUTOS DE INACTIVIDAD
  let activityTimer;

  const resetTimer = () => {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      localStorage.removeItem("userData");
      handleLogout();
      navigate("/admin/auth");
    }, inactivityTimeout);
  };

  useEffect(() => {
    const handleMouseMove = () => resetTimer();
    const handleKeyPress = () => resetTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keypress", handleKeyPress);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(activityTimer); 
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleGetRequestsForMonth();
        if (response.data && response.data.length > 0) {
          setBarChartDataRequests(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleGetCountClientsByMonth();
        if (response.data && response.data.length > 0) {
          setBarChartDataClients(response.data);
        }
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTotalAttendedChats();
        console.log(response.data);
        if (response.data && response.data.length > 0) {
          setTotalAttendedChats(response.data[0].total_chats_atendidos);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPercentageOfUsersByRole();
        console.log(response.data);

        if (response.data && response.data.length > 0) {
          const entry = response.data[0];

          // Convertir porcentajes
          const dataWithPercentage = Object.entries(entry).map(
            ([key, value]) => ({
              name: key,
              percentage: value,
            })
          );

          setPieChartData(dataWithPercentage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCountChatsByHour();

        if (response.data && response.data.length > 0) {
          const lastValue = response.data[response.data.length - 1].num_chats;

          setLastHourChats(lastValue);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTotalOfUsers();
        setTotalUsers(response.data.total_users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <LayoutDashboard title="Exe Digital">
      <LayoutDashboardContent title="Dashboard">
        <Grid container spacing={3}>
          <Grid item xs={7} sm={7} md={4}>
            <Card>
              <CardActionArea
                sx={{
                  py: 5,
                  boxShadow: 0,
                  textAlign: "center",
                  bgcolor: "#d1e9fc",
                  color: "#53699e",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    background: "rgba(255, 255, 255, 0.15)",
                    width: "fit-content",
                    margin: "0 auto",
                    borderRadius: "50%",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <BsPerson size={40} color="#04297a" />
                </Box>

                <Typography variant="h3" color={"#04297a"}>
                  {totalUsers}
                </Typography>

                <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                  Usuarios conectados
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={7} sm={7} md={4}>
            <Card>
              <CardActionArea
                sx={{
                  py: 5,
                  boxShadow: 0,
                  textAlign: "center",
                  bgcolor: "#fff7cd",
                  color: "#fff7cd",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    background: "rgba(255, 255, 255, 0.15)",
                    width: "fit-content",
                    margin: "0 auto",
                    borderRadius: "50%",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <BsCheckAll size={40} color="#b78103" />
                </Box>

                <Typography variant="h3" color={"#7a4f01"}>
                  {totalAttendedChats}
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{ opacity: 0.72 }}
                  color="#b4995a"
                >
                  Total de chats atendidos
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={7} sm={7} md={4}>
            <Card>
              <CardActionArea
                sx={{
                  py: 5,
                  boxShadow: 0,
                  textAlign: "center",
                  bgcolor: "#ffe7d9",
                  color: "white",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    background: "rgba(255, 255, 255, 0.15)",
                    width: "fit-content",
                    margin: "0 auto",
                    borderRadius: "50%",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <BsClock size={40} color="#b72136" />
                </Box>

                <Typography variant="h3" color={"#7a0c2e"}>
                  {lastHourChats}
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{ opacity: 0.72 }}
                  color="#b36977"
                >
                  Chats en la ultima hora
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        <div className={styles.content_header_cards}>
          <div className={styles.card_header}>
            {/* <h2>Conversaciones</h2> */}
            <div className={styles.card_header_content}>
              <div className={styles.card_data}>
                <h2>Conversaciones con agentes</h2>
                <div className={styles.card_data_header}>
                  <p>10</p>
                </div>
                <h3>Conversaciones en curso</h3>
              </div>
              <div className={styles.card_data}>
                <h2>Respuesta del agente</h2>
                <div className={styles.card_data_header}>
                  <p>205</p>
                </div>
                <h3>Tiempo promedio de primera respuesta</h3>
              </div>
              <div className={styles.card_data}>
                <h2>Atencion</h2>
                <div className={styles.card_data_header}>
                  <p>3</p>
                </div>
                <h3>Duración promedio de atención</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Graficos */}

        {/* Gráfico de Barras */}

        <Grid container spacing={3}>
          <Grid item xs={6} sm={7} md={4}>
            {/* Gráfico de barras para handleGetRequestsForMonth */}
            <Card>
              <Typography variant="h6" align="center" gutterBottom>
                Número de solicitudes por mes
              </Typography>
              <CardActionArea
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <BarChart width={400} height={400} data={barChartDataRequests}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Bar dataKey="num_solicitudes" fill="#8884d8" />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Gráfico 2 */}

          <Grid item xs={6} sm={7} md={4}>
            <Card>
              <Typography variant="h6" align="center" gutterBottom>
                Clientes registrados por mes
              </Typography>
              <CardActionArea
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <BarChart width={500} height={400} data={barChartDataClients}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Bar dataKey="clients_registrados" fill="#8884d8" />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Gráfico circular (pie chart) para getPercentageOfUsersByRole */}

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <Typography variant="h6" align="center" gutterBottom>
                Porcentaje de usuarios
              </Typography>
              <CardActionArea
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={800} height={400}>
                  <Pie
                    data={pieChartData}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </LayoutDashboardContent>
    </LayoutDashboard>
  );
};

export default Dashboard;
