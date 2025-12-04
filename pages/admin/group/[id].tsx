import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { ArrowBack, Delete, PersonAdd } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { ButtonLink } from "../../../components/Common/ButtonLink";
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
      <PageHead title={group.name} />
      <Stack spacing={2} alignItems="flex-start">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" width="100%">
          <ButtonLink href="/admin/group" startIcon={<ArrowBack />} variant="text">
            グループ一覧に戻る
          </ButtonLink>
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
        <Box>
          <Heading level={2}>グループ情報</Heading>
          <Typography color="text.secondary" mb={2}>
            {group.description}
          </Typography>
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
            <Typography color="text.secondary">{group.userCount}人が参加中</Typography>
          </Stack>
        </Box>
        <Box width="100%">
          <Heading level={2}>メンバー一覧</Heading>
          {group.users && group.users.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
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
                      <TableCell>
                        <Link href={`/member/${user.userId}`}>{user.name}</Link>
                      </TableCell>
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
        </Box>
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
