import axiosBase from "axios";
import { baseURL, baseURLForServerSide } from "./common";

export const axios = axiosBase.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
});

export const serverSideAxios = axiosBase.create({
  baseURL: baseURLForServerSide,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
});

export const isAxiosError = axiosBase.isAxiosError;
