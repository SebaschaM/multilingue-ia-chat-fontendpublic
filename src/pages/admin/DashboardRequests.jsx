import { useState } from "react";
import { BsPersonAdd, BsSearch } from "react-icons/bs";

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
} from "@mui/material";

import { ModalCustom, TableCustom } from "../../components";
import { LayoutDashboard, LayoutDashboardContent } from "../../layout";

const DashboardRequests = () => {
  const [valueSearch, setValueSearch] = useState("");
  const [valueState, setValueState] = useState("active");
  const [openModal, setOpenModal] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  return (
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
          {/* <Grid item xs={12} sm={6} md={2.5}>
          <Typography variant="h6" component="p" align="center">
            5 empleados
          </Typography>
        </Grid> */}
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
        />

        <ModalCustom openModal={openModal} setOpenModal={setOpenModal}>
          <h1>Contenido del modal</h1>
        </ModalCustom>

        <ModalCustom openModal={showModalView} setOpenModal={setShowModalView}>
          <h1>Ver modal</h1>
        </ModalCustom>

        <ModalCustom openModal={showModalEdit} setOpenModal={setShowModalEdit}>
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
  );
};

export default DashboardRequests;
