import { BsCheckAll, BsClock, BsPerson } from "react-icons/bs";

import { LayoutDashboard, LayoutDashboardContent } from "../../layout";

import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { useState } from "react";
import styles from "./Dashboard.module.css";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

const data = [
  { name: "Grupo A", value: 400 },
  { name: "Grupo B", value: 300 },
  { name: "Grupo C", value: 300 },
  { name: "Grupo D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <LayoutDashboard title="Exe Digital">
      <LayoutDashboardContent title="Dashboard">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
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
                  50
                </Typography>

                <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                  Usuarios conectados
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardActionArea
                sx={{
                  py: 5,
                  boxShadow: 0,
                  textAlign: "center",
                  bgcolor: "#d0f2ff",
                  color: "#04297a",
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
                  <BsClock size={40} color="#0c53b7" />
                </Box>

                <Typography variant="h3" color={"#04297a"}>
                  3
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{ opacity: 0.72 }}
                  color="#3d619f"
                >
                  Chats en la ultima hora
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                  205
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
          <Grid item xs={12} sm={6} md={3}>
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
                  3
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

        {/* <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          sx={{
            color: "#ffffff",
          }}
        >
          Abrir modal
        </Button>

        <ModalCustom openModal={openModal} setOpenModal={setOpenModal}>
          <h1>Contenido del modal</h1>
        </ModalCustom> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={800} height={400}>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
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
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={800} height={400}>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
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
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={800} height={400}>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
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
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={800} height={400}>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
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
