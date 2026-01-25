import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { FilterList } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import ChipList from "../../components/Common/ChipList";
import PageHead from "../../components/Common/PageHead";
import Pagination from "../../components/Common/Pagination";
import { WorkCardPreview } from "../../components/Work/WorkCardPreview";
import { createServerApiClient } from "../../utils/fetch/client";

const ITEMS_PER_PAGE = 10;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);
  const page = query.page ? parseInt(query.page as string, 10) : 1;
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
          works: [],
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const works = worksRes.data.works;
    const hasNextPage = works.length === ITEMS_PER_PAGE;
    const hasPreviousPage = page > 1;

    return {
      props: {
        works,
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch {
    return {
      props: {
        works: [],
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
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
            <>
              {works.map((w) => (
                <Grid key={w.workId} size={[12, 6, 4]} sx={{ padding: 0.5 }}>
                  <Card
                    sx={{
                      width: "100%",
                      display: "inline-block",
                      m: 0.5,
                      height: "100%",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    component={Link}
                    href={`/work/${w.workId}`}
                    className="clickable-gray"
                  >
                    <CardHeader
                      title={w.name}
                      avatar={
                        <AvatarGroup>
                          {w.authors.map((a) => (
                            <Avatar key={a.userId} src={a.iconUrl} alt={a.username} />
                          ))}
                        </AvatarGroup>
                      }
                    ></CardHeader>
                    <CardContent>
                      <WorkCardPreview id={w.workId} />
                      {w.tags && <ChipList chipList={w.tags.map((t) => t.name)} />}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </>
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
