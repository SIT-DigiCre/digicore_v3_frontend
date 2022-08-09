import { Container, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { useDarkMode } from "../../hook/useDarkMode";
import { DarkMode } from "../../interfaces";

const SettingPage = () => {
  const { isDarkMode, setDarkMode, currentMode } = useDarkMode();
  return (
    <Container>
      <PageHead title="ユーザー設定" />
      <Breadcrumbs links={[{ text: "Home", href: "/" }, { text: "Setting" }]} />
      <h1>ユーザー設定</h1>
      <hr />
      <Grid>
        <h3>ダークモード設定</h3>
        <p>この設定はブラウザに保存されます</p>
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
      </Grid>
    </Container>
  );
};

export default SettingPage;
