import { useEffect, useState } from "react";

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
import Image from "next/image";
import Link from "next/link";

import Heading from "@/components/Common/Heading";
import { useErrorState } from "@/components/contexts/ErrorStateContext";
import { useAuthState } from "@/hook/useAuthState";
import { MattermostRegistrationRequest } from "@/interfaces/api";
import { apiClient } from "@/utils/fetch/client";

type Props = {
  onRegistered: () => void;
};

export const MattermostRegister = ({ onRegistered }: Props) => {
  const { authState } = useAuthState();
  const userProfile = authState.user;
  const { setNewError, removeError } = useErrorState();
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
      return "ユーザーIDは必須です";
    } else if (username.length < 3 || 22 < username.length) {
      return "ユーザーIDは3文字以上22文字以下にしてください";
    } else if (!usernameRegExp.test(username)) {
      return "ユーザーIDに利用できない文字が入っています";
    } else {
      return true;
    }
  };
  const [nicknameError, setNicknameError] = useState("");
  const validateNickname = (nickname: string): string | true => {
    if (nickname.length === 0) {
      return "ニックネームは必須です";
    } else if (nickname.length < 1 || 64 < nickname.length) {
      return "ニックネームは1文字以上64文字以下にしてください";
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
    validateNickname(registrationForm.nickname) === true &&
    validatePassword(registrationForm.password) === true &&
    registrationForm.password === passwordConfirm;

  const onRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      setSending(true);
      if (!authState.token) {
        setSending(false);
        return;
      }

      let res: { username: string } | false = false;

      try {
        const response = await apiClient.POST("/mattermost/create_user", {
          body: registrationForm,
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (response.error) {
          const apiErrorMessage =
            (response.error as any)?.message ?? "Mattermostユーザ登録に失敗しました";
          setNewError({
            message: apiErrorMessage,
            name: "mattermost-registration-error",
          });
        } else if (response.data) {
          removeError("mattermost-registration-error");
          res = response.data;
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
        setNewError({ message: errMsg, name: "mattermost-registration-error" });
      }

      setSending(false);
      if (res) {
        onRegistered();
      }
    })();
  };
  useEffect(() => {
    if (userProfile) {
      setRegistrationForm((currentForm) => ({
        ...currentForm,
        nickname: userProfile.username,
        username: userProfile.studentNumber,
      }));
    }
  }, [userProfile]);
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
        <FormControl fullWidth error={0 < nicknameError.length}>
          <TextField
            label="ニックネーム"
            variant="outlined"
            required
            helperText="メッセージの名前欄などに表示される名前です"
            margin="normal"
            fullWidth
            onChange={(e) => {
              const nickname = e.target.value;
              const validate = validateNickname(nickname);
              if (validate !== true) {
                setNicknameError(validate);
              } else {
                setNicknameError("");
              }
              const form = { ...registrationForm, nickname: nickname };
              setRegistrationForm(form);
            }}
            value={registrationForm.nickname}
          />
          {0 < nicknameError.length ? <FormHelperText>{nicknameError}</FormHelperText> : null}
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
