import axios from "axios";

const ApiJson = axios.create({
  // baseURL: "https://exe-service.onrender.com/api",
  baseURL: "https://fd31-190-234-28-17.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ApiJson.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("Error en la solicitud:", error);
//     return Promise.reject(error);
//   }
// );
export default ApiJson;
