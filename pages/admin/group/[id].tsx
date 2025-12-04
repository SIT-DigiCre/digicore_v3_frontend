import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Delete, PersonAdd } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import Heading from "../../../components/Common/Heading";
import PageHead from "../../../components/Common/PageHead";
import AddUserDialog from "../../../components/Group/AddUserDialog";
import DeleteUserDialog from "../../../components/Group/DeleteUserDialog";
import { createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps = async ({ req, params }) => {
  const client = createServerApiClient(req);
  const groupId = params?.id as string;

  if (!groupId) {
    return { notFound: true };
  }

  try {
    const groupRes = await client.GET("/group/{groupId}", {
      params: {
        path: {
          groupId,
        },
      },
    });

    if (!groupRes.data) {
      return { notFound: true };
    }

    return { props: { group: groupRes.data } };
  } catch (error) {
    console.error("Failed to fetch group:", error);
    return { notFound: true };
  }
};

const AdminGroupDetailPage = ({
  group,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [deleteUserDialogState, setDeleteUserDialogState] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({
    open: false,
    userId: "",
    userName: "",
  });

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteUserDialogState({
      open: true,
      userId,
      userName,
    });
  };

  return (
    <>
      <PageHead title={`グループ: ${group.name}`} />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Heading level={2}>{group.name}</Heading>
            <Typography variant="body2" color="text.secondary">
              {group.description}
            </Typography>
          </Stack>
          {group.joined && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setIsAddUserDialogOpen(true)}
            >
              メンバーを追加
            </Button>
          )}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={group.joinable ? "参加可能" : "参加不可"}
            color={group.joinable ? "success" : "default"}
            size="small"
          />
          <Chip
            label={group.joined ? "参加中" : "未参加"}
            color={group.joined ? "primary" : "default"}
            size="small"
          />
          {(group as { isAdminGroup?: boolean }).isAdminGroup && (
            <Chip label="管理者グループ" color="warning" size="small" />
          )}
          <Typography variant="body2" color="text.secondary">
            メンバー数: {group.userCount}
          </Typography>
        </Stack>

        <Heading level={3}>メンバー一覧</Heading>

        {group.users && group.users.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>名前</TableCell>
                  {group.joined && <TableCell>操作</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {group.users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <Avatar src={user.userIcon} sx={{ width: 40, height: 40 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    {group.joined && (
                      <TableCell>
                        <IconButton
                          aria-label="メンバーを削除"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user.userId, user.name)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography my={2}>メンバーがいません</Typography>
        )}
      </Stack>

      <AddUserDialog
        open={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onSuccess={() => router.reload()}
        groupId={group.groupId}
      />

      <DeleteUserDialog
        open={deleteUserDialogState.open}
        onClose={() =>
          setDeleteUserDialogState({
            open: false,
            userId: "",
            userName: "",
          })
        }
        onSuccess={() => router.reload()}
        groupId={group.groupId}
        userId={deleteUserDialogState.userId}
        userName={deleteUserDialogState.userName}
      />
    </>
  );
};

export default AdminGroupDetailPage;
