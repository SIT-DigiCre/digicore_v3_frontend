import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import { ACTIVITY_PLACES } from "@/interfaces/activity";

import EditRecordDialog from "./EditRecordDialog";

import type { ActivityRecord } from "@/interfaces/activity";

type ActivityRecordTableProps = {
  records: ActivityRecord[];
  canEdit: boolean;
};

const formatDuration = (checkedInAt: string, checkedOutAt: string) => {
  const diffMinutes = dayjs(checkedOutAt).diff(dayjs(checkedInAt), "minute");
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  }
  return `${minutes}分`;
};

const isEdited = (record: ActivityRecord) => {
  return (
    record.checkedInAt !== record.initialCheckedInAt ||
    record.checkedOutAt !== record.initialCheckedOutAt
  );
};

const isToday = (record: ActivityRecord) => {
  return dayjs(record.checkedInAt).isSame(dayjs(), "day");
};

const ActivityRecordTable = ({ records, canEdit }: ActivityRecordTableProps) => {
  const [editTarget, setEditTarget] = useState<ActivityRecord | null>(null);

  if (records.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">入室記録がありません</Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>場所</TableCell>
              <TableCell>チェックイン</TableCell>
              <TableCell>チェックアウト</TableCell>
              <TableCell>滞在時間</TableCell>
              {canEdit && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => {
              const editable = isToday(record);
              return (
                <TableRow key={record.recordId}>
                  <TableCell>{ACTIVITY_PLACES[record.place] ?? record.place}</TableCell>
                  <TableCell>
                    {dayjs(record.checkedInAt).format("YYYY/MM/DD HH:mm")}
                    {isEdited(record) && (
                      <Chip label="編集済み" size="small" variant="outlined" sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkedOutAt ? (
                      dayjs(record.checkedOutAt).format("YYYY/MM/DD HH:mm")
                    ) : (
                      <Chip label="在室中" size="small" color="success" />
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkedOutAt
                      ? formatDuration(record.checkedInAt, record.checkedOutAt)
                      : "-"}
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      {editable ? (
                        <IconButton size="small" onClick={() => setEditTarget(record)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Tooltip title="当日の記録のみ編集できます">
                          <span>
                            <IconButton size="small" disabled>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {editTarget && (
        <EditRecordDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          recordId={editTarget.recordId}
          checkedInAt={editTarget.checkedInAt}
          checkedOutAt={editTarget.checkedOutAt}
        />
      )}
    </>
  );
};

export default ActivityRecordTable;
