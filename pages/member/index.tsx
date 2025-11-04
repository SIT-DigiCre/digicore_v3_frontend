import {
  Avatar,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import PageHead from "../../components/Common/PageHead";
import { useUserProfiles } from "../../hook/user/useUserProfiles";

const gradeMap = {
  1: "学部1年",
  2: "学部2年",
  3: "学部3年",
  4: "学部4年",
  5: "修士1年",
  6: "修士2年",
  7: "博士1年",
  8: "博士2年",
  9: "博士3年",
};

const UserIndexPage = () => {
  const { userProfiles } = useUserProfiles();

  return (
    <>
      <PageHead title="部員一覧" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>名前</TableCell>
              <TableCell>学年</TableCell>
              <TableCell>学籍番号</TableCell>
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
                <TableCell>{gradeMap[userProfile.schoolGrade]}</TableCell>
                <TableCell>{userProfile.studentNumber}</TableCell>
                <TableCell>{userProfile.shortIntroduction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserIndexPage;
