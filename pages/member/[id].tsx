import type { InferGetServerSidePropsType, NextApiRequest } from "next";

import { ArrowBack, School as SchoolIcon } from "@mui/icons-material";
import { Avatar, Box, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import MarkdownView from "../../components/Markdown/MarkdownView";
import { createServerApiClient } from "../../utils/fetch/client";

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function normalizeQueryParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export const getServerSideProps = async ({
  params,
  req,
  query,
}: {
  params: { id?: string };
  req: NextApiRequest;
  query: Record<string, string | string[] | undefined>;
}) => {
  const idParam = params?.id;
  const userId = typeof idParam === "string" ? idParam : "";
  if (!userId) return { notFound: true };

  const client = createServerApiClient(req);

  try {
    const [profileRes, introductionRes] = await Promise.all([
      client.GET("/user/{userId}", {
        params: {
          path: {
            userId,
          },
        },
      }),
      client.GET("/user/{userId}/introduction", {
        params: {
          path: {
            userId,
          },
        },
      }),
    ]);

    if (!profileRes.data) {
      return { notFound: true };
    }

    const seed = normalizeQueryParam(query.seed);
    const page = normalizeQueryParam(query.page);

    return {
      props: {
        profile: profileRes.data,
        introduction: introductionRes.data?.introduction || null,
        seed: seed ?? null,
        page: page ?? null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return { notFound: true };
  }
};

const UserProfilePage = ({ profile, introduction, seed, page }: PageProps) => {
  const backUrl =
    seed != null && seed !== "" ? `/member/?seed=${seed}&page=${page ?? "1"}` : "/member/";

  return (
    <>
      <PageHead title={profile.username} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <ButtonLink href={backUrl} startIcon={<ArrowBack />} variant="text">
            部員一覧に戻る
          </ButtonLink>

          <Box sx={{ mb: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box display="flex" justifyContent="center">
                  <Avatar
                    src={profile.iconUrl}
                    alt={`${profile.username}のアイコン`}
                    sx={{
                      width: { xs: 120, sm: 150 },
                      height: { xs: 120, sm: 150 },
                      border: 3,
                      borderColor: "primary.main",
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <Box textAlign={{ xs: "center", sm: "left" }}>
                  <Heading level={2}>{profile.username}</Heading>

                  {profile.shortIntroduction && (
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      {profile.shortIntroduction}
                    </Typography>
                  )}

                  <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                    <Chip
                      icon={<SchoolIcon />}
                      label={`${profile.schoolGrade}年生`}
                      color="primary"
                      variant="outlined"
                      size="medium"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "medium",
                        px: 1,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {introduction && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: "bold" }}
              >
                詳細な自己紹介
              </Typography>
              <Box
                sx={{
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    color: "primary.main",
                    fontWeight: "bold",
                  },
                  "& p": {
                    lineHeight: 1.8,
                    mb: 2,
                  },
                  "& ul, & ol": {
                    pl: 3,
                  },
                  "& blockquote": {
                    borderLeft: 4,
                    borderColor: "primary.main",
                    pl: 2,
                    ml: 0,
                    fontStyle: "italic",
                    backgroundColor: "grey.50",
                    py: 1,
                  },
                }}
              >
                <MarkdownView md={introduction} />
              </Box>
            </Paper>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default UserProfilePage;
