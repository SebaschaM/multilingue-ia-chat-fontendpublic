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

const DashboardRequests = () => {
  const [valueSearch, setValueSearch] = useState("");
  const [valueState, setValueState] = useState("active");
  const [openModal, setOpenModal] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const { handleGetAllRequests, handleEditRequest, handleCreateRequest } =
    handleRequestManagment();
  const [requestSelectedId, setRequestSelectedId] = useState(null);
  const [request, setRequest] = useState([]);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [modalResponse, setModalResponse] = useState({
    show: false,
    message: "",
  });

  const [validationCount, setValidationCount] = useState(0);
  const [progressPassword, setProgressPassword] = useState(validationCount);

  const validationSchema = Yup.object().shape({
    avality_range: Yup.string()
      .required("El rango de disponibilidad es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    date: Yup.string()
      .required("El campo fecha es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    label: Yup.string()
      .required("El campo etiqueta es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    reason: Yup.string()
      .required("El campo razón es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    target_area: Yup.string()
      .required("El campo área de destino es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    email: Yup.string()
      .required("El campo email es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    fullname: Yup.string()
      .required("El campo nombre completo es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    cellphone: Yup.string()
      .required("El campo celular queta es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
    message: Yup.string()
      .required("El campo mensaje es requerido")
      .max(20, "El rango debe tener como máximo 20 caracteress"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    shouldUnregister: false,
  });

  const onModalResponse = () => {
    console.log("Abierto");
    setTimeout(() => {
      setModalResponse({
        show: false,
        message: "",
      });
    }, 3000);
  };

  const getAllRequests = async () => {
    try {
      const response = await handleGetAllRequests();

      if (response.requests && Array.isArray(response.requests)) {
        const mappedRequests = response.requests.map((request) => ({
          id: request.client.id,
          cliente: request.client.fullname,
          fecha_registro: formatearFecha(request.created_at),
          tipo: "Agendamiento",
          estado: request.status.name_status,
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

  const onCreateRequest = async (data) => {
    //setIsLoadingRequest(true);
    const dataRegister = {
      ...data,
      user_id: 1,
      client_id: 1,
    };
    try {
      const response = await handleCreateRequest(dataRegister);
      console.log(response);
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
    }
  };

  function formatearFecha(fechaString) {
    return new Date(fechaString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  useEffect(() => {
    getAllRequests();
  }, []);

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
                    onChange={(e) => setValueState(e.target.value)}
                  >
                    <MenuItem value={"active"}>Activo</MenuItem>
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
                    onChange={(e) => setValueState(e.target.value)}
                  >
                    <MenuItem value={"active"}>Activo</MenuItem>
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
            <Grid item xs={12} sm={6} md={2.5}>
              <Button
                onClick={() => setOpenModal(true)}
                variant="contained"
                fullWidth
                sx={{
                  paddingBlock: "1rem",
                  display: "flex",
                  columnGap: "0.5rem",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <BsPersonAdd size={18} />
                Agregar solicitud
              </Button>
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
          <ModalCustom openModal={openModal} setOpenModal={setOpenModal}>
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
                  align="center"
                >
                  AGENDAMIENTO
                </Typography>
                <form
                  onSubmit={handleSubmit(onCreateRequest)}
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
                      label="Rango de disponibilidad"
                      type="text"
                      color={errors.fullname ? "error" : "primary"}
                      {...register("fullname", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.fullname && (
                      <Typography color="red">
                        {errors.fullname.message}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Fecha"
                      type="text"
                      color={errors.date ? "error" : "primary"}
                      {...register("date", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.date && (
                      <Typography color="red">{errors.date.message}</Typography>
                    )}
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Etiqueta"
                      type="text"
                      color={errors.label ? "error" : "primary"}
                      {...register("label", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.label && (
                      <Typography color="red">
                        {errors.label.message}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Razón"
                      type="text"
                      color={errors.reason ? "error" : "primary"}
                      {...register("reason", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.reason && (
                      <Typography color="red">
                        {errors.reason.message}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Área de destino"
                      type="text"
                      color={errors.target_area ? "error" : "primary"}
                      {...register("target_area", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.target_area && (
                      <Typography color="red">
                        {errors.target_area.message}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Email"
                      type="text"
                      color={errors.email ? "error" : "primary"}
                      {...register("email", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.email && (
                      <Typography color="red">
                        {errors.email.message}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Nombre completo"
                      type="text"
                      color={errors.fullname ? "error" : "primary"}
                      {...register("fullname", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.fullname && (
                      <Typography color="red">
                        {errors.fullname.message}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Celular"
                      type="text"
                      color={errors.cellphone ? "error" : "primary"}
                      {...register("cellphone", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.cellphone && (
                      <Typography color="red">
                        {errors.cellphone.message}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      id="outlined-password-input"
                      label="Mensaje"
                      type="text"
                      color={errors.message ? "error" : "primary"}
                      {...register("message", {
                        required: { value: true, message: "Campo requerido" },
                        maxLength: {
                          value: 20,
                          message:
                            "El rango debe tener como máximo 20 caracteres",
                        },
                      })}
                    />
                    {errors.message && (
                      <Typography color="red">
                        {errors.message.message}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ color: "#fff" }}
                    //disabled={isLoadingRequest ? true : false}
                    /*onClick={() => {
                      onModalResponse();
                    }}*/
                  >
                    AGREGAR
                  </Button>
                </form>
              </Box>
            </Modal>
          </ModalCustom>

          <ModalCustom
            openModal={showModalView}
            setOpenModal={setShowModalView}
          >
            <h1>Ver modal</h1>
          </ModalCustom>

          <ModalCustom
            openModal={showModalEdit}
            setOpenModal={setShowModalEdit}
          >
            <h1>Editar modal</h1>
          </ModalCustom>

          <ModalCustom
            openModal={showModalDelete}
            setOpenModal={setShowModalDelete}
          >
            <h1>Estas seguro de eliminar</h1>
          </ModalCustom>
        </LayoutDashboardContent>
      </LayoutDashboard>
    </>
  );
};

export default DashboardRequests;
