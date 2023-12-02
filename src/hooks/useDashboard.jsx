import ApiJson from "../api/api-json-config";

export const useDashboard = () => {
  const handleGetRequestsForMonth = async () => {
    try {
      const { data } = await ApiJson.get("/admin/dashboard/get_requests_for_month");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCountClientsByMonth = async () => {
    try {
      const { data } = await ApiJson.get("/admin/dashboard/get_count_clients_by_month");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalAttendedChats = async () => {
    try {
      const { data } = await ApiJson.get("/admin/dashboard/get_total_attended_chats");
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  const getPercentageOfUsersByRole = async () => {
    try {
      const { data } = await ApiJson.get("/admin/dashboard/get_percentage_of_users_by_role");
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const getCountChatsByHour = async () => {
    try {
      const { data } = await ApiJson.get("/admin/dashboard/get_count_chats_by_hour");
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const getTotalOfUsers = async () => {
    try {
      const { data } = await ApiJson.get("/admin/dashboard/get_total_of_users");
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  return {
    handleGetRequestsForMonth,
    handleGetCountClientsByMonth,
    getTotalAttendedChats,
    getPercentageOfUsersByRole,
    getCountChatsByHour,
    getTotalOfUsers
  };
};