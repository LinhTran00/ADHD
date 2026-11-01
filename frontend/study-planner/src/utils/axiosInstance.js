import axios from "axios";
import { BASE_URL } from "./constants";


// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: BASE_URL,

  timeout: 10000, // Timeout for requests (10 seconds)
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token"); // Get the token from local storage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Add the token to the request headers
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// Method to check the server connection and log the URL it's connecting to
const checkConnection = async () => {
  try {
    console.log(`Attempting to connect to: ${BASE_URL}`); // Log the URL
    const response = await axiosInstance.get("/"); // Test with root endpoint
    console.log("Server is reachable:", response.data); // Log response
    return true;
  } catch (error) {
    console.error("Error connecting to the server:", error);
    return false;
  }
};

checkConnection();

export { checkConnection }; // Export checkConnection separately
export default axiosInstance; // Export axiosInstance as the default export
