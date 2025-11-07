import Image from "next/image";

import { Google } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { useLoginData } from "../../hook/useLoginData";
const LoginPage = () => {
  const { loginUrl } = useLoginData();

  return (
    <>
      <PageHead title="ログイン" />
      <Stack alignItems="center" mt={20}>
        <Image
          src="/image/digicre-logo.webp"
          alt="デジクリ Digital Creation Circle"
          width={333}
          height={111}
        />
        <Heading level={2}>DigiCore v3</Heading>
        <Box my={10}>
          <Button variant="contained" startIcon={<Google aria-label="Google" />} href={loginUrl}>
            ログインする
          </Button>
        </Box>
        <Box>
          <Typography>
            Googleアカウントはshibaura-it.ac.jpドメインのもののみ使用できます。
          </Typography>
          <Typography>
            デジクリに入部希望の方は contact@digicre.net までメールするか、
            <a href="https://twitter.com/sitdigicre" target="_blank">
              公式Twitter
            </a>
            にご相談下さい。
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default LoginPage;
