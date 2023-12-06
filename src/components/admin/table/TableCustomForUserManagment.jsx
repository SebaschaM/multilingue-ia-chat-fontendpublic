import React from "react";
import { Box, Chip, Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BsEye, BsPencilSquare, BsTrash3 } from "react-icons/bs";

const TableCustomForUserManagment = ({
  setShowModalView,
  setShowModalEdit,
  setShowModalDelete,
  DataForTableCustomForUserManagment,
  setUserSelectedId,
  valueSearch,
}) => {
  const columns = [
    // {
    //   field: "id",
    //   headerName: "ID",
    //   width: 100,
    //   sortable: false,
    //   align: "center",
    //   headerAlign: "center",
    //   type: "number",
    // },
    {
      field: "usuario",
      headerName: "Usuario",
      width: 300,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "string",
    },
    {
      field: "fecha_registro",
      headerName: "Fecha de registro",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rol",
      headerName: "Rol",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "string",
    },
    {
      field: "teléfono",
      headerName: "Teléfono",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "string",
    },
    {
      field: "correo",
      headerName: "Correo",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "string",
    },
    {
      field: "estado",
      headerName: "Estado",
      sortable: false,
      width: 200,
      align: "center",
      type: "string",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Chip
            label={params.value}
            variant="outlined"
            sx={{
              backgroundColor:
                params.value === "Activo"
                  ? "#c3edde" // Un verde más fuerte
                  : params.value === "Inactivo"
                  ? "#FFE5D3"
                  : "#FFE5D3",
              color:
                params.value === "Activo"
                  ? "#1F9259"
                  : params.value === "Inactivo"
                  ? "#A30D11"
                  : "#A30D11",
              borderColor: "transparent",
            }}
          />
        );
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      sortable: false,
      width: 200,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              columnGap: "0.5rem",
            }}
          >
            {/* <IconButton onClick={() => setShowModalView(true)}>
              <BsEye size={22} color="#FF7A00" />
            </IconButton> */}
            <IconButton
              onClick={() => {
                setShowModalEdit(true);
                setUserSelectedId(params.row.id);
              }}
            >
              <BsPencilSquare size={22} color="#624DE3" />
            </IconButton>
            <IconButton
              onClick={() => {
                setShowModalDelete(true);
                setUserSelectedId(params.row.id);
              }}
            >
              <BsTrash3 size={22} color="#A30D11" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const filteredData = DataForTableCustomForUserManagment.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(valueSearch.toLowerCase())
    )
  );

  return (
    <div style={{ height: "fit-content", width: "95%" }}>
      <DataGrid
        rows={filteredData}
        columns={columns}
        disableColumnFilter
        disableColumnMenu
        disableDensitySelector
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20]}
      />
    </div>
  );
};

export default TableCustomForUserManagment;
