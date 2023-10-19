import { useState } from "react";
import { LayoutDashboard, LayoutDashboardContent } from "../../layout";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { useAuth } from "../../hooks/useAuth";
import { ModalCustom } from "../../components";

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
  const { handleRegister } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalResponse, setModalResponse] = useState({
    show: false,
    message: "",
  });
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onLogin = async (data) => {
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
        reset();
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

  return (
    <LayoutDashboard title="Exe Digital">
      <LayoutDashboardContent title="Gestionar Usuarios">
        <Button
          onClick={() => setShowModal(true)}
          variant="contained"
          sx={{ color: "#fff" }}
        >
          Agregar usuario
        </Button>

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
              onSubmit={handleSubmit(onLogin)}
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
                  <Typography color="red">{errors.email.message}</Typography>
                )}
              </Box>
              <Box>
                <TextField
                  fullWidth
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  color={errors.password ? "error" : "primary"}
                  {...register("password", {
                    required: { value: true, message: "Campo requerido" },
                    minLength: { value: 8, message: "Minimo 8 caracteres" },
                  })}
                />
                {errors.password && (
                  <Typography color="red">{errors.password.message}</Typography>
                )}
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
                    minLength: { value: 8, message: "Minimo 8 caracteres" },
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
                    minLength: { value: 8, message: "Minimo 8 caracteres" },
                  })}
                />
                {errors.fullname && (
                  <Typography color="red">{errors.fullname.message}</Typography>
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
                    minLength: { value: 9, message: "Minimo 9 caracteres" },
                    maxLength: { value: 9, message: "Maximo 9 caracteres" },
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
                  <Typography color="red">{errors.role.message}</Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{ color: "#fff" }}
                disabled={isLoadingRequest ? true : false}
              >
                {isLoadingRequest ? "Cargando..." : "Agregar"}
              </Button>
            </form>
          </Box>
        </Modal>

        <ModalCustom
          openModal={modalResponse.show}
          setOpenModal={setModalResponse}
        >
          <Typography variant="h6" component="h2" align="center">
            {modalResponse.message}
          </Typography>
        </ModalCustom>
      </LayoutDashboardContent>
    </LayoutDashboard>
  );
};

export default DashboardManagerUser;
