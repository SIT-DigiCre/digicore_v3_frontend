import type { InferGetServerSidePropsType, NextApiRequest } from "next";
import { useState, useEffect } from "react";

import {
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import PageHead from "../../components/Common/PageHead";
import Pagination from "../../components/Common/Pagination";
import { MemberFilterForm } from "../../components/Member/MemberFilterForm";
import { useUserSearch } from "../../hook/user/useUserSearch";
import { createServerApiClient } from "../../utils/fetch/client";

const ITEMS_PER_PAGE = 100;

export const getServerSideProps = async ({
  req,
  query,
}: {
  req: NextApiRequest;
  query: { seed?: string; page?: string };
}) => {
  // seedパラメータがない場合はリダイレクト
  if (!query.seed) {
    const seed = Math.floor(Math.random() * 100);
    return {
      redirect: {
        destination: `/member/?seed=${seed}&page=1`,
        permanent: false,
      },
    };
  }

  const client = createServerApiClient(req);
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const seed = parseInt(query.seed as string, 10);

  try {
    const usersRes = await client.GET("/user", {
      params: {
        query: {
          offset,
          seed,
        },
      },
    });

    if (!usersRes.data || !usersRes.data.users) {
      return {
        props: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          seed,
          users: [],
        },
      };
    }

    const users = usersRes.data.users;
    const hasNextPage = users.length === ITEMS_PER_PAGE;
    const hasPreviousPage = page > 1;

    return {
      props: {
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
        seed,
        users,
      },
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return {
      props: {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        seed,
        users: [],
      },
    };
  }
};

const UserIndexPage = ({
  users,
  currentPage,
  hasNextPage,
  hasPreviousPage,
  seed,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const { searchResults, searchUsers } = useUserSearch();

  useEffect(() => {
    if (keyword.length === 0) return;

    const timer = setTimeout(() => {
      searchUsers(keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, searchUsers]);

  const displayUsers = keyword.length >= 1 ? searchResults : users;

  return (
    <>
      <PageHead title="部員一覧" />
      <Stack spacing={2}>
        <MemberFilterForm
          keyword={keyword}
          onKeywordChange={(value) => {
            setKeyword(value);
          }}
        />
        {displayUsers && displayUsers.length > 0 ? (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>名前</TableCell>
                    <TableCell>自己紹介</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayUsers.map((userProfile) => (
                    <TableRow key={userProfile.userId}>
                      <TableCell>
                        <Avatar sx={{ height: 40, width: 40 }}>
                          {userProfile.iconUrl && (
                            <Image
                              src={userProfile.iconUrl}
                              alt={userProfile.username}
                              width={40}
                              height={40}
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/member/${userProfile.userId}?seed=${seed}&page=${currentPage}`}
                        >
                          {userProfile.username}
                        </Link>
                      </TableCell>
                      <TableCell>{userProfile.shortIntroduction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {keyword.length === 0 && (
              <Stack alignItems="center">
                <Pagination
                  page={currentPage}
                  hasPreviousPage={hasPreviousPage}
                  hasNextPage={hasNextPage}
                  onChange={(page) =>
                    router.push({
                      pathname: router.pathname,
                      query: { page, seed },
                    })
                  }
                />
              </Stack>
            )}
          </>
        ) : (
          <Typography my={2}>一致する部員がいません</Typography>
        )}
      </Stack>
    </>
  );
};

export default UserIndexPage;
