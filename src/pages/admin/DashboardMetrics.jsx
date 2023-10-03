import { BsCheckAll, BsClock, BsPerson } from "react-icons/bs";

import { LayoutDashboard, LayoutDashboardContent } from "../../layout";
import styles from "./Dashboard.module.css";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { ModalCustom } from "../../components";

const DashboardMetrics = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <LayoutDashboard title="Overall Holding">
      <LayoutDashboardContent title="Metricas del agente">
        <div className={styles.content_header_cards}>
          <div className={styles.card_header}>
            <h2>Conversaciones</h2>
            <div className={styles.card_header_content}>
              <div className={styles.card_data}>
                <div className={styles.card_data_header}>
                  <BsPerson size={25} />
                  <h3>Usuarios conectados</h3>
                </div>
                <p>10</p>
              </div>
              <div className={styles.card_data}>
                <div className={styles.card_data_header}>
                  <BsCheckAll size={25} />
                  <h3>Total de chats atendidos</h3>
                </div>
                <p>205</p>
              </div>
              <div className={styles.card_data}>
                <div className={styles.card_data_header}>
                  <BsClock size={25} />
                  <h3>Chats en la ultima hora</h3>
                </div>
                <p>3</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outlined" onClick={() => setOpenModal(true)}>
          Abrir modal
        </Button>

        <ModalCustom openModal={openModal} setOpenModal={setOpenModal} />
      </LayoutDashboardContent>
    </LayoutDashboard>
  );
};

export default DashboardMetrics;
