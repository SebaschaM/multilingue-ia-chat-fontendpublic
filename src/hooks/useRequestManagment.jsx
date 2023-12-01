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

  /*
  const handleGetRequestById = async (id) => {
    try {
      const { data } = await ApiJson.get(`/admin/request/get-request/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
*/
  /*
  const handleDeleteRequest = async (id) => {
    try {
      const { data } = await ApiJson.delete(
        `/admin/request/delete-request/${id}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };*/

  const handleEditRequest = async (id, data) => {
    try {
      const response = await ApiJson.put(
        `/admin/request/register-request/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateRequest = async (data) => {
    try {
      const response = await ApiJson.post(
        `/admin/request/register-request`,
        data
      );
      console.log(response)
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleGetAllRequests,
    //handleGetRequestById,
    //handleDeleteRequest,
    handleEditRequest,
    handleCreateRequest,
  };
};
