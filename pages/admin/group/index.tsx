import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { Add, ArrowBack } from "@mui/icons-material";
import {
  Button,
  Chip,
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
import NewGroupDialog from "../../../components/Group/NewGroupDialog";
import { createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = createServerApiClient(req);

  try {
    const groupsRes = await client.GET("/group", {
      params: {
        query: {
          offset: 0,
        },
      },
    });

    if (!groupsRes.data || !groupsRes.data.groups) {
      return { props: { groups: [] } };
    }

    return { props: { groups: groupsRes.data.groups } };
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return { props: { groups: [] } };
  }
};

const AdminGroupIndexPage = ({
  groups,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);

  const handleRefresh = () => {
    router.replace(router.asPath);
  };

  return (
    <>
      <PageHead title="[管理者用] グループ一覧" />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-start" width="100%">
          <ButtonLink href="/admin" startIcon={<ArrowBack />} variant="text">
            管理者用ポータルに戻る
          </ButtonLink>
        </Stack>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            width="100%"
          >
            <Heading level={2}>グループ一覧</Heading>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsNewGroupDialogOpen(true)}
            >
              新規グループ作成
            </Button>
          </Stack>

          {groups && groups.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>グループ名</TableCell>
                    <TableCell>参加可否</TableCell>
                    <TableCell>あなた</TableCell>
                    <TableCell>メンバー数</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.groupId}>
                      <TableCell>
                        <Link href={`/admin/group/${group.groupId}`}>{group.name}</Link>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={group.joinable ? "参加可能" : "参加不可"}
                          color={group.joinable ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={group.joined ? "参加中" : "未参加"}
                          color={group.joined ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{group.userCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography my={2}>グループがありません</Typography>
          )}
        </Stack>
      </Stack>

      <NewGroupDialog
        open={isNewGroupDialogOpen}
        onClose={() => setIsNewGroupDialogOpen(false)}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default AdminGroupIndexPage;
