import type { GetServerSidePropsContext, NextApiRequest } from "next";

import createClient from "openapi-fetch";

import type { paths } from "./api.d.ts";

import { baseURL, baseURLForServerSide } from "../common";

type ServerSideRequest = GetServerSidePropsContext["req"] | NextApiRequest;

export const apiClient = createClient<paths>({
  baseUrl: baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const createServerApiClient = (req: ServerSideRequest) => {
  const authHeaders = getAuthHeadersFromCookie(req);
  return createClient<paths>({
    baseUrl: baseURLForServerSide,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...authHeaders,
    },
  });
};

/**
 * サーバーサイドでクッキーからトークンを取得してヘッダーに設定するヘルパー関数
 * @param req Next.jsのgetServerSidePropsから取得できるreqオブジェクト
 * @returns Authorizationヘッダーを含むオブジェクト（トークンがない場合は空オブジェクト）
 */
export const getAuthHeadersFromCookie = (req: ServerSideRequest): { Authorization?: string } => {
  if (!req.cookies?.jwt) {
    return {};
  }
  return {
    Authorization: `Bearer ${req.cookies.jwt}`,
  };
};
