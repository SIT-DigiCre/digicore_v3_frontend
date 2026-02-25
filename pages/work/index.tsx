import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { FilterList } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Grid, Stack, Typography } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import Pagination from "../../components/Common/Pagination";
import { WorkCard } from "../../components/Work/WorkCard";
import { WorkDetail } from "../../interfaces/work";
import { createServerApiClient } from "../../utils/fetch/client";

const ITEMS_PER_PAGE = 10;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const rawPage = query.page ? parseInt(query.page as string, 10) : 1;
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    const worksRes = await client.GET("/work/work", {
      params: {
        query: {
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

    const workDetails = await Promise.all(
      works.map(async (work) => {
        const detailRes = await client.GET("/work/work/{workId}", {
          params: {
            path: {
              workId: work.workId,
            },
          },
        });
        if (detailRes.data) {
          return detailRes.data;
        }
        return {
          ...work,
          description: "",
          files: [],
        } as WorkDetail;
      }),
    );

    return {
      props: {
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
        works: workDetails,
      },
    };
  } catch {
    return {
      props: {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        works: [],
      },
    };
  }
};

const WorkIndexPage = ({
  works,
  currentPage,
  hasNextPage,
  hasPreviousPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <PageHead title="作品一覧" />
      <Stack spacing={2}>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <ButtonLink href="/work/mywork" startIcon={<FilterList />} variant="text">
            自分の作品を見る
          </ButtonLink>
          <ButtonLink href="/work/new" startIcon={<AddIcon />}>
            投稿する
          </ButtonLink>
        </Stack>
        <Grid container>
          {works && works.length > 0 ? (
            works.map((work) => (
              <WorkCard key={work.workId} work={work} />
            ))
          ) : (
            <Typography my={2}>Workがねぇ...</Typography>
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

export default WorkIndexPage;
