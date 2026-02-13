import Link from "next/link";

import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import type { components } from "../../utils/fetch/api.d.ts";

type User = components["schemas"]["ResGetActivityPlacePlaceCurrentObjectUser"];

type CurrentUsersListProps = {
  users: User[];
};

const CurrentUsersList = ({ users }: CurrentUsersListProps) => {
  if (users.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">現在この場所にいる人はいません</Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined">
      <List disablePadding>
        {users.map((user, index) => (
          <Stack key={user.userId}>
            {index > 0 && <Divider component="li" />}
            <ListItem sx={{ py: 1.5 }}>
              <ListItemAvatar>
                <Avatar src={user.iconUrl || undefined} sx={{ height: 44, width: 44 }}>
                  {user.username.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    href={`/member/${user.userId}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Typography
                      component="span"
                      fontWeight="medium"
                      sx={{ "&:hover": { textDecoration: "underline" } }}
                    >
                      {user.username}
                    </Typography>
                  </Link>
                }
                secondary={user.shortIntroduction || undefined}
              />
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {dayjs(user.checkedInAt).format("HH:mm")}~
              </Typography>
            </ListItem>
          </Stack>
        ))}
      </List>
    </Paper>
  );
};

export default CurrentUsersList;
