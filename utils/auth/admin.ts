import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest } from "next";

import { GRANT_ACCOUNT, GRANT_INFRA } from "@/utils/auth/grants";
import { createServerApiClient } from "@/utils/fetch/client";

import type { components } from "@/utils/fetch/api.d.ts";

type ServerSideRequest = GetServerSidePropsContext["req"] | NextApiRequest;

export type AdminPageError = {
  message: string;
  title: string;
};

export type AdminPageGuardProps = {
  adminPageError: AdminPageError | null;
};

type AdminPageAccessResult =
  | {
      client: ReturnType<typeof createServerApiClient>;
      grants: string[];
      ok: true;
    }
  | {
      ok: false;
      result: GetServerSidePropsResult<AdminPageGuardProps>;
    };

export const getRequiredAdminGrantsByPath = (pathname: string): string[] | null => {
  if (!pathname.startsWith("/admin")) return null;
  if (pathname === "/admin") return [GRANT_ACCOUNT, GRANT_INFRA];
  if (pathname.startsWith("/admin/budget")) return [GRANT_ACCOUNT];
  if (pathname.startsWith("/admin/group")) return [GRANT_INFRA];
  if (pathname.startsWith("/admin/payment")) return [GRANT_ACCOUNT];
  if (pathname.startsWith("/admin/grade-update")) return [GRANT_INFRA];
  if (pathname.startsWith("/admin/reentry")) return [GRANT_INFRA];
  if (pathname.startsWith("/admin/activity")) return [GRANT_INFRA];
  if (pathname.startsWith("/admin/infra")) return [GRANT_INFRA];
  return [GRANT_ACCOUNT, GRANT_INFRA];
};

export const normalizeGrants = (grants: string[] | undefined): string[] =>
  Array.from(new Set((grants ?? []).map((grant) => grant.trim()).filter((grant) => grant !== "")));

export const hasRequiredAdminGrant = (pathname: string, grants: string[]): boolean => {
  const requiredAdminGrants = getRequiredAdminGrantsByPath(pathname);
  if (requiredAdminGrants === null) return true;
  return requiredAdminGrants.some((grant) => grants.includes(grant));
};

const createAccessDeniedError = (): AdminPageError => ({
  message: "このページを表示する権限がありません。トップページに戻ってください。",
  title: "権限がありません",
});

const createGrantFetchError = (message: string): AdminPageError => ({
  message,
  title: "エラーが発生しました",
});

export const requireAdminPageAccess = async (
  req: ServerSideRequest,
  pathname: string,
): Promise<AdminPageAccessResult> => {
  const client = createServerApiClient(req);

  try {
    const grantsRes = await client.GET("/user/me/grants", {});

    if (grantsRes.error) {
      const status = grantsRes.response.status;
      if (status === 401 || status === 403) {
        return {
          ok: false,
          result: {
            redirect: {
              destination: "/login",
              permanent: false,
            },
          },
        };
      }

      console.error(`Failed to fetch grants for ${pathname}:`, grantsRes.error);
      return {
        ok: false,
        result: {
          props: {
            adminPageError: createGrantFetchError(`権限情報の取得に失敗しました (HTTP ${status})`),
          },
        },
      };
    }

    const grants = normalizeGrants(
      (grantsRes.data as components["schemas"]["ResGetUserMeGrants"] | undefined)?.grants,
    );

    if (!hasRequiredAdminGrant(pathname, grants)) {
      return {
        ok: false,
        result: {
          props: {
            adminPageError: createAccessDeniedError(),
          },
        },
      };
    }

    return { client, grants, ok: true };
  } catch (error) {
    console.error(`Failed to validate admin access for ${pathname}:`, error);
    return {
      ok: false,
      result: {
        props: {
          adminPageError: createGrantFetchError("権限情報の取得に失敗しました"),
        },
      },
    };
  }
};
