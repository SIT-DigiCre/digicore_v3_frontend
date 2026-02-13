import Link from "next/link";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from "@mui/material";

import PageHead from "@/components/Common/PageHead";
import { ACTIVITY_PLACES } from "@/interfaces/activity";

const ActivityIndexPage = () => {
  return (
    <>
      <PageHead title="入退室管理" />
      <Stack spacing={3}>
        <Paper variant="outlined">
          <List disablePadding>
            {Object.entries(ACTIVITY_PLACES).map(([placeId, label], index) => (
              <ListItem
                key={placeId}
                disablePadding
                divider={index < Object.keys(ACTIVITY_PLACES).length - 1}
              >
                <ListItemButton component={Link} href={`/activity/${placeId}`}>
                  <ListItemIcon>
                    <MeetingRoomIcon />
                  </ListItemIcon>
                  <ListItemText primary={label} />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Stack>
    </>
  );
};

export default ActivityIndexPage;
