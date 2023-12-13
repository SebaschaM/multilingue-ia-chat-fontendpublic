import { useRef, useState } from "react";
import { LayoutDashboard, LayoutDashboardContent } from "../../layout";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useAuth } from "../../hooks/useAuth";
import { useUserManagment } from "../../hooks/useUserManagment";
import { ModalCustom, TableCustomForUserManagment } from "../../components";
import { BsBell } from "react-icons/bs";

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

const DashboardNotifications = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalResponse, setModalResponse] = useState({
    show: false,
    message: "",
  });
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const searchInputRef = useRef(null);

  //Estados del Dashboard Request example
  const [valueSearch, setValueSearch] = useState("");
  const [valueState, setValueState] = useState("active");
  const [openModal, setOpenModal] = useState(false);
  const [showModalView, setShowModalView] = useState();
  const [showModalEdit, setShowModalEdit] = useState();
  const [showModalDelete, setShowModalDelete] = useState();
  const [users, setUsers] = useState([]);
  const [userSelectedId, setUserSelectedId] = useState(null);
  const [currentData, setCurrentData] = useState({
    id: "",
    email: "",
    password: "",
    fullname: "",
    cellphone: "",
    language_id: "",
    role_id: "1",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onCreateNotification = async (data) => {
    console.log(data);
  };

  const onUpdateNotification = async (data) => {};

  const onDeleteNotification = async () => {};

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

      <LayoutDashboard title="Exe Digital | Gestión de notificaciones">
        <LayoutDashboardContent title="Gestión de notificaciones">
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              marginTop: "0.1rem",
            }}
          >
            <Grid item xs={12} sm={6} md={2.5}>
              <Button
                onClick={() => setShowModal(true)}
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
                <BsBell size={18} />
                Agregar notificación
              </Button>
            </Grid>
          </Grid>
          <TableCustomForUserManagment
            setShowModalView={setShowModalView}
            setShowModalEdit={setShowModalEdit}
            setShowModalDelete={setShowModalDelete}
            DataForTableCustomForUserManagment={users}
            setUserSelectedId={setUserSelectedId}
            valueSearch={valueSearch}
          />
          <ModalCustom openModal={showModal} setOpenModal={setShowModal}>
            <>
              <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
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
                    Agregar notificación
                  </Typography>
                  <form
                    onSubmit={handleSubmit(onCreateNotification)}
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
                        label="Mensaje"
                        type="text"
                        {...register("messsage", {
                          required: { value: true, message: "Campo requerido" },
                        })}
                      />
                      {errors.messsage && (
                        <Typography color="red">
                          {errors.messsage.message}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ width: "100%" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DatePicker"]}
                          sx={{ width: "100%" }}
                        >
                          <DatePicker
                            label="Fecha de inicio"
                            sx={{ width: "100%" }}
                            {...register("start_date", {
                              required: {
                                value: true,
                                message: "Campo requerido",
                              },
                            })}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {errors.start_date && (
                        <Typography color="red">
                          {errors.start_date.message}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ width: "100%" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DatePicker"]}
                          sx={{ width: "100%" }}
                        >
                          <DatePicker
                            label="Fecha de fin"
                            sx={{ width: "100%" }}
                            {...register("end_date", {
                              required: {
                                value: true,
                                message: "Campo requerido",
                              },
                            })}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {errors.end_date && (
                        <Typography color="red">
                          {errors.end_date.message}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ color: "#fff" }}
                      disabled={isLoadingRequest ? true : false}
                      onClick={() => {
                        // onModalResponse();
                      }}
                    >
                      {isLoadingRequest ? "Cargando..." : "Agregar"}
                    </Button>
                  </form>
                </Box>
              </Modal>
            </>
          </ModalCustom>

          <ModalCustom
            openModal={showModalEdit}
            setOpenModal={setShowModalEdit}
          >
            <>
              <Modal
                open={showModalEdit}
                onClose={() => setShowModalEdit(false)}
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
                    Editar usuario
                  </Typography>
                  <form
                    onSubmit={handleSubmit(onUpdateNotification)}
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
                        type="email"
                        // InputProps={{ readOnly: true }}
                        disabled="true"
                        value={currentData.email}
                        {...register("email", {
                          required: { value: true, message: "Campo requerido" },
                          validate: (value) => {
                            const regex =
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
                            return regex.test(value) || "Email inválido";
                          },
                        })}
                      />
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ color: "#fff" }}
                      disabled={isLoadingRequest ? true : false}
                    >
                      {isLoadingRequest ? "Cargando..." : "Actualizar datos"}
                    </Button>
                  </form>
                </Box>
              </Modal>
            </>
          </ModalCustom>

          <ModalCustom
            openModal={showModalDelete}
            setOpenModal={setShowModalDelete}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography
                sx={{ fontSize: "25px", fontWeight: "bold" }}
                variant="h1"
              >
                ¿Estás seguro que deseas eliminar el usuario?
              </Typography>
            </div>
            {/* Falta agregar un MODAL que indique que la operación se hizo con éxito */}
            <Button color="primary" onClick={onDeleteNotification}>
              <Typography variant="button">Aceptar</Typography>
            </Button>

            <Button color="error" onClick={() => setShowModalDelete(false)}>
              <Typography variant="button">Cancelar</Typography>
            </Button>
          </ModalCustom>
        </LayoutDashboardContent>
      </LayoutDashboard>
    </>
  );
};

export default DashboardNotifications;
