import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import Heading from "../../components/Common/Heading";
import PageHead from "../../components/Common/PageHead";
import { useDarkMode } from "../../hook/useDarkMode";
import { DarkMode } from "../../interfaces";

const SettingPage = () => {
  const { setDarkMode, currentMode } = useDarkMode();

  return (
    <>
      <PageHead title="ユーザー設定" />
      <Stack spacing={2}>
        <Heading level={3}>ダークモード</Heading>
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
      </Stack>
    </>
  );
};

export default SettingPage;
