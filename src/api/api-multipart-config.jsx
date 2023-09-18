import axios from "axios";

const ApiMultipart = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "multipart/form-data",

  },
});

// ApiMultipart.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("Error en la solicitud:", error);
//     return Promise.reject(error);
//   });

export default ApiMultipart;