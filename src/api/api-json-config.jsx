import axios from "axios";

const ApiJson = axios.create({
  baseURL: "http://localhost:5000/api",
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
