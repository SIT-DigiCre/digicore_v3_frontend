import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import CheckInOutButton from "../../components/Activity/CheckInOutButton";
import CurrentUsersList from "../../components/Activity/CurrentUsersList";
import PageHead from "../../components/Common/PageHead";
import { createServerApiClient } from "../../utils/fetch/client";

const PLACES: Record<string, string> = {
  "omiya-bushitsu": "大宮部室",
};

const DEFAULT_PLACE = "omiya-bushitsu";

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const place =
    typeof query.place === "string" && query.place in PLACES ? query.place : DEFAULT_PLACE;

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
        currentUserId: null,
        error: {
          message: `ユーザー情報の取得に失敗しました (HTTP ${status})`,
          status,
        },
        place,
        users: [],
      },
    };
  }

  const currentUserId = userRes.data?.userId ?? null;

  const activityRes = await client.GET("/activity/place/{place}/current", {
    params: {
      path: { place },
    },
  });

  if (activityRes.error) {
    const status = activityRes.response.status;
    if (status === 401 || status === 403) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    console.error("Failed to fetch activity:", activityRes.error);
    return {
      props: {
        currentUserId,
        error: {
          message: `在室情報の取得に失敗しました (HTTP ${status})`,
          status,
        },
        place,
        users: [],
      },
    };
  }

  return {
    props: {
      currentUserId,
      error: null,
      place,
      users: activityRes.data?.users ?? [],
    },
  };
};

const ActivityPage = ({
  users,
  currentUserId,
  place,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const isCheckedIn = currentUserId != null && users.some((u) => u.userId === currentUserId);

  const handlePlaceChange = (newPlace: string) => {
    router.push({ pathname: router.pathname, query: { place: newPlace } });
  };

  return (
    <>
      <PageHead title="入退室管理" />
      <Stack spacing={3}>
        <Stack
          direction={{ sm: "row", xs: "column" }}
          spacing={2}
          alignItems={{ sm: "center", xs: "stretch" }}
          justifyContent="space-between"
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>場所</InputLabel>
            <Select value={place} label="場所" onChange={(e) => handlePlaceChange(e.target.value)}>
              {Object.entries(PLACES).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CheckInOutButton place={place} isCheckedIn={isCheckedIn} />
        </Stack>

        {error && (
          <Typography color="error" sx={{ bgcolor: "error.lighter", borderRadius: 1, p: 2 }}>
            {error.message}
          </Typography>
        )}

        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              在室中
            </Typography>
            <Chip
              icon={<FiberManualRecordIcon sx={{ fontSize: 10 }} />}
              label={`${users.length}人`}
              size="small"
              color={users.length > 0 ? "success" : "default"}
              variant="outlined"
            />
          </Stack>
          <CurrentUsersList users={users} />
        </Box>
      </Stack>
    </>
  );
};

export default ActivityPage;
