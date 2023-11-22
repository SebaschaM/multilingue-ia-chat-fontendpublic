import ApiJson from "../api/api-json-config";

export const useChatClient = () => {
  const handleRegisterUserChat = async (dataRegister) => {
    const { data } = await ApiJson.post(
      "/client/auth/register-no-full",
      dataRegister
    );
    return data;
  };

  return {
    handleRegisterUserChat,
  };
};
