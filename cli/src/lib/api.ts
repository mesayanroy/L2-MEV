import axios, { AxiosInstance } from "axios";
import { getConfig } from "./config";

export function createApiClient(): AxiosInstance {
  const cfg = getConfig();

  const client = axios.create({
    baseURL: cfg.apiUrl,
    timeout: 30_000,
    headers: {
      "Content-Type": "application/json",
      ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
    },
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const msg: string =
        err.response?.data?.error ??
        err.message ??
        "Unknown API error";
      return Promise.reject(new Error(msg));
    },
  );

  return client;
}
