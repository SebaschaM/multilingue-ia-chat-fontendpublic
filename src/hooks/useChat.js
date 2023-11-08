import ApiJson from "../api/api-json-config";

export const useChat = () => {
  const getConversationsByID = async (userID) => {
    try {
      const response = await ApiJson.get(
        `/admin/messages/get-user-conversations/${userID}`
      );

      return {
        data: response.data,
        error: false,
      };
    } catch (error) {
      return {
        data: error.response.data.message,
        error: true,
      };
    }
  };

  const getMessageByIdConversation = async (uuid_conversation) => {
    try {
      const response = await ApiJson.get(
        `/admin/messages/get-user-messages/${uuid_conversation}`
      );
      // console.log(response.data);

      return {
        data: response.data,
        error: false,
      };
    } catch (error) {
      return {
        data: error.response.data.message,
        error: true,
      };
    }
  };

  return {
    getConversationsByID,
    getMessageByIdConversation,
  };
};
