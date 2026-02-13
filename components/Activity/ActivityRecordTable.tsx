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
              <TableCell sx={{ minWidth: 80, whiteSpace: "nowrap" }}>場所</TableCell>
              <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>チェックイン</TableCell>
              <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>チェックアウト</TableCell>
              <TableCell sx={{ minWidth: 80, whiteSpace: "nowrap" }}>滞在時間</TableCell>
              {canEdit && <TableCell sx={{ minWidth: 56, whiteSpace: "nowrap" }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => {
              const editable = dayjs(record.checkedInAt).isSame(dayjs(), "day");
              return (
                <TableRow key={record.recordId}>
                  <TableCell sx={{ minWidth: 80, whiteSpace: "nowrap" }}>
                    {ACTIVITY_PLACES[record.place] ?? record.place}
                  </TableCell>
                  <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                    {dayjs(record.checkedInAt).format("YYYY/MM/DD HH:mm")}
                    {record.checkedInAt !== record.initialCheckedInAt && (
                      <Chip label="編集済み" size="small" variant="outlined" sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 140, whiteSpace: "nowrap" }}>
                    {record.checkedOutAt ? (
                      <>
                        {dayjs(record.checkedOutAt).format("YYYY/MM/DD HH:mm")}
                        {record.initialCheckedOutAt != null &&
                          record.checkedOutAt !== record.initialCheckedOutAt && (
                            <Chip label="編集済み" size="small" variant="outlined" sx={{ ml: 1 }} />
                          )}
                      </>
                    ) : (
                      <Chip label="在室中" size="small" color="success" />
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 80, whiteSpace: "nowrap" }}>
                    {record.checkedOutAt
                      ? formatDuration(record.checkedInAt, record.checkedOutAt)
                      : "-"}
                  </TableCell>
                  {canEdit && (
                    <TableCell sx={{ minWidth: 56, whiteSpace: "nowrap" }}>
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
