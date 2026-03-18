import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Fragment } from "react";

import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import ForceCheckoutButton from "@/components/Activity/ForceCheckoutButton";
import { ButtonLink } from "@/components/Common/ButtonLink";
import Heading from "@/components/Common/Heading";
import PageHead from "@/components/Common/PageHead";
import { ACTIVITY_PLACES, DEFAULT_PLACE } from "@/interfaces/activity";
import { GRANT_INFRA } from "@/utils/auth/grants";
import { createServerApiClient } from "@/utils/fetch/client";

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const rawPlace = typeof query.place === "string" ? query.place : DEFAULT_PLACE;
  const place = Object.hasOwn(ACTIVITY_PLACES, rawPlace) ? rawPlace : DEFAULT_PLACE;

  try {
    const grantsRes = await client.GET("/user/me/grants", {});

    if (grantsRes.error) {
      const status = grantsRes.response.status;

      if (status === 401 || status === 403) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      console.error("Failed to fetch grants:", grantsRes.error);
      return {
        props: {
          error: `権限情報の取得に失敗しました (HTTP ${status})`,
          place,
          users: [],
        },
      };
    }

    const grants = Array.from(
      new Set(
        (grantsRes.data?.grants ?? []).map((grant) => grant.trim()).filter((grant) => grant !== ""),
      ),
    );

    if (!grants.includes(GRANT_INFRA)) {
      return { notFound: true };
    }

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

      console.error("Failed to fetch current users:", activityRes.error);
      return {
        props: {
          error: `在室情報の取得に失敗しました (HTTP ${status})`,
          place,
          users: [],
        },
      };
    }

    if (!activityRes.data) {
      return {
        props: {
          error: "在室情報の取得に失敗しました",
          place,
          users: [],
        },
      };
    }

    return {
      props: {
        error: null,
        place,
        users: activityRes.data.users ?? [],
      },
    };
  } catch (error) {
    console.error("Failed to fetch current activity users:", error);
    return {
      props: {
        error: "在室情報の取得に失敗しました",
        place,
        users: [],
      },
    };
  }
};

const AdminActivityPage = ({
  users,
  place,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const handlePlaceChange = (newPlace: string) => {
    void router.push({
      pathname: "/admin/activity",
      query: { place: newPlace },
    });
  };

  return (
    <>
      <PageHead title="[管理者用] 強制チェックアウト" />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-start" width="100%">
          <ButtonLink href="/admin" startIcon={<ArrowBack />} variant="text">
            管理者用ポータルに戻る
          </ButtonLink>
        </Stack>

        <Stack spacing={2}>
          <Stack
            direction={{ sm: "row", xs: "column" }}
            justifyContent="space-between"
            alignItems={{ sm: "center", xs: "stretch" }}
            spacing={2}
          >
            <Stack spacing={0.5}>
              <Heading level={2}>強制チェックアウト</Heading>
              <Typography color="text.secondary">
                在室中の部員を選択して、管理者権限で強制退室させます。
              </Typography>
            </Stack>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>場所</InputLabel>
              <Select
                value={place}
                label="場所"
                onChange={(e) => handlePlaceChange(e.target.value)}
              >
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
              {error}
            </Typography>
          )}

          {users.length > 0 ? (
            <Paper variant="outlined">
              <List disablePadding>
                {users.map((user, index) => (
                  <Fragment key={user.userId}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      component="li"
                      sx={{
                        alignItems: { sm: "center", xs: "flex-start" },
                        flexDirection: { sm: "row", xs: "column" },
                        gap: 2,
                        py: 1.5,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ flex: 1, width: "100%" }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.iconUrl || undefined} sx={{ height: 44, width: 44 }}>
                            {user.username.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={
                            user.shortIntroduction ||
                            `${dayjs(user.checkedInAt).format("HH:mm")}から在室中`
                          }
                        />
                      </Stack>
                      <Stack
                        direction={{ sm: "row", xs: "column" }}
                        spacing={2}
                        alignItems={{ sm: "center", xs: "stretch" }}
                        sx={{ width: { sm: "auto", xs: "100%" } }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ minWidth: 64, textAlign: { sm: "right", xs: "left" } }}
                        >
                          {dayjs(user.checkedInAt).format("HH:mm")}~
                        </Typography>
                        <ForceCheckoutButton
                          place={place}
                          userId={user.userId}
                          username={user.username}
                        />
                      </Stack>
                    </ListItem>
                  </Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            !error && (
              <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">現在この場所にいる人はいません</Typography>
              </Paper>
            )
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default AdminActivityPage;
