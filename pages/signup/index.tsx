import Image from "next/image";

import { Google } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { useRegisterData } from "../../hook/useRegisterData";

const RegisterPage = () => {
  const { registerUrl } = useRegisterData();
  return (
    <>
      <PageHead title="登録" />
      <Stack alignItems="center" mt={20}>
        <Image
          src="/image/digicre-logo.webp"
          alt="デジクリ Digital Creation Circle"
          width={333}
          height={111}
        />
        <Heading level={2}>デジコア登録ページ</Heading>
        <Typography variant="body1" sx={{ mb: 4 }}>
          デジクリの入部もこちらからできます
        </Typography>
        <Box my={10}>
          <Button variant="contained" startIcon={<Google aria-hidden />} href={registerUrl}>
            大学Googleアカウントで登録
          </Button>
        </Box>
        <Box>
          <Typography>
            芝浦工業大学より支給されているshibaura-it.ac.jpのドメインでのみ登録が可能です。
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default RegisterPage;
