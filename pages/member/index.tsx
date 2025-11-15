import {
  Avatar,
  Button,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import PageHead from "../../components/Common/PageHead";
import { useUserProfiles } from "../../hook/user/useUserProfiles";

const UserIndexPage = () => {
  const { userProfiles, requestMoreProfiles, isOver } = useUserProfiles();

  return (
    <>
      <PageHead title="部員一覧" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>名前</TableCell>
              <TableCell>自己紹介</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userProfiles.map((userProfile) => (
              <TableRow key={userProfile.userId}>
                <TableCell>
                  <Avatar src={userProfile.iconUrl} sx={{ width: 40, height: 40 }} />
                </TableCell>
                <TableCell>
                  <Link href={`/member/${userProfile.userId}`}>{userProfile.username}</Link>
                </TableCell>
                <TableCell>{userProfile.shortIntroduction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} my={2}>
        <Button variant="contained" onClick={() => requestMoreProfiles()} disabled={isOver}>
          もっと見る
        </Button>
      </Stack>
    </>
  );
};

export default UserIndexPage;
