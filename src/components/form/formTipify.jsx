import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { formatearFecha } from "../../utils/formatDate";

import { handleRequestManagment } from "../../hooks/useRequestManagment";

const schema = yup.object().shape({
  reason: yup.string().required("Motivo de contacto es requerido"),
  date_attention: yup
    .date()
    .required("Fecha de Re-Contacto es requerida")
    .min(new Date(), "La fecha debe ser mayor a la actual"),
  destination_area: yup.string().required("Área de destino es requerida"),
});

const FormTipify = ({
  onUserSelected,
  onUserTyping,
  openModal,
  onSelectedOption,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log(onSelectedOption, "onSelectedOption");

    if (onSelectedOption) {
      console.log(onSelectedOption, "onSelectedOption");
    }
  }, []);

  const [userSelected, setUserSelected] = useState({});
  const [userTyping, setUserTyping] = useState({});
  const { handleCreateRequest } = handleRequestManagment();
  const [getDate, setDate] = useState(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  });
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    setDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    mappedUserTyping();
    mappedUserSelected();
  }, []);

  const mappedUserTyping = () => {
    setUserTyping(onUserTyping.user);
  };

  const mappedUserSelected = () => {
    setUserSelected(onUserSelected.client_conversation);
  };

  const onSubmit = async (data) => {
    // console.log(onUserSelected.id, "onUserSelected");
    // console.log(onUserSelected.id, "onUserSelected ID")
    // console.log(onUserTyping, "onUserTyping");

    const dataToSend = {
      client_id: onUserSelected.id,
      user_id: 1,
      reason: data.reason,
      date_attention: formatearFecha(data.date_attention),
      destination_area: data.destination_area,
      request_type_id: 2,
    };
    // console.log(dataToSend, "dataToSend");
    setIsLoadingRequest(true);
    const response = await handleCreateRequest(dataToSend);
    setIsLoadingRequest(false);
    console.log(response, "response");
    openModal(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "2rem",
        }}
      >
        <Box>
          <TextField
            fullWidth
            id="outlined-password-input"
            label="Nombre de cliente"
            type="text"
            value={userSelected.fullname}
            disabled={true}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            id="outlined-password-input"
            label="Email de cliente"
            type="email"
            disabled={true}
            value={userSelected.email}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            id="outlined-password-input"
            label="Email de usuario"
            type="email"
            value={userTyping.email}
            disabled={true}
          />
        </Box>

        {/* Hacer mas grande esta caja de tipificación */}
        <Box>
          <TextField
            fullWidth
            id="outlined-password-input"
            label="Motivo de Contacto"
            type="text"
            {...register("reason", { required: true, maxLength: 500 })}
          />
          {errors.reason && (
            <Typography color="red">{errors.reason.message}</Typography>
          )}
          {/* A las validaciones le pongo el yup para que muestre el mensaje de error! */}
        </Box>
        <Box>
          <TextField
            fullWidth
            id="outlined-password-input"
            label="Fecha de Re-Contacto"
            type="date"
            defaultValue={getDate}
            display={onSelectedOption === "tipificar" ? "none" : "block"}
            {...register("date_attention", { required: true, maxLength: 50 })}
          />
          {errors.date_attention && (
            <Typography color="red">{errors.date_attention.message}</Typography>
          )}
        </Box>

        <Box>
          <TextField
            fullWidth
            id="outlined-password-input"
            label="Área de destino"
            type="text"
            {...register("destination_area", { required: true, maxLength: 50 })}
          />
          {errors.destination_area && (
            <Typography color="red">
              {errors.destination_area.message}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{ color: "#fff" }}
          disabled={isLoadingRequest ? true : false}
        >
          {isLoadingRequest ? "Cargando..." : "Agendar"}
        </Button>
      </form>
    </>
  );
};

export default FormTipify;
