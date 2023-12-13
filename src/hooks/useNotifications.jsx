import ApiJson from "../api/api-json-config";

export const useNotifications = () => {
  const handleGetAllNotifications = async () => {
    try {
      const { data } = await ApiJson.get(
        "/admin/notification/get-all-notification"
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetActiveNotifications = async () => {
    try {
      const { data } = await ApiJson.get(
        "/admin/notification/get-active-notifications"
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNotification = async (newNotification) => {
    try {
      const { data } = await ApiJson.post(
        "/admin/notification/register-notification",
        newNotification,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateNotification = async (id, notification) => {
    try {
      const { data } = await ApiJson.put(
        `/admin/notification/update-notification/${id}`,
        notification,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const { data } = await ApiJson.delete(
        `/admin/notification/delete-notification/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllNotificationsActive = async () => {
    try {
      const { data } = await ApiJson.get(
        "/admin/notification/get-active-notifications"
      );
      return data;
    } catch (error) {
      return { success: false, message: error.response.data.error };
    }
  };

  return {
    handleGetAllNotifications,
    handleGetActiveNotifications,
    handleAddNotification,
    handleUpdateNotification,
    handleDeleteNotification,
    getAllNotificationsActive,
  };
};
