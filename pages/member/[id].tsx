import { GetServerSideProps } from "next";

import { School as SchoolIcon } from "@mui/icons-material";
import { Avatar, Box, Chip, Container, Grid, Paper, Typography } from "@mui/material";

import MarkdownView from "../../components/Common/MarkdownView";
import { useIntroduction } from "../../hook/profile/useIntroduction";
import { useProfile } from "../../hook/profile/useProfile";

type Props = {
  id: string;
};
const UserProfilePage = ({ id }: Props) => {
  const profile = useProfile(id);
  const introMd = useIntroduction(id);

  if (!profile || introMd === undefined) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6" color="text.secondary">
            読み込み中...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                }}
              >
                {profile.username}
              </Typography>

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

      {introMd && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
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
            <MarkdownView md={introMd} />
          </Box>
        </Paper>
      )}
    </Container>
  );
};
export default UserProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    return { props: { id } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
