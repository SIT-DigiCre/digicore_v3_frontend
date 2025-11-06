import { useState } from "react";

import { CheckCircle, CopyAll } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

import Heading from "../Common/Heading";

const TransferClubFeeView = () => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <>
      <Stack direction="row" justifyContent="center">
        <Button
          startIcon={isCopied ? <CheckCircle /> : <CopyAll />}
          color="primary"
          variant="contained"
          onClick={() => {
            navigator.clipboard
              .writeText(
                "銀行: ゆうちょ銀行\n記号: 10370\n番号: 81757581\n店番: 038\n口座番号: 8175758\n預金種目: 普通預金\n金額: 手数料抜で2000円",
              )
              .then(() => {
                setIsCopied(true);
              });
          }}
        >
          口座情報をコピーする
        </Button>
      </Stack>
      <TableContainer component={Paper} sx={{ maxWidth: 300, my: 2, mx: "auto" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>銀行</TableCell>
              <TableCell>ゆうちょ銀行</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>記号</TableCell>
              <TableCell>10370</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>番号</TableCell>
              <TableCell>81757581</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>店番</TableCell>
              <TableCell>038</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>口座番号</TableCell>
              <TableCell>8175758</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>預金種目</TableCell>
              <TableCell>普通預金</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>金額</TableCell>
              <TableCell>手数料抜2000円</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box>
        <Heading level={3}>振込方法と手数料</Heading>
        <Stack spacing={2}>
          <Box>
            <Heading level={4}>ゆうちょ銀行以外の口座から振り込む場合</Heading>
            <Typography>
              各銀行の窓口やATMからなど、それぞれの方法で入金してください。手数料は各銀行・各方法によって異なります。
            </Typography>
          </Box>
          <Box>
            <Heading level={4}>現金で振り込む場合</Heading>
            <Typography>お近くの銀行のATMや、窓口から振り込んでください。</Typography>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default TransferClubFeeView;
