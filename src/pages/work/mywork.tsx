import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { Add, FilterList } from "@mui/icons-material";
import { Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import Pagination from "../../components/Common/Pagination";
import { WorkCard } from "../../components/Work/WorkCard";
import { createServerApiClient } from "../../utils/fetch/client";

const ITEMS_PER_PAGE = 10;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const rawPage = query.page ? parseInt(query.page as string, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    const meRes = await client.GET("/user/me");
    if (!meRes.data || !meRes.data.userId) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const userId = meRes.data.userId;

    const worksRes = await client.GET("/work/work", {
      params: {
        query: {
          authorId: userId,
          offset,
        },
      },
    });

    if (!worksRes.data || !worksRes.data.works) {
      return {
        props: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          works: [],
        },
      };
    }

    const works = worksRes.data.works;
    const hasNextPage = works.length === ITEMS_PER_PAGE;
    const hasPreviousPage = page > 1;

    return {
      props: {
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
        works,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

const MyWorkPage = ({
  works,
  currentPage,
  hasNextPage,
  hasPreviousPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <PageHead title="自分の作品" />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink href="/work" startIcon={<FilterList />} variant="text">
          作品一覧を見る
        </ButtonLink>
        <ButtonLink href="/work/new" startIcon={<Add />}>
          投稿する
        </ButtonLink>
      </Stack>
      <Stack spacing={2}>
        <Grid container>
          {works && works.length > 0 ? (
            works.map((work) => <WorkCard key={work.workId} work={work} />)
          ) : (
            <Typography my={2}>
              作品が登録されていません。
              <Link href="/work/new">新しい作品を投稿</Link>してみましょう！
            </Typography>
          )}
        </Grid>
        {works && works.length > 0 && (
          <Stack alignItems="center">
            <Pagination
              page={currentPage}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              onChange={(page) =>
                router.push({
                  pathname: router.pathname,
                  query: { page },
                })
              }
            />
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default MyWorkPage;
