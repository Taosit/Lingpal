import { useAuthStore } from "@/stores/AuthStore";
import axios from "axios";

const useAuthAxios = () => {
  const { accessToken, setAccessToken } = useAuthStore();

  const authAxios = axios.create({
    headers: {
      Accept: "application/json",
      withCredentials: true,
    },
  });

  authAxios.interceptors.request.use(
    (config) => {
      if (!config.headers!.Authorization && accessToken) {
        config.headers!.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const res = await fetch("/api/refresh_token", {
          credentials: "include",
        });
        const data = await res.json();
        setAccessToken(data.accessToken);
        prevRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return authAxios(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  return authAxios;
};

export default useAuthAxios;
