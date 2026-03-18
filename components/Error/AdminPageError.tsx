import Link from "next/link";

import { Stack, Typography } from "@mui/material";

import Heading from "@/components/Common/Heading";

type AdminPageErrorProps = {
  message: string;
  title: string;
};

const AdminPageError = ({ message, title }: AdminPageErrorProps) => {
  return (
    <Stack spacing={2}>
      <Heading level={2}>{title}</Heading>
      <Typography>
        {message} <Link href="/">トップページ</Link>
      </Typography>
    </Stack>
  );
};

export default AdminPageError;
