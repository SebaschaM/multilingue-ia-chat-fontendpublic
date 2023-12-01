import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, LayoutDashboardContent } from "../../layout";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { useAuth } from "../../hooks/useAuth";
import { useUserManagment } from "../../hooks/useUserManagment";
import { ModalCustom, TableCustomForUserManagment } from "../../components";
import { BsPersonAdd, BsSearch } from "react-icons/bs";
import { formatearFecha } from "../../utils/formatDate";

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

const DashboardManagerUser = () => {
  //Estados nativos del Dashboard Manager User
  const { handleRegister } = useAuth();
  const {
    handleGetUsers,
    handleUpdateUsers,
    handleDeleteUsers,
    handleUserById,
  } = useUserManagment();
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

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        /[a-z]/,
        "La contraseña debe contener al menos una letra minúscula"
      )
      .matches(
        /[A-Z]/,
        "La contraseña debe contener al menos una letra mayúscula"
      )
      .matches(/\d/, "La contraseña debe contener al menos un número")
      .matches(
        /[@$!%*#?&_.]/,
        "La contraseña debe contener al menos un caracter especial: @$!%*#?&_."
      ),
    email: Yup.string()
      .required("El email es requerido")
      .email("El email debe ser válido"),
    confirm_password: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Las contraseñas no coinciden"
    ),
    fullname: Yup.string()
      .required("El nombre es requerido")
      .min(8, "El nombre debe tener al menos 8 caracteres"),
    cellphone: Yup.string().required("El número de teléfono es requerido"),
    // .matches(/^\d{9}$/, "El número de teléfono debe tener 9 dígitos"),
    role: Yup.string().required("El rol es requerido"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    shouldUnregister: false,
  });

  const countValidations = (password) => {
    let count = 0;

    if (password.length === 0) {
      count = 0;
    }

    if (password.length > 0) {
      count++;
    }

    if (password.length >= 8) {
      count++;
    }

    if (/[a-z]/.test(password)) {
      count++;
    }

    if (/[A-Z]/.test(password)) {
      count++;
    }

    if (/\d/.test(password)) {
      count++;
    }

    if (/[@$!%*#?&_.]/.test(password)) {
      count++;
    }

    const porcentValue = {
      0: 0,
      1: 10,
      2: 30,
      3: 50,
      4: 70,
      5: 90,
      6: 100,
    };

    const valuePorcent = porcentValue[count];
    setValidationCount(valuePorcent);
    setProgressPassword(valuePorcent);
  };

  const [validationCount, setValidationCount] = useState(0);
  const [progressPassword, setProgressPassword] = useState(validationCount);
  const [porcent, setPorcent] = useState(0);

  const onCreatedUser = async (data) => {
    setIsLoadingRequest(true);
    const dataRegister = {
      ...data,
      language_id: 1,
      role_id: data.role,
    };

    if (data.password !== data.confirm_password) {
      setIsLoadingRequest(false);
      setModalResponse({
        show: true,
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      const response = await handleRegister(dataRegister);
      if (response.success) {
        setIsLoadingRequest(false);
        setShowModal(false);
        setModalResponse({
          show: true,
          message: response.message,
        });
        await onGetUsers();
      } else {
        setIsLoadingRequest(false);
        setModalResponse({
          show: true,
          message: response.message,
        });
      }
    } catch (error) {
      setIsLoadingRequest(false);
    }
  };

  const onDeleteUsers = async () => {
    try {
      const response = await handleDeleteUsers(userSelectedId);
      await onGetUsers();
      setShowModalDelete(false);
      setModalResponse({
        show: true,
        message: response.data.message,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (data) => {
    try {
      const response = await handleUpdateUsers(data);
      await onGetUsers();
      setShowModalEdit(false);
      setModalResponse({
        show: true,
        message: response.message,
      });
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const onGetUserById = async (id) => {
    try {
      const response = await handleUserById(id);

      if (response.success === true && response.user) {
        const user = response.user;
        let role = "";
        if (user.role.name_role === "manager") {
          role = "1";
        } else if (user.role.name_role === "agent") {
          role = "2";
        }

        const currentData = {
          user_id: userSelectedId,
          email: user.email,
          password: "",
          fullname: user.fullname,
          cellphone: user.cellphone,
          language_id: user.language.id,
          role_id: role,
        };
        setValue("fullname", user.fullname);
        setValue("cellphone", user.cellphone);
        setValue("user_id", userSelectedId);
        setValue("email", user.email);
        setValue("language_id", user.language.id);
        setValue("role_id", user.language.id);

        setCurrentData(currentData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function transformText(text) {
    if (text === "manager") {
      return "Gerente";
    }
    if (text === "agent") {
      return "Agente";
    }
  }

  const onGetUsers = async () => {
    try {
      const response = await handleGetUsers();

      if (response.users && Array.isArray(response.users)) {
        const mappedUsers = response.users.map((user) => ({
          id: user.id,
          usuario: user.fullname,
          fecha_registro: formatearFecha(user.created_at),
          rol: transformText(user.role.name_role),
          telefono: user.cellphone,
          correo: user.email,
          estado: verifyUser(user.user_verified),
        }));

        setUsers(mappedUsers);
        console.log(mappedUsers);
      } else {
        console.error(
          'La propiedad "users" no existe o no es un array en la respuesta del backend:',
          response
        );
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  function verifyUser(user_verified) {
    if (user_verified === 1) {
      return "Activo";
    } else {
      return "Inactivo";
    }
  }

  useEffect(() => {
    if (!showModalEdit) {
      reset();
      setValidationCount(0);
      setProgressPassword(0);
    } else {
      const id = userSelectedId;
      onGetUserById(id);
    }
  }, [showModalEdit]);

  useEffect(() => {
    if (!showModal) {
      reset();
      setValidationCount(0);
      setProgressPassword(0);
    }
  }, [showModal]);

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setCurrentData({
      ...currentData,
      role_id: selectedRole,
    });
    setValue("role_id", selectedRole);
  };

  const onModalResponse = () => {
    console.log("Abierto");
    setTimeout(() => {
      setModalResponse({
        show: false,
        message: "",
      });
    }, 3000);
  };

  useEffect(() => {
    onGetUsers();
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

      <LayoutDashboard title="Exe Digital | Gestión de usuarios">
        <LayoutDashboardContent title="Gestión de usuarios">
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              marginTop: "0.1rem",
            }}
          >
            {/* <Grid item xs={12} sm={6} md={2.5}>
          <Typography variant="h6" component="p" align="center">
            5 empleados
          </Typography>
        </Grid> */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Box width={"100%"}>
                <FormControl fullWidth>
                  {/* AQUÍ CORREGIR EL FILTRADO, HAY UN BUG */}
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
                  <InputLabel id="state-label">Rol</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    value={valueState}
                    label="Estado"
                    disabled="true"
                    onChange={(e) => setValueState(e.target.value)}
                  >
                    <MenuItem value={"active"}>All</MenuItem>
                    <MenuItem value={"inactive"}>Managment</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="search-label">Buscar Usuario</InputLabel>
                <OutlinedInput
                  id="search-label"
                  type="text"
                  value={valueSearch}
                  onChange={(e) => setValueSearch(e.target.value)}
                  inputRef={searchInputRef} // Asigna la referencia aquí
                  endAdornment={
                    <InputAdornment position="end">
                      <BsSearch
                        size={18}
                        onClick={() => searchInputRef.current.focus()}
                      />
                    </InputAdornment>
                  }
                  label="Buscar solicitud"
                />
              </FormControl>
            </Grid>

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
                <BsPersonAdd size={18} />
                Agregar Usuario
              </Button>
            </Grid>
          </Grid>
          {/* AQUÍ VERIFICAR */}
          <TableCustomForUserManagment
            setShowModalView={setShowModalView}
            setShowModalEdit={setShowModalEdit}
            setShowModalDelete={setShowModalDelete}
            DataForTableCustomForUserManagment={users}
            setUserSelectedId={setUserSelectedId}
            valueSearch={valueSearch}
          />
          {/* User este formulario para realizar el update del usuario */}
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
                    Agregar usuario
                  </Typography>
                  <form
                    onSubmit={handleSubmit(onCreatedUser)}
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
                        label="Email"
                        type="email"
                        color={errors.email ? "error" : "primary"}
                        {...register("email", {
                          required: { value: true, message: "Campo requerido" },
                          validate: (value) => {
                            const regex =
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
                            return regex.test(value) || "Email invalido";
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
                        label="Password"
                        type="password"
                        onInput={(e) => {
                          const password = e.target.value;
                          countValidations(password);
                        }}
                        color={errors.password ? "error" : "primary"}
                        {...register("password", {
                          required: { value: true, message: "Campo requerido" },
                          minLength: {
                            value: 8,
                            message: "Minimo 8 caracteres",
                          },
                        })}
                      />
                      {errors.password && (
                        <Typography color="red">
                          {errors.password.message}
                        </Typography>
                      )}
                      <div>
                        <Typography
                          sx={{ color: "red", maxWidth: "80%" }}
                        ></Typography>
                        <br />
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress
                            variant="determinate"
                            value={progressPassword}
                            sx={{
                              backgroundColor:
                                progressPassword < 30
                                  ? "#FF0000"
                                  : progressPassword < 70
                                  ? "#FFA500"
                                  : "#00FF00",
                            }}
                          />
                        </Box>
                        {progressPassword == 100 && (
                          <Typography color="green">
                            Contraseña segura
                          </Typography>
                        )}
                      </div>
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Confirmar password"
                        type="password"
                        color={errors.confirm_password ? "error" : "primary"}
                        {...register("confirm_password", {
                          required: { value: true, message: "Campo requerido" },
                          minLength: {
                            value: 8,
                            message: "Minimo 8 caracteres",
                          },
                          validate: (value) => {
                            return (
                              value === getValues("password") ||
                              "Las contraseñas no coinciden"
                            );
                          },
                        })}
                      />
                      {errors.confirm_password && (
                        <Typography color="red">
                          {errors.confirm_password.message}
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
                          minLength: {
                            value: 8,
                            message: "Minimo 8 caracteres",
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
                        label="Numero celular"
                        type="tel"
                        color={errors.cellphone ? "error" : "primary"}
                        {...register("cellphone", {
                          required: { value: true, message: "Campo requerido" },
                          minLength: {
                            value: 9,
                            message: "Minimo 9 caracteres",
                          },
                          maxLength: {
                            value: 9,
                            message: "Maximo 9 caracteres",
                          },
                          validate: (value) => {
                            return (
                              !isNaN(value) ||
                              "El numero de celular debe contener solo numeros"
                            );
                          },
                        })}
                      />
                      {errors.cellphone && (
                        <Typography color="red">
                          {errors.cellphone.message}
                        </Typography>
                      )}
                    </Box>
                    {/* <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Lenguaje
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={"age"}
                  label="Age"
                  onChange={() => {}}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl> */}
                    <Box>
                      <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <InputLabel
                          id="demo-simple-select-helper-label"
                          color={errors.role ? "error" : "primary"}
                        >
                          Rol
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          label="Role"
                          color={errors.role ? "error" : "primary"}
                          {...register("role", {
                            required: true,
                          })}
                          defaultValue=""
                        >
                          <MenuItem value={""} disabled>
                            Seleccione un rol
                          </MenuItem>
                          <MenuItem value={"1"}>Gerente</MenuItem>
                          <MenuItem value={"2"}>Agente</MenuItem>
                          <MenuItem value={"3"}>Bot</MenuItem>
                        </Select>
                      </FormControl>
                      {errors.role && (
                        <Typography color="red">
                          {errors.role.message}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ color: "#fff" }}
                      disabled={isLoadingRequest ? true : false}
                      onClick={() => {
                        onModalResponse();
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
            openModal={showModalView}
            setOpenModal={setShowModalView}
          >
            <h1>Ver modal</h1>
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
                    onSubmit={handleSubmit(onUpdate)}
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
                        color={errors.email ? "error" : "primary"}
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

                    <Box>
                      <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Nuevo password"
                        type="password"
                        onInput={(e) => {
                          const password = e.target.value;
                          countValidations(password);
                        }}
                        color={errors.password ? "error" : "primary"}
                        {...register("password", {
                          required: { value: true, message: "Campo requerido" },
                          minLength: {
                            value: 8,
                            message: "Minimo 8 caracteres",
                          },
                        })}
                      />
                      {errors.password && (
                        <Typography color="red">
                          {errors.password.message}
                        </Typography>
                      )}
                      <div>
                        <Typography
                          sx={{ color: "red", maxWidth: "80%" }}
                        ></Typography>
                        <br />
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress
                            variant="determinate"
                            value={progressPassword}
                            sx={{
                              backgroundColor:
                                progressPassword < 30
                                  ? "#FF0000"
                                  : progressPassword < 70
                                  ? "#FFA500"
                                  : "#00FF00",
                            }}
                          />
                        </Box>
                        {progressPassword == 100 && (
                          <Typography color="green">
                            Contraseña segura
                          </Typography>
                        )}
                      </div>
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Confirmar password"
                        type="password"
                        color={errors.confirm_password ? "error" : "primary"}
                        {...register("confirm_password", {
                          required: { value: true, message: "Campo requerido" },
                          minLength: {
                            value: 8,
                            message: "Minimo 8 caracteres",
                          },
                          validate: (value) => {
                            return (
                              value === getValues("password") ||
                              "Las contraseñas no coinciden"
                            );
                          },
                        })}
                      />
                      {errors.confirm_password && (
                        <Typography color="red">
                          {errors.confirm_password.message}
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
                          minLength: {
                            value: 8,
                            message: "Mínimo 8 caracteres",
                          },
                        })}
                        value={currentData.fullname}
                        onChange={(e) =>
                          setCurrentData({
                            ...currentData,
                            fullname: e.target.value,
                          })
                        }
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
                        label="Numero celular"
                        type="tel"
                        color={errors.cellphone ? "error" : "primary"}
                        {...register("cellphone", {
                          required: { value: true, message: "Campo requerido" },
                          minLength: {
                            value: 9,
                            message: "Minimo 9 caracteres",
                          },
                          maxLength: {
                            value: 13,
                            message: "Maximo 13 caracteres",
                          },
                          validate: (value) => {
                            return (
                              !isNaN(value) ||
                              "El numero de celular debe contener solo numeros"
                            );
                          },
                        })}
                        value={currentData.cellphone}
                        onChange={(e) =>
                          setCurrentData({
                            ...currentData,
                            cellphone: e.target.value,
                          })
                        }
                      />
                      {errors.cellphone && (
                        <Typography color="red">
                          {errors.cellphone.message}
                        </Typography>
                      )}
                    </Box>

                    {/* <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Lenguaje
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={"age"}
                  label="Age"
                  onChange={() => {}}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl> */}
                    <Box>
                      <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <InputLabel
                          id="demo-simple-select-helper-label"
                          color={errors.role ? "error" : "primary"}
                        >
                          Rol
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          label="Role"
                          color={errors.role ? "error" : "primary"}
                          {...register("role", {
                            required: true,
                          })}
                          value={currentData.role_id}
                          onChange={handleRoleChange}
                        >
                          <MenuItem value="" disabled>
                            Seleccione un rol
                          </MenuItem>
                          <MenuItem value={"1"}>Gerente</MenuItem>
                          <MenuItem value={"2"}>Agente</MenuItem>
                        </Select>
                      </FormControl>
                      {errors.role && (
                        <Typography color="red">
                          {errors.role.message}
                        </Typography>
                      )}
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
            <Button color="primary" onClick={onDeleteUsers}>
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

export default DashboardManagerUser;
