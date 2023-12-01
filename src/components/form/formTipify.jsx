import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { TextareaAutosize } from "@mui/base";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { formatearFecha } from "../../utils/formatDate";

import { handleRequestManagment } from "../../hooks/useRequestManagment";

import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import ModalCustom from "../admin/modal/ModalCustom";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    resize: none;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const FormTipify = ({
  onUserSelected,
  onUserTyping,
  openModal,
  onSelectedOption,
  onModalResponse,
  onSetModalResponse,
}) => {
  const schema = yup.object().shape({
    reason: yup.string().trim().required("Motivo de contacto es requerido"),
    date_attention:
      onSelectedOption === "agendar"
        ? yup
            .date()
            .required("Fecha de Re-Contacto es requerida")
            .min(new Date(), "La fecha debe ser mayor a la actual")
        : yup.mixed().notRequired(),
    destination_area: yup.string().required("Área de destino es requerida"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    const dataToSend = {
      client_id: onUserSelected.id,
      user_id: onUserTyping.user.idv2,
      reason: data.reason,
      date_attention: formatearFecha(data.date_attention),
      destination_area: data.destination_area,
      request_type_id: 2,
    };
    // console.log(dataToSend, "dataToSend");
    setIsLoadingRequest(true);
    const response = await handleCreateRequest(dataToSend);
    console.log(response);
    if (response.data.success) {
      console.log("toast");
      setIsLoadingRequest(false);
      openModal(false);
      // const mappedResponse =
      onSetModalResponse({
        show: true,
        message: "Se ha creado la solicitud con éxito",
      });
    }
  };

  // const modalResponseClose = (response) => {
  //   console.log(response)
  //   setModalResponse(prevState => ({
  //     ...prevState,
  //     show: response.success,
  //     message: response.message,
  //   }));
  //   console.log(modalResponse); // Deja este console.log

  // }

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
        <div style={{ marginTop: "-13px" }}>
          <Box>
            <Typography
              variant="label"
              sx={{
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: "0.8rem",
                marginBottom: "1rem",
                marginLeft: "0.7rem",
              }}
            >
              Motivo de Contacto
            </Typography>
            <Textarea
              maxRows={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue="


      "
              {...register("reason", { required: true, maxLength: 500 })}
            />

            {/* <TextAreaCustom
            fullWidth
            id="outlined-password-input"
            label="Motivo de Contacto"
            type="text"
            {...register("reason", { required: true, maxLength: 500 })}
          /> */}
            {errors.reason && (
              <Typography color="red">{errors.reason.message}</Typography>
            )}
            {/* A las validaciones le pongo el yup para que muestre el mensaje de error! */}
          </Box>
        </div>
        {onSelectedOption === "agendar" && (
          <Box>
            <TextField
              fullWidth
              id="outlined-password-input"
              label="Fecha de Re-Contacto"
              type="date"
              defaultValue={getDate}
              // display={onSelectedOption === "tipificar" ? "none" : "block"}
              {...register("date_attention", { required: true, maxLength: 50 })}
            />
            {errors.date_attention && (
              <Typography color="red">
                {errors.date_attention.message}
              </Typography>
            )}
          </Box>
        )}

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
          // onSubmit={() => setModalResponse({
          //   show: true,
          //   message: "Se ha creado la solicitud con éxito",
          // })}
        >
          {isLoadingRequest ? "Cargando..." : onSelectedOption}
        </Button>
      </form>
    </>
  );
};

export default FormTipify;
