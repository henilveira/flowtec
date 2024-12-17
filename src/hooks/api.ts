import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifica se é um erro de autorização e se já não está tentando renovar
    if (
      (error.response?.status === 401 || error.response?.status === 400) &&
      !originalRequest._retry
    ) {
      // Se já está refreshing, coloca na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenta renovar o token
        await api.post("/accounts/token/refresh/");

        processQueue(null);
        isRefreshing = false;

        // Refaz a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erro ao renovar o token:", refreshError);

        processQueue(refreshError);
        isRefreshing = false;

        // Redireciona para login apenas uma vez
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
