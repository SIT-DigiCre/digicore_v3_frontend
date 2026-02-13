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
import dayjs from "dayjs";

import CheckInOutButton from "@/components/Activity/CheckInOutButton";
import CurrentUsersList from "@/components/Activity/CurrentUsersList";
import VisitHistorySection from "@/components/Activity/VisitHistorySection";
import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { ACTIVITY_PLACES, DEFAULT_PLACE } from "@/interfaces/activity";
import { createServerApiClient } from "@/utils/fetch/client";

const VALID_PERIODS = ["day", "week", "month"] as const;
type Period = (typeof VALID_PERIODS)[number];

export const getServerSideProps = async ({ req, query, params }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const placeId = typeof params?.placeId === "string" ? params.placeId : DEFAULT_PLACE;

  if (!(placeId in ACTIVITY_PLACES)) {
    return { notFound: true };
  }

  const place = placeId;
  const period: Period =
    typeof query.period === "string" && VALID_PERIODS.includes(query.period as Period)
      ? (query.period as Period)
      : "day";
  const date =
    typeof query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(query.date)
      ? query.date
      : dayjs().format("YYYY-MM-DD");

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
        date,
        error: {
          message: `ユーザー情報の取得に失敗しました (HTTP ${status})`,
          status,
        },
        historyUsers: [],
        period,
        place,
        users: [],
      },
    };
  }

  const currentUserId = userRes.data?.userId ?? null;

  // APIは指定日付の1週間前/1ヶ月前のデータを返すため、URLの日付と表示を一致させるためにオフセットする
  let apiDate = date;
  if (period === "week") {
    apiDate = dayjs(date).add(7, "day").format("YYYY-MM-DD");
  } else if (period === "month") {
    apiDate = dayjs(date).add(1, "month").format("YYYY-MM-DD");
  }

  const [activityRes, historyRes] = await Promise.all([
    client.GET("/activity/place/{place}/current", {
      params: {
        path: { place },
      },
    }),
    client.GET("/activity/place/{place}/history", {
      params: {
        path: { place },
        query: { date: apiDate, period },
      },
    }),
  ]);

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
        date,
        error: {
          message: `在室情報の取得に失敗しました (HTTP ${status})`,
          status,
        },
        historyUsers: [],
        period,
        place,
        users: [],
      },
    };
  }

  if (historyRes.error) {
    console.error("Failed to fetch history:", historyRes.error);
  }

  return {
    props: {
      currentUserId,
      date,
      error: null,
      historyUsers: historyRes.data?.users ?? [],
      period,
      place,
      users: activityRes.data?.users ?? [],
    },
  };
};

const ActivityPage = ({
  users,
  currentUserId,
  place,
  period,
  date,
  historyUsers,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const isCheckedIn = currentUserId != null && users.some((u) => u.userId === currentUserId);

  const handlePlaceChange = (newPlace: string) => {
    router.push({
      pathname: `/activity/${newPlace}`,
      query: { date, period },
    });
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
              {Object.entries(ACTIVITY_PLACES).map(([value, label]) => (
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
            <Heading level={3}>在室中</Heading>
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

        <VisitHistorySection
          users={historyUsers}
          period={period}
          date={date}
          place={place}
          currentUserId={currentUserId}
        />
      </Stack>
    </>
  );
};

export default ActivityPage;
