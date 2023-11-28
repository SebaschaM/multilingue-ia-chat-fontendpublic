import React from "react";
import { Box, Chip, Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BsEye, BsPencilSquare, BsTrash3 } from "react-icons/bs";
import { rows } from "../../../utils/dataRows";

const TableCustom = ({
  setShowModalView,
  setShowModalEdit,
  setShowModalDelete,
  DataForTableCustomForRequestManagment,
  setRequestSelectedId,
  valueSearch,
}) => {
  const columns = [
    /*
    {
      field: "id",
      headerName: "ID",
      width: 180,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "number",
    },*/
    {
      field: "cliente",
      headerName: "Cliente",
      width: 340,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "string",
    },
    {
      field: "fecha_registro",
      headerName: "Fecha de registro",
      width: 260,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tipo",
      headerName: "Tipo",
      width: 260,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "string",
    },
    {
      field: "estado",
      headerName: "Estado",
      sortable: false,
      width: 260,
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
                params.value === "Pendiente"
                  ? "#FEF2E5"
                  : params.value === "Atendido"
                  ? "#EBF9F1"
                  : "#FBE7E8",
              color:
                params.value === "Pendiente"
                  ? "#CD6200"
                  : params.value === "Atendido"
                  ? "#1F9254"
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
      width: 253,
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
            {/*
            <IconButton onClick={() => setShowModalView(true)}>
              <BsEye size={22} color="#FF7A00" />
            </IconButton>
            <IconButton onClick={() => setShowModalEdit(true)}>
              <BsPencilSquare size={22} color="#624DE3" />
            </IconButton>
            <IconButton onClick={() => setShowModalDelete(true)}>
              <BsTrash3 size={22} color="#A30D11" />
            </IconButton>  */}
            <IconButton onClick={() => setShowModalView(true)}>
              <BsEye size={22} color="#FF7A00" />
            </IconButton>
            <IconButton
              onClick={() => {
                setShowModalEdit(true);
                setRequestSelectedId(params.row.id);
              }}
            >
              <BsPencilSquare size={22} color="#624DE3" />
            </IconButton>
            <IconButton
              onClick={() => {
                setShowModalDelete(true);
                setRequestSelectedId(params.row.id);
              }}
            >
              <BsTrash3 size={22} color="#A30D11" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const filteredData = DataForTableCustomForRequestManagment.filter((request) =>
    Object.values(request).some((value) =>
      String(value).toLowerCase().includes(valueSearch.toLowerCase())
    )
  ).map((request, index) => ({ ...request, id: index }));
  return (
    <div style={{ height: "fit-content", width: "100%" }}>
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

export default TableCustom;
