import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";


import { useMattermostRegister } from "../../hook/mattermost/useMattermostRegister";
import { useAuthState } from "../../hook/useAuthState";
import { MattermostRegistrationRequest } from "../../interfaces/api";
import Heading from "../Common/Heading";

type Props = {
  onRegistered: () => void;
};

export const MattermostRegister = ({ onRegistered }: Props) => {
  const { authState } = useAuthState();
  const userProfile = authState.user;
  const { register } = useMattermostRegister();
  const [registrationForm, setRegistrationForm] = useState<MattermostRegistrationRequest>({
    nickname: "",
    password: "",
    username: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [sending, setSending] = useState(false);

  // validator
  const [usernameError, setUsernameError] = useState("");
  const validateUsername = (username: string): string | true => {
    const usernameRegExp = /^([a-z]|\d|\.|-|_)+$/;
    if (username.length === 0) {
      return "ユーザ名は必須です";
    } else if (!usernameRegExp.test(username)) {
      return "ユーザ名に利用できない文字が入っています";
    } else {
      return true;
    }
  };
  const [passwordError, setPasswordError] = useState("");
  const validatePassword = (password: string): string | true => {
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/;
    if (password.length < 8 || 64 < password.length) {
      return "パスワードの長さが適切ではありません";
    } else if (!passwordRegExp.test(password)) {
      return "パスワードには英小文字、英大文字、数字、記号を含めてください";
    } else {
      return true;
    }
  };

  const readyToSend =
    validateUsername(registrationForm.username) === true &&
    validatePassword(registrationForm.password) === true &&
    registrationForm.password === passwordConfirm;

  const onRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      setSending(true);
      const res = await register(registrationForm);
      setSending(false);
      if (res) {
        onRegistered();
      }
    })();
  };
  useEffect(() => {
    if (userProfile) {
      setRegistrationForm({
        ...registrationForm,
        username: userProfile.studentNumber,
        nickname: userProfile.username,
      });
    }
  }, [userProfile, registrationForm]);
  return (
    <Stack spacing={4}>
      <Heading level={2}>Mattermost</Heading>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="center">
          <Image alt="Mattermost" src="/image/mattermost_icon.png" width={100} height={100} />
        </Stack>
        <Box>
          <Typography>
            <Link href="https://mattermost.com/" target="_blank" rel="noopener noreferrer">
              Mattermost
            </Link>
            はデジクリ内で定例会やイベントの連絡、日々の交流などに利用しているコミュニケーションツールです。
          </Typography>
          <Typography>
            Discordとは異なり好きなチャンネルに参加したり、抜けたりすることができるため、デジクリではこの2つを使い分けています。
          </Typography>
          <Typography>アカウント作成にあたり、必要な情報を記入してください。</Typography>
        </Box>
      </Stack>
      <Box>
        <Heading level={4}>Mattermost 公式による注意事項</Heading>
        <Typography>
          アカウントを作成し Mattermost を利用する前に{" "}
          <a href="https://mattermost.com/terms-of-use/" target="_blank" rel="noreferrer">
            利用規約
          </a>{" "}
          と{" "}
          <a href="https://mattermost.com/privacy-policy/" target="_blank" rel="noreferrer">
            プライバシーポリシー
          </a>{" "}
          に同意してください。
        </Typography>
      </Box>
      <Alert severity="info">
        <Typography>
          アカウント登録にお困りの際は{" "}
          <a href="https://forms.gle/MQicA1No8LSZPe5QA" target="_blank" rel="noreferrer">
            デジクリインフラサポート・依頼フォーム
          </a>{" "}
          からご相談ください！
        </Typography>
      </Alert>
      <form onSubmit={onRegister}>
        <Heading level={4}>アカウント登録</Heading>
        <FormControl fullWidth error={0 < usernameError.length}>
          <TextField
            label="ユーザーID"
            variant="outlined"
            required
            helperText="英小文字、数字、ピリオド、ダッシュ、アンダースコアが利用できます"
            margin="normal"
            fullWidth
            onChange={(e) => {
              const username = e.target.value;
              const validate = validateUsername(username);
              if (validate !== true) {
                setUsernameError(validate);
              } else {
                setUsernameError("");
              }
              const form = { ...registrationForm, username: username };
              setRegistrationForm(form);
            }}
            value={registrationForm.username}
          />
          {0 < usernameError.length ? <FormHelperText>{usernameError}</FormHelperText> : null}
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="ニックネーム"
            variant="outlined"
            helperText="メッセージの名前欄などに表示される名前です"
            margin="normal"
            fullWidth
            onChange={(e) => {
              const form = { ...registrationForm, nickname: e.target.value };
              setRegistrationForm(form);
            }}
            value={registrationForm.nickname}
          />
        </FormControl>
        <FormControl fullWidth error={0 < passwordError.length}>
          <TextField
            label="パスワード"
            variant="outlined"
            type="password"
            required
            helperText="英小文字、英大文字、数字、記号を含む8〜64文字にしてください"
            margin="normal"
            fullWidth
            onChange={(e) => {
              const password = e.target.value;
              const validate = validatePassword(password);
              if (validate !== true) {
                setPasswordError(validate);
              } else {
                setPasswordError("");
              }
              const form = { ...registrationForm, password: password };
              setRegistrationForm(form);
            }}
            value={registrationForm.password}
          />
          {0 < passwordError.length ? <FormHelperText>{passwordError}</FormHelperText> : null}
        </FormControl>
        <FormControl fullWidth error={registrationForm.password !== passwordConfirm}>
          <TextField
            label="パスワード（確認）"
            variant="outlined"
            type="password"
            required
            helperText="確認のため、もう一度パスワードを入力してください"
            margin="normal"
            fullWidth
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
            }}
          />
          {registrationForm.password !== passwordConfirm ? (
            <FormHelperText>パスワードが一致していません</FormHelperText>
          ) : null}
        </FormControl>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" type="submit" disabled={!readyToSend || sending}>
            {sending ? "処理中" : "登録する"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
