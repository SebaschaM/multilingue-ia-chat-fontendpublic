import { useState, useEffect } from "react";
import { BsPersonAdd, BsSearch } from "react-icons/bs";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Modal,
  LinearProgress,
} from "@mui/material";

import { ModalCustom, TableCustom } from "../../components";
import { LayoutDashboard, LayoutDashboardContent } from "../../layout";
import { handleRequestManagment } from "../../hooks/useRequestManagment";
import { ca } from "date-fns/locale";

const DashboardRequests = () => {
  const [valueSearch, setValueSearch] = useState("");
  const [valueState, setValueState] = useState("active");
  // const [openModal, setOpenModal] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [valueStateSelect, setValueStateSelect] = useState(""); // Inicializar con el valor de currentData.type_status
  const [requestSelectedId, setRequestSelectedId] = useState(null);
  const [request, setRequest] = useState([]);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [modalResponse, setModalResponse] = useState({
    show: false,
    message: "",
  });
  const [currentData, setCurrentData] = useState({});

  const {
    handleGetAllRequests,
    handleUpdateStatusRequest,
    handleDeleteRequest,
    handleGetRequestById,
  } = handleRequestManagment();

  const validationSchema = Yup.object().shape({
    avality_range: Yup.string()
      .required("El rango de disponibilidad es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    date: Yup.string()
      .required("El campo fecha es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
  });

  const {
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    //resolver: yupResolver(validationSchema),
    shouldUnregister: false,
  });

  //LISTAR TODAS LAS SOLIICTUDes
  const onGetAllRequests = async () => {
    try {
      const response = await handleGetAllRequests();

      if (response.requests && Array.isArray(response.requests)) {
        const mappedRequests = response.requests.map((request) => ({
          id: request.id,
          cliente: request.client.fullname,
          fecha_registro: formatearFecha(request.created_at),
          tipo: "Agendamiento",
          estado: transformText(request.status.name_status),
        }));

        setRequest(mappedRequests);
      } else {
        console.error(
          'La propiedad "client" no existe o no es un array en la respuesta del backend:',
          response
        );
      }
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };

  function formatearFecha(fechaString) {
    return new Date(fechaString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function transformText(text) {
    if (text === "pending") {
      return "Pendiente";
    }
    if (text === "attended") {
      return "Atendido";
    }
    if (text === "canceled") {
      return "Cancelado";
    }
  }

  //ELIMINAR LA SOLICITUD SELECCIONADA
  const onDeleteRequest = async () => {
    try {
      const response = await handleDeleteRequest(requestSelectedId);

      await onGetAllRequests();
      setShowModalDelete(false);

      setModalResponse({
        show: true,
        message: response.data.message,
      });
      return response;
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
    }
  };

  //OBTENER LA SOLICITUD SELECCIONADA

  const onGetRequestById = async (id) => {
    try {
      const response = await handleGetRequestById(id);
      const requestCurrent = response.request;

      console.log("requestCurrent", requestCurrent);

      const currentData = {
        user_id: requestSelectedId,
        date_recontac: formatearFecha(requestCurrent.date_attention),
        date_attention: formatearFecha(requestCurrent.created_at),
        reason_contact: requestCurrent.reason,
        dest_area: requestCurrent.destination_area,
        fullname: requestCurrent.client.fullname,
        client_email: requestCurrent.client.email,
        cellphone: requestCurrent.client.cellphone,
        agent_email: requestCurrent.user.email,
        status_request: traducirStatusRequest(
          requestCurrent.status.description
        ),
        type_status: requestCurrent.status.id,
      };

      setCurrentData(currentData);
      setValueStateSelect(currentData.type_status);
    } catch (error) {
      console.log(error);
    }
  };

  function traducirStatusRequest(text) {
    if (text === "Attended request") {
      return "Soicitud atentida";
    }
    if (text === "Pending request") {
      return "Solicitud en revisión";
    }
    if (text === "Canceled request") {
      return "Solicitud cancelada";
    }
  }

  const onEditTypeStatusRequest = async () => {
    try {
      const dataRequest = {
        request_id: requestSelectedId,
        status_id: valueStateSelect,
      };
      setShowModalEdit(false);
      const response = await handleUpdateStatusRequest(dataRequest);
      await onGetAllRequests();
      setCurrentData({});
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onGetAllRequests();
  }, []);

  useEffect(() => {
    if (!showModalView) {
      reset();
      setCurrentData({});
    } else {
      const id = requestSelectedId;
      onGetRequestById(id);
    }
  }, [showModalView]);

  useEffect(() => {
    if (!showModalEdit) {
      setCurrentData({});
      reset();
    } else {
      const id = requestSelectedId;
      onGetRequestById(id);
    }
  }, [showModalEdit]);

  return (
    <>
      {modalResponse.show && (
        <ModalCustom
          openModal={modalResponse.show}
          setOpenModal={setModalResponse}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              sx={{ fontSize: "25px", fontWeight: "bold" }}
              variant="h1"
            >
              {modalResponse.message}
            </Typography>
          </div>
        </ModalCustom>
      )}

      <LayoutDashboard title="Exe Digital | Solicitudes">
        <LayoutDashboardContent title="Solicitudes">
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              marginTop: "0.1rem",
            }}
          >
            <Grid item xs={12} sm={6} md={2.5}>
              <Box width={"100%"}>
                <FormControl fullWidth>
                  <InputLabel id="state-label">Estado</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    value={valueState}
                    label="Estado"
                    disabled="true"
                    onChange={(e) => setValueState(e.target.value)}
                  >
                    <MenuItem value={"active"}>All</MenuItem>
                    <MenuItem value={"inactive"}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <Box width={"100%"}>
                <FormControl fullWidth>
                  <InputLabel id="state-label">Estado</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    value={valueState}
                    label="Estado"
                    disabled="true"
                    onChange={(e) => setValueState(e.target.value)}
                  >
                    <MenuItem value={"active"}>All</MenuItem>
                    <MenuItem value={"inactive"}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="search-label">Buscar solicitud</InputLabel>
                <OutlinedInput
                  id="search-label"
                  type="text"
                  value={valueSearch}
                  onChange={(e) => setValueSearch(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => {}} edge="end">
                        <BsSearch size={18} />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Buscar solicitud"
                />
              </FormControl>
            </Grid>
          </Grid>

          <TableCustom
            setShowModalView={setShowModalView}
            setShowModalEdit={setShowModalEdit}
            setShowModalDelete={setShowModalDelete}
            DataForTableCustomForRequestManagment={request}
            setRequestSelectedId={setRequestSelectedId}
            valueSearch={valueSearch}
          />

          {/* MODAL */}
          <ModalCustom
            openModal={showModalView}
            setOpenModal={setShowModalView}
          >
            <Typography
              id="modal-modal-title"
              variant="h1"
              component="h1"
              align="center"
              fontWeight={"bold"}
              fontSize={"2.1rem"}
            >
              VER SOLICITUD
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "1.2rem",
                width: "100%",
                marginTop: "1rem",
              }}
            >
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Fecha de recontacto"
                  type="text"
                  value={currentData.date_recontac || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Fecha de creación de solicitud"
                  type="text"
                  value={currentData.date_attention || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Razón de contacto"
                  type="text"
                  value={currentData.reason_contact || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Área de destino"
                  type="text"
                  value={currentData.dest_area || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Correo del cliente"
                  type="text"
                  value={currentData.client_email || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Nombre del cliente"
                  type="text"
                  value={currentData.fullname || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Celular de contacto"
                  type="text"
                  value={currentData.cellphone || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Correo del agente"
                  type="text"
                  value={currentData.agent_email || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Estado"
                  type="text"
                  value={currentData.status_request || ""}
                  disabled={true}
                />
              </Box>

              <Box>
                <FormControl sx={{ minWidth: 200 }} fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Estado de solicitud
                  </InputLabel>
                  <Select
                    fullWidth
                    id="outlined-password-input"
                    label="Estado de solicitud"
                    type="text"
                    value={currentData.type_status || ""}
                    disabled={true}
                  >
                    <MenuItem value={1}>Atendido</MenuItem>
                    <MenuItem value={2}>Pendiente</MenuItem>
                    <MenuItem value={3}>Cancelado</MenuItem>
                  </Select>{" "}
                </FormControl>
              </Box>
              {/* DATOS DEL CLIENTE - FALTA AGREGAR CAMPOS */}
              <Button
                color="info"
                onClick={() => {
                  setShowModalView(false);
                }}
              >
                <Typography variant="button">Aceptar</Typography>
              </Button>
            </div>
          </ModalCustom>

          <ModalCustom
            openModal={showModalEdit}
            setOpenModal={setShowModalEdit}
          >
            <Typography
              id="modal-modal-title"
              variant="h1"
              component="h1"
              align="center"
              fontWeight={"bold"}
              fontSize={"2.1rem"}
            >
              EDITAR SOLICITUD
            </Typography>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "1.2rem",
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={handleSubmit(onEditTypeStatusRequest)}
            >
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Fecha de recontacto"
                  type="text"
                  value={currentData.date_recontac || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Fecha de creación de solicitud"
                  type="text"
                  value={currentData.date_attention || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Razón de contacto"
                  type="text"
                  value={currentData.reason_contact || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Área de destino"
                  type="text"
                  value={currentData.dest_area || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Correo del cliente"
                  type="text"
                  value={currentData.client_email || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Nombre del cliente"
                  type="text"
                  value={currentData.fullname || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Celular de contacto"
                  type="text"
                  value={currentData.cellphone || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Correo del agente"
                  type="text"
                  value={currentData.agent_email || ""}
                  disabled={true}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Estado"
                  type="text"
                  value={currentData.status_request || ""}
                  disabled={true}
                />
              </Box>

              <Box>
                <FormControl sx={{ minWidth: 200 }} fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Estado de solicitud
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="Estado de solicitud"
                    value={valueStateSelect}
                    //defaultValue={valueStateSelect}
                    {...register("type_status", {
                      required: true,
                    })}
                    onChange={(e) => setValueStateSelect(e.target.value)}
                  >
                    <MenuItem value={1}>Atendido</MenuItem>
                    <MenuItem value={2}>Pendiente</MenuItem>
                    <MenuItem value={3}>Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* DATOS DEL CLIENTE - FALTA AGREGAR CAMPOS */}
              <Button
                color="info"
                type="submit"
                disabled={isLoadingRequest ? true : false}
              >
                <Typography variant="button">Guardar cambios</Typography>
              </Button>
            </form>
          </ModalCustom>

          <ModalCustom
            openModal={showModalDelete}
            setOpenModal={setShowModalDelete}
          >
            <h1
              style={{
                fontSize: "1.8rem",
              }}
            >
              ¿Estás seguro que deseas eliminar esta solicitud?
            </h1>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                rowGap: "1rem",
              }}
            >
              <Button color="primary" onClick={onDeleteRequest}>
                <Typography variant="button">Aceptar</Typography>
              </Button>

              <Button color="error" onClick={() => setShowModalDelete(false)}>
                <Typography variant="button">Cancelar</Typography>
              </Button>
            </Box>
          </ModalCustom>
        </LayoutDashboardContent>
      </LayoutDashboard>
    </>
  );
};

export default DashboardRequests;
