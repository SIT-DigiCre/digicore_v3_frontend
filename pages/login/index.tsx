import { Google } from "@mui/icons-material";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

import PageHead from "../../components/Common/PageHead";
import { useLoginData } from "../../hook/useLoginData";
const LoginPage = () => {
  const { loginUrl } = useLoginData();
  return (
    <>
      <PageHead title="Login" />
      <Container>
        <Stack alignItems="center" mt={10}>
          <Typography variant="h4">DigiCore v3</Typography>
          <Box my={10}>
            <Button variant="contained" startIcon={<Google />} href={loginUrl}>
              ログインする
            </Button>
          </Box>
          <Box>
            <Typography>
              Googleアカウントはshibaura-it.ac.jpドメインのもののみ使用できます。
            </Typography>
            <Typography>
              デジクリに入部希望の方は<a href="https://twitter.com/sitdigicre">公式Twitter</a>
              にご相談下さい。
            </Typography>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default LoginPage;
