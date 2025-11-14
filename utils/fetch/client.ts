import createClient from "openapi-fetch";

import { baseURL, baseURLForServerSide } from "../common";

import type { paths } from "./api.d.ts";

export const apiClient = createClient<paths>({
  baseUrl: baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const serverSideApiClient = createClient<paths>({
  baseUrl: baseURLForServerSide,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});
