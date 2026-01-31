import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { useDarkModeContext } from "../../components/DarkModeContext";
import { useAuthState } from "../../hook/useAuthState";
import { DarkMode } from "../../interfaces";

const SettingPage = () => {
  const { setDarkMode, currentMode } = useDarkModeContext();
  const { logout } = useAuthState();

  return (
    <>
      <PageHead title="設定" />
      <Stack spacing={2}>
        <Box>
          <Heading level={2}>ダークモード</Heading>
          <FormControl sx={{ marginTop: 1 }}>
            <InputLabel id="demo-simple-select-label">モード</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currentMode}
              label="モード"
              onChange={(e) => {
                setDarkMode(e.target.value as DarkMode);
              }}
            >
              <MenuItem value={"os"}>OSの設定に合わせる</MenuItem>
              <MenuItem value={"dark"}>ダークモード</MenuItem>
              <MenuItem value={"light"}>ライトモード</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Heading level={2}>ログアウト </Heading>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              logout();
            }}
          >
            ログアウトする
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default SettingPage;
