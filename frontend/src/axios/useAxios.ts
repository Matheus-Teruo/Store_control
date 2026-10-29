import { useLanguageContext } from "@context/LanguageContext/useLanguageContext";
import axios from "axios";
import { useEffect } from "react";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost/api/",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function useAxios() {
  const language = useLanguageContext();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language.language;
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor); 
    };
  }, [language]);

  return api;
}

export default useAxios;
