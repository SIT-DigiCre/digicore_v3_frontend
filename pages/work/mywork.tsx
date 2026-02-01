import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { Add, FilterList } from "@mui/icons-material";
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
import { WorkDetail } from "../../interfaces/work";
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
            <>
              {works.map((w) => (
                <Grid key={w.workId} size={[12, 6, 4]} sx={{ padding: 0.5 }}>
                  <Card
                    sx={{
                      color: "inherit",
                      display: "inline-block",
                      height: "100%",
                      m: 0.5,
                      textDecoration: "none",
                      width: "100%",
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
                      <WorkCardPreview description={w.description} files={w.files} />
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

export default MyWorkPage;
