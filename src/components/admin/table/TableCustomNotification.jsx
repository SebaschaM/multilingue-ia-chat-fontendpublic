import React from "react";
import { Box, Chip, Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BsEye, BsPencilSquare, BsTrash3 } from "react-icons/bs";
import { format, parseISO, parse } from "date-fns";

const TableCustomNotification = ({
  setShowModalView,
  setShowModalEdit,
  setShowModalDelete,
  setRequestSelectedId,
  data,
}) => {
  const columns = [
    {
      field: "id",
      headerName: "ID Solicitud",
      width: 180,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "number",
    },
    {
      field: "start_time",
      headerName: "Fecha de Inicio",
      width: 260,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "end_time",
      headerName: "Fecha fin",
      width: 260,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "state",
      headerName: "Estado",
      width: 260,
      sortable: false,
      align: "center",
      headerAlign: "center",
      type: "string",
    },
    {
      field: "created_at",
      headerName: "Creado",
      sortable: false,
      width: 260,
      align: "center",
      type: "string",
      headerAlign: "center",
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
            <IconButton
              onClick={() => {
                setShowModalView(true);
                setRequestSelectedId(params.row.id);
              }}
            >
              <BsEye size={22} color="#FF7A00" />
            </IconButton>
            {/* <IconButton
              onClick={() => {
                setShowModalEdit(true);
                setRequestSelectedId(params.row.id);
              }}
            >
              <BsPencilSquare size={22} color="#624DE3" />
            </IconButton> */}
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
  if (!data) return null;

  const dataFormatedDate = data.map((item) => {
    const fechaCreatedAt = new Date(item.created_at);
    const fechaStartTime = new Date(item.start_time);
    const fechaEndTime = new Date(item.end_time);
    const changeToEspaniol = item.state === "active" ? "Activo" : "Inactivo";

    fechaCreatedAt.setHours(
      fechaCreatedAt.getHours() + fechaCreatedAt.getTimezoneOffset() / 60
    );
    fechaStartTime.setHours(
      fechaStartTime.getHours() + fechaStartTime.getTimezoneOffset() / 60
    );
    fechaEndTime.setHours(
      fechaEndTime.getHours() + fechaEndTime.getTimezoneOffset() / 60
    );

    const formatedDate = format(fechaCreatedAt, "dd/MM/yyyy");
    const formatedStartTime = format(fechaStartTime, "dd/MM/yyyy");
    const formatedEndTime = format(fechaEndTime, "dd/MM/yyyy");

    return {
      ...item,
      created_at: formatedDate,
      start_time: formatedStartTime,
      end_time: formatedEndTime,
      state: changeToEspaniol,
    };
  });

  return (
    <div style={{ height: "fit-content", width: "100%" }}>
      <DataGrid
        rows={dataFormatedDate}
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

export default TableCustomNotification;
