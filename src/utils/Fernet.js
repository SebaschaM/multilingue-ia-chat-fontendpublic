import { Fernet } from "fernet-ts";

let fernetInstance;

export const initializeFernet = (key) => {
  console.log("b" + key);
  if (!fernetInstance) {
    fernetInstance = new Fernet("b" + key);
  }
};

export const decryptMessage = async (messageEncrypt) => {
  if (!fernetInstance) {
    throw new Error(
      "Fernet instance not initialized. Call initializeFernet first."
    );
  }

  const messageDesencrypt = await fernetInstance.decrypt(messageEncrypt);
  console.log(messageDesencrypt);
  return messageDesencrypt;
};

export const encryptMessage = async (message) => {
  if (!fernetInstance) {
    throw new Error(
      "Fernet instance not initialized. Call initializeFernet first."
    );
  }

  console.log(fernetInstance.key);
  const messageEncrypt = await fernetInstance.encrypt(message);
  console.log(messageEncrypt);
  return messageEncrypt;
};
