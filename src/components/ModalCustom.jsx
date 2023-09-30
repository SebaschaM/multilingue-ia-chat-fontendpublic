import { Box, Modal, TextField, Typography } from "@mui/material";
import React from "react";

const ModalCustom = ({ openModal, setOpenModal }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    maxWidth: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign={"center"}
        >
          Aqui puede ir el titulo del formulario
        </Typography>
        <form>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </form>
      </Box>
    </Modal>
  );
};

export default ModalCustom;
