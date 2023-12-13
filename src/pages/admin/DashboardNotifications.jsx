import { useState, useEffect } from "react";
import { BsBell } from "react-icons/bs";
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { format, parseISO, parse } from "date-fns";

import { ModalCustom, TableCustomForUserManagment } from "../../components";
import { LayoutDashboard, LayoutDashboardContent } from "../../layout";
import { useNotifications } from "../../hooks/useNotifications";
import TableCustomNotification from "../../components/admin/table/TableCustomNotification";

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
  const [getDate, setDate] = useState(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  });

  //Estados del Dashboard Request example
  const [showModalView, setShowModalView] = useState();
  const [showModalEdit, setShowModalEdit] = useState();
  const [showModalDelete, setShowModalDelete] = useState();
  const [requestSelectedId, setRequestSelectedId] = useState(null);
  const [users, setUsers] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [notificationSelected, setNotificationSelected] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const {
    handleGetAllNotifications,
    handleAddNotification,
    handleUpdateNotification,
    handleDeleteNotification,
  } = useNotifications();

  const formattedStartTime = notificationSelected?.start_time
    ? new Date(notificationSelected.start_time).toISOString().split("T")[0]
    : "";

  const messageNew = notificationSelected?.message;

  const formattedEndTime = notificationSelected?.end_time
    ? new Date(notificationSelected.end_time).toISOString().split("T")[0]
    : "";

  const onGetAllNotifications = async () => {
    try {
      const data = await handleGetAllNotifications();
      setAllNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onCreateNotification = async (data) => {
    try {
      setIsLoadingRequest(true);
      const data2 = await handleAddNotification(data);
      setShowModal(false);
      setModalResponse({ show: true, message: data2.data.message });
      setIsLoadingRequest(false);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteNotification = async () => {
    try {
      const { message } = await handleDeleteNotification(requestSelectedId);
      setModalResponse({ show: true, message });
      setShowModalDelete(false);

      onGetAllNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateNotification = async (data) => {
    try {
      console.log(data);
      return;
      // setIsLoadingRequest(true);
      // const data2 = await handleUpdateNotification(requestSelectedId, data);
      // setShowModalEdit(false);
      // setModalResponse({ show: true, message: data2.data.message });
      // setIsLoadingRequest(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onGetAllNotifications();
  }, []);

  useEffect(() => {
    const selectedNotification = allNotifications.data?.find(
      (item) => item.id === requestSelectedId
    );
    const message = selectedNotification?.message;

    if (selectedNotification) {
      setValue("message", selectedNotification.message);
      setValue("start_date", selectedNotification.start_time);
      setValue("end_date", selectedNotification.end_time);
      setNotificationSelected(selectedNotification);
    }
  }, [
    requestSelectedId,
    allNotifications.data,
    setValue,
    setNotificationSelected,
  ]);

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
                onClick={() => {
                  setShowModal(true);
                  reset();
                }}
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
          <TableCustomNotification
            setShowModalView={setShowModalView}
            setShowModalEdit={setShowModalEdit}
            setShowModalDelete={setShowModalDelete}
            setRequestSelectedId={setRequestSelectedId}
            data={allNotifications.data}
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
                        {...register("message", {
                          required: { value: true, message: "Campo requerido" },
                        })}
                      />
                      {errors.message && (
                        <Typography color="red">
                          {errors.message.message}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ width: "100%" }}>
                      <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Fecha de inicio"
                        type="date"
                        defaultValue={getDate}
                        {...register("start_date", {
                          required: { message: "Campo requerido" },
                          maxLength: 50,
                        })}
                      />
                      {errors.start_date && (
                        <Typography color="red">
                          {errors.start_date.message}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ width: "100%" }}>
                      <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Fecha fin"
                        type="date"
                        defaultValue={""}
                        {...register("end_date", {
                          required: { message: "Campo requerido" },
                          maxLength: 50,
                        })}
                      />
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

          {notificationSelected !== null && (
            <ModalCustom
              openModal={showModalEdit}
              setOpenModal={setShowModalEdit}
            >
              <>
                <Modal
                  open={showModalEdit}
                  onClose={() => {
                    setShowModalEdit(false);
                    setRequestSelectedId(null);
                    notificationSelected(null);
                    reset();
                  }}
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
                      Editar notificación
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
                          label="Mensaje"
                          type="text"
                          defaultValue={messageNew}
                          {...register("message", {
                            required: {
                              value: true,
                              message: "Campo requerido",
                            },
                          })}
                        />
                        {errors.message && (
                          <Typography color="red">
                            {errors.message.message}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          id="outlined-password-input"
                          label="Fecha de inicio"
                          type="date"
                          defaultValue={formattedStartTime}
                          {...register("start_date", {
                            required: { message: "Campo requerido" },
                            maxLength: 50,
                          })}
                        />
                        {errors.start_date && (
                          <Typography color="red">
                            {errors.start_date.message}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          id="outlined-password-input"
                          label="Fecha fin"
                          type="date"
                          defaultValue={formattedEndTime}
                          {...register("end_date", {
                            required: { message: "Campo requerido" },
                            maxLength: 50,
                          })}
                        />
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
                        {isLoadingRequest ? "Cargando..." : "Editar"}
                      </Button>
                    </form>
                  </Box>
                </Modal>
              </>
            </ModalCustom>
          )}

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

            <Button color="primary" onClick={onDeleteNotification}>
              <Typography variant="button">Aceptar</Typography>
            </Button>

            <Button color="error" onClick={() => setShowModalDelete(false)}>
              <Typography variant="button">Cancelar</Typography>
            </Button>
          </ModalCustom>

          {notificationSelected !== null && (
            <ModalCustom
              openModal={showModalView}
              setOpenModal={setShowModalView}
            >
              <>
                <Modal
                  open={showModalView}
                  onClose={() => {
                    setShowModalView(false);
                    setRequestSelectedId(null);
                  }}
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
                      Detalles de notificación
                    </Typography>
                    <form
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
                          value={notificationSelected?.message}
                          disabled
                        />
                      </Box>

                      <Box sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          id="outlined-password-input"
                          label="Fecha de inicio"
                          type="date"
                          value={formattedStartTime}
                          disabled
                        />
                      </Box>

                      <Box sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          id="outlined-password-input"
                          label="Fecha fin"
                          type="date"
                          value={formattedEndTime}
                          disabled
                        />
                      </Box>
                    </form>
                  </Box>
                </Modal>
              </>
            </ModalCustom>
          )}
        </LayoutDashboardContent>
      </LayoutDashboard>
    </>
  );
};

export default DashboardNotifications;
