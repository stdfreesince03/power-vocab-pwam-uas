import axios from "axios";
import useAuthStore from "../store/authStore";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const apiClient = axios.create({
    baseURL: BACKEND_URL,
});

export default apiClient;