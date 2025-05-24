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
        <Stack mt={30} gap={10}>
          <Box textAlign="center">
            <Button variant="contained" startIcon={<Google />} href={loginUrl}>
              Googleログイン
            </Button>
          </Box>
          <Typography textAlign="center">
            Googleアカウントはshibaura-it.ac.jpドメインのもののみ使用できます
          </Typography>
          <Typography textAlign="center">
            デジクリに入部希望の方は<a href="https://twitter.com/sitdigicre">公式Twitter</a>
            にご相談下さい
          </Typography>
        </Stack>
      </Container>
    </>
  );
};

export default LoginPage;
