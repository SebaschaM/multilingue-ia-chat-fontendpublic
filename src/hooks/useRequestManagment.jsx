import ApiJson from "../api/api-json-config";

/* REVISAR BIEN LAS PETICIONES */
export const handleRequestManagment = () => {
  const handleGetAllRequests = async () => {
    try {
      const { data } = await ApiJson.get("/admin/request/get-requests");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRequest = async (idRequest) => {
    try {
      const { data } = await ApiJson.delete(
        `/admin/request/request-delete/${idRequest}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data };
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetRequestById = async (id) => {
    try {
      const response = await ApiJson.get(
        `/admin/request/get-request-by-id/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateStatusRequest = async (data) => {
    try {
      const response = await ApiJson.put(
        `/admin/request/change-state-request`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  //CREAR SOLICITUD
  const handleCreateRequest = async (data) => {
    try {
      const response = await ApiJson.post(
        `/admin/request/register-request`,
        data
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleGetAllRequests,
    handleDeleteRequest,
    handleGetRequestById,
    handleUpdateStatusRequest,
    handleCreateRequest,
  };
};
