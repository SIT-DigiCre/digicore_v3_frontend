import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PageHead from "../../components/Common/PageHead";
import { useMyProfile } from "../../hook/profile/useProfile";
import { useMattermostRegister } from "../../hook/mattermost/useMattermostRegister";
import { MattermostRegistrationRequest } from "../../interfaces/api";

const MattermkstRegisterPage = () => {
  const router = useRouter();
  const [userProfile] = useMyProfile();
  const { register } = useMattermostRegister();
  const [registrationForm, setRegistrationForm] = useState<MattermostRegistrationRequest>({
    username: "",
    nickname: "",
    password: "",
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

  const onRegister = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    (async () => {
      setSending(true);
      const res = await register(registrationForm);
      setSending(false);
      if (res) {
        router.push("/mattermost/register_complete");
      }
    })();
  };
  useEffect(() => {
    if (userProfile) {
      setRegistrationForm({
        ...registrationForm,
        username: userProfile.student_number,
        nickname: userProfile.username,
      });
    }
  }, [userProfile]);
  return (
    <Container>
      <PageHead title="Mattermost アカウント登録" />
      <Breadcrumbs
        links={[
          { text: "Home", href: "/" },
          { text: "Mattermost", href: "/mattermost" },
          { text: "Account Registration" },
        ]}
      />
      <Grid margin={2}>
        <Typography variant="h4" align="center" noWrap={true}>
          Mattermost
        </Typography>
        <Typography variant="h4" align="center" noWrap={true}>
          アカウント登録
        </Typography>
      </Grid>
      <Grid margin={2}>
        <Typography align="center">
          デジコアとの連携機能を用いて、Mattermostへのアカウント登録を行います。
        </Typography>
        <Typography align="center">必要なアカウント情報を記入してください。</Typography>
      </Grid>
      <hr />
      <Grid container my={2}>
        <Grid xs={6}>
          <Typography align="center">
            <Image src="/image/digicore.png" width={100} height={100} />
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography align="center">
            <Image src="/image/mattermost_icon.png" width={100} height={100} />
          </Typography>
        </Grid>
      </Grid>
      <Grid margin={2}>
        <Box component="form" onSubmit={onRegister}>
          <FormControl fullWidth>
            <TextField
              label="メールアドレス"
              variant="outlined"
              disabled
              helperText="大学のメールアドレスで登録します"
              margin="normal"
              fullWidth
              value={`${userProfile ? userProfile.student_number : ""}@shibaura-it.ac.jp`}
            />
          </FormControl>
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
          <FormControl fullWidth error={!readyToSend}>
            <Button variant="contained" type="submit" disabled={!readyToSend || sending}>
              {sending ? "処理中" : "登録"}
            </Button>
          </FormControl>
        </Box>
      </Grid>
      <Grid>
        <Typography m={1}>Mattermost 公式による注意事項</Typography>
        <Typography m={1}>
          アカウントを作成し Mattermost を利用する前に{" "}
          <a href="https://mattermost.com/terms-of-use/" target="_blank" rel="noreferrer">
            利用規約
          </a>{" "}
          と{" "}
          <a href="https://mattermost.com/privacy-policy/" target="_blank" rel="noreferrer">
            プライバシーポリシー
          </a>{" "}
          に同意してください。同意できない場合は Mattermost は利用できません。
        </Typography>
      </Grid>
      <Grid>
        <Typography align="center" m={2}>
          <strong>
            アカウント登録にお困りの際は{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfu4AwLvNg5me5Exymbpb6ZA8Liutt0u8Z0vWPJ2TRl575chQ/viewform?usp=sf_link"
              target="_blank"
              rel="noreferrer"
            >
              こちらのフォームから
            </a>{" "}
            ご相談を
          </strong>
        </Typography>
      </Grid>
    </Container>
  );
};

export default MattermkstRegisterPage;
