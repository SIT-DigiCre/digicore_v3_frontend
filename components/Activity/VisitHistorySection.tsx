import Link from "next/link";
import { useRouter } from "next/router";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HistoryIcon from "@mui/icons-material/History";
import TodayIcon from "@mui/icons-material/Today";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";

import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";

import type { ActivityHistoryUser } from "@/interfaces/activity";

type VisitHistorySectionProps = {
  users: ActivityHistoryUser[];
  period: string;
  date: string;
  place: string;
  currentUserId: string | null;
};

const getMondayOfWeek = (dateStr: string) => {
  const d = dayjs(dateStr);
  const day = d.day() || 7; // 日曜=7, 月曜=1
  return d.subtract(day - 1, "day");
};

// TODO: バックエンドの実装が「指定日の1週間前の週を返す」ようになっていて分かりづらいので修正する
const getPeriodLabel = (dateStr: string, period: string): string => {
  const d = dayjs(dateStr);
  if (period === "week") {
    // URLの日付が含まれる週の月曜〜日曜を表示
    const monday = getMondayOfWeek(dateStr);
    const sunday = monday.add(6, "day");
    return `${monday.format("MM/DD")}（月）〜 ${sunday.format("MM/DD")}（日）`;
  }
  if (period === "month") {
    return d.format("YYYY年M月");
  }
  return d.format("YYYY/MM/DD");
};

const getTodayLabel = (period: string): string => {
  if (period === "week") return "今週";
  if (period === "month") return "今月";
  return "今日";
};

const VisitHistorySection = ({
  users,
  period,
  date,
  place,
  currentUserId,
}: VisitHistorySectionProps) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePeriodChange = (_: React.MouseEvent<HTMLElement>, newPeriod: string | null) => {
    if (!newPeriod) return;
    router.push({ pathname: `/activity/${place}`, query: { date, period: newPeriod } });
  };

  const handleNavigate = (direction: -1 | 1) => {
    const d = dayjs(date);
    const newDate =
      period === "week"
        ? d.add(direction * 7, "day").format("YYYY-MM-DD")
        : period === "month"
          ? d.add(direction, "month").format("YYYY-MM-DD")
          : d.add(direction, "day").format("YYYY-MM-DD");
    router.push({
      pathname: `/activity/${place}`,
      query: { date: newDate, period },
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      router.push({ pathname: `/activity/${place}`, query: { date: e.target.value, period } });
    }
  };

  const handleGoToToday = () => {
    router.push({
      pathname: `/activity/${place}`,
      query: { date: dayjs().format("YYYY-MM-DD"), period },
    });
  };

  const today = dayjs();
  const isCurrent =
    period === "day"
      ? dayjs(date).isSame(today, "day")
      : period === "week"
        ? getMondayOfWeek(today.format("YYYY-MM-DD")).isSame(getMondayOfWeek(date), "day")
        : period === "month"
          ? dayjs(date).isSame(today, "month")
          : false;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Heading level={3}>訪問履歴</Heading>
        {currentUserId && (
          <ButtonLink
            href={`/activity/${place}/records/${currentUserId}`}
            variant="outlined"
            startIcon={<HistoryIcon />}
          >
            {isMobile ? "自分の記録" : "自分の記録を見る"}
          </ButtonLink>
        )}
      </Stack>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={1.5}
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          size="small"
          fullWidth={isMobile}
        >
          <ToggleButton value="day">日別</ToggleButton>
          <ToggleButton value="week">週別</ToggleButton>
          <ToggleButton value="month">月別</ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
          <IconButton size="small" onClick={() => handleNavigate(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          {period === "day" ? (
            <TextField
              type="date"
              size="small"
              value={date}
              onChange={handleDateChange}
              sx={{ "& .MuiInputBase-root": { height: 34 }, width: isMobile ? 150 : 180 }}
            />
          ) : (
            <Typography
              variant="body1"
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                px: 1,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {getPeriodLabel(date, period)}
            </Typography>
          )}
          <IconButton size="small" onClick={() => handleNavigate(1)}>
            <ChevronRightIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TodayIcon />}
            onClick={handleGoToToday}
            disabled={isCurrent}
            sx={{ height: 34, ml: 0.5, whiteSpace: "nowrap" }}
          >
            {getTodayLabel(period)}
          </Button>
        </Stack>
      </Stack>

      {users.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">この期間の訪問履歴はありません</Typography>
        </Paper>
      ) : (
        <Paper variant="outlined">
          <List disablePadding>
            {users.map((user, index) => (
              <Box key={user.userId}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  sx={{ px: isMobile ? 1.5 : 2, py: 1.5 }}
                  secondaryAction={
                    <Typography variant="body2" fontWeight="bold" sx={{ whiteSpace: "nowrap" }}>
                      {user.checkInCount}
                      {period === "day" ? "回" : "日"}
                    </Typography>
                  }
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 24, mr: 1, textAlign: "center" }}
                  >
                    {index + 1}
                  </Typography>
                  <ListItemAvatar sx={{ minWidth: isMobile ? 44 : 56 }}>
                    <Avatar
                      src={user.iconUrl || undefined}
                      sx={{ height: isMobile ? 36 : 44, width: isMobile ? 36 : 44 }}
                    >
                      {user.username.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        href={
                          currentUserId === user.userId
                            ? `/activity/${place}/records/${user.userId}`
                            : `/member/${user.userId}`
                        }
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <Typography
                          component="span"
                          fontWeight="medium"
                          fontSize={isMobile ? "0.875rem" : undefined}
                          sx={{
                            "&:hover": { textDecoration: "underline" },
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.username}
                        </Typography>
                      </Link>
                    }
                    secondary={(!isMobile && user.shortIntroduction) || undefined}
                    sx={{ mr: 2 }}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default VisitHistorySection;
