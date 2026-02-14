import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";

import ActivityRecordTable from "@/components/Activity/ActivityRecordTable";
import { ButtonLink } from "@/components/Common/ButtonLink";
import PageHead from "@/components/Common/PageHead";
import Pagination from "@/components/Common/Pagination";
import { ACTIVITY_PLACES, DEFAULT_PLACE } from "@/interfaces/activity";
import { createServerApiClient } from "@/utils/fetch/client";

const ITEMS_PER_PAGE = 20;

export const getServerSideProps = async ({ req, query, params }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const placeId = typeof params?.placeId === "string" ? params.placeId : DEFAULT_PLACE;

  if (!(placeId in ACTIVITY_PLACES)) {
    return { notFound: true };
  }

  const place = placeId;
  const userId = params?.userId as string;
  const rawPage = query.page ? parseInt(query.page as string, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const userRes = await client.GET("/user/me", {});

  if (userRes.error) {
    const status = userRes.response.status;
    if (status === 401 || status === 403) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    console.error("Failed to fetch user info:", userRes.error);
    return {
      props: {
        canEdit: false,
        currentPage: 1,
        error: {
          message: `ユーザー情報の取得に失敗しました (HTTP ${status})`,
          status,
        },
        hasNextPage: false,
        hasPreviousPage: false,
        place,
        records: [],
        userId,
      },
    };
  }

  const currentUser = userRes.data;
  const canEdit = currentUser?.userId === userId || currentUser?.isAdmin === true;

  const recordsRes = await client.GET("/activity/user/{userId}/records", {
    params: {
      path: { userId },
      query: {
        limit: ITEMS_PER_PAGE,
        offset,
        place,
      },
    },
  });

  if (recordsRes.error) {
    const status = recordsRes.response.status;
    if (status === 401 || status === 403) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    console.error("Failed to fetch records:", recordsRes.error);
    return {
      props: {
        canEdit,
        currentPage: page,
        error: {
          message: `入室記録の取得に失敗しました (HTTP ${status})`,
          status,
        },
        hasNextPage: false,
        hasPreviousPage: false,
        place,
        records: [],
        userId,
      },
    };
  }

  const records = recordsRes.data?.records ?? [];
  const total = recordsRes.data?.total ?? 0;
  const hasNextPage = offset + records.length < total;
  const hasPreviousPage = page > 1;

  return {
    props: {
      canEdit,
      currentPage: page,
      error: null,
      hasNextPage,
      hasPreviousPage,
      place,
      records,
      userId,
    },
  };
};

const UserRecordsPage = ({
  records,
  userId,
  place,
  currentPage,
  hasNextPage,
  hasPreviousPage,
  canEdit,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const handlePlaceChange = (newPlace: string) => {
    router.push({
      pathname: `/activity/${newPlace}/records/${userId}`,
      query: { page: 1 },
    });
  };

  const handlePageChange = (page: number) => {
    router.push({
      pathname: `/activity/${place}/records/${userId}`,
      query: { page },
    });
  };

  return (
    <>
      <PageHead title="入室記録" />
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <ButtonLink href={`/activity/${place}`} variant="text" startIcon={<ArrowBackIcon />}>
            入退室管理に戻る
          </ButtonLink>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>場所</InputLabel>
            <Select value={place} label="場所" onChange={(e) => handlePlaceChange(e.target.value)}>
              {Object.entries(ACTIVITY_PLACES).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {error && (
          <Typography color="error" sx={{ bgcolor: "error.lighter", borderRadius: 1, p: 2 }}>
            {error.message}
          </Typography>
        )}

        <ActivityRecordTable records={records} canEdit={canEdit} />

        {records.length > 0 && !error && (
          <Stack alignItems="center">
            <Pagination
              page={currentPage}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              onChange={handlePageChange}
            />
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default UserRecordsPage;
