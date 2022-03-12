import axios from "axios";
import { AccessTokenPair } from "../interfaces/AccessToken.interfaces";
import { setAccessToken } from "../redux/slices/auth/authSlice";
import store from "../redux/store";

const baseURL: string = process.env.REACT_APP_API_URL ?? "http://localhost:4000/Api";

export const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  validateStatus: (status) => {
    const acceptableStatusCodes = [200, 201, 204, 400, 403];
    return acceptableStatusCodes.includes(status);
  },
  timeout: 25000,
  timeoutErrorMessage: "TimeOut",
});

client.interceptors.request.use(
  (config) => {
    const { access_token, token_type } = store.getState().auth;

    if (config && config.headers) {
      config.headers["Authorization"] = `${token_type} ${access_token}`;
    }

    return config;
  },
  async (err) => {
    const originalRequest = err.config;

    if (axios.isCancel(err)) {
      return new Promise(() => {});
    }

    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await client.get("/Authentication/Login/Refresh");
        const data = response.data as AccessTokenPair;

        if (data.access_token) {
          store.dispatch(setAccessToken({ accessToken: data.access_token, tokenType: data.token_type }));
        }

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return client(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);
