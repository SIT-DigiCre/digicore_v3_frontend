import { Button, Container, Grid, TextField, Typography, Alert } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEventHandler, useEffect, useState } from "react";
import NameInput from "../../components/Profile/NameInput";
import PhoneInput from "../../components/Profile/PhoneInput";
import { useAuthState } from "../../hook/useAuthState";
import { User } from "../../interfaces";
import { convertUserPrivateFromUser, convertUserProfileFromUser } from "../../interfaces/api";
import { axios } from "../../utils/axios";
import { baseURL } from "../../utils/common";

type Props = {
  registerMode: boolean;
};
const ProfilePage = ({ registerMode }: Props) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const [user, setUser] = useState<User>({
    username: "",
    studentNumber: "",
    schoolGrade: 0,
    iconUrl: "",
  });
  useEffect(() => {
    if (!authState.isLogined) return;
    setUser(authState.user);
  }, [authState]);
  useEffect(() => {
    const existMemberFlag = sessionStorage.getItem("exist-member") !== null;
    const value = sessionStorage.getItem("register");
    if (value === null) return;
    sessionStorage.removeItem("register");
    if (existMemberFlag) {
      router.push("/user/continued");
    } else {
      router.push("/user/joined");
    }
  }, []);
  const onChangeUserName: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUser((state) => ({ ...state, username: e.target.value }));
  };
  const onChangeShortSelfIntroduction: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUser((state) => ({ ...state, shortSelfIntroduction: e.target.value }));
  };
  const onChangePhoneNumber = (phoneNumber: string) => {
    setUser((state) => ({ ...state, phoneNumber: phoneNumber }));
  };
  const onChangeAddress: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUser((state) => ({ ...state, address: e.target.value }));
  };
  const onChangeName = (firstName: string, lastName: string) => {
    setUser((state) => ({ ...state, firstName: firstName, lastName: lastName }));
  };
  const onChangeNameKana = (firstName: string, lastName: string) => {
    setUser((state) => ({ ...state, firstNameKana: firstName, lastNameKana: lastName }));
  };
  const onChangeParentName: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUser((state) => ({ ...state, parentName: e.target.value }));
  };
  const onChangeParentCellPhone = (phoneNumber: string) => {
    setUser((state) => ({ ...state, parentCellPhoneNumber: phoneNumber }));
  };
  const onChangeParentHomePhone = (phoneNumber: string) => {
    setUser((state) => ({ ...state, parentHomePhoneNumber: phoneNumber }));
  };
  const onChangeParentAddress: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUser((state) => ({ ...state, parentAddress: e.target.value }));
  };
  const onClickSameAddress = () => {
    setUser((state) => ({ ...state, parentAddress: user.address }));
  };
  const onClickSigninDiscord = () => {
    axios
      .put("/user/my/", convertUserProfileFromUser(user), {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      })
      .then((res) => {
        axios
          .put("/user/my/private/", convertUserPrivateFromUser(user), {
            headers: { Authorization: "bearer " + authState.token },
          })
          .then((res1) => {
            sessionStorage.setItem("register", "true");
            window.location.href = baseURL + "/discord/oauth/url";
          })
          .catch((err) => {
            window.alert("非公開情報の登録に失敗しました。全て記入しているか確認してください");
          });
      })
      .catch((err) => {
        window.alert("公開情報の登録に失敗しました。全て記入しているか確認してください");
      });
  };
  return (
    <>
      {authState.isLoading || !authState.isLogined ? (
        <p>Loading...</p>
      ) : (
        <Container sx={{ mx: 5, my: 3 }}>
          {registerMode ? (
            <>
              <Grid sx={{ mb: 3 }}>
                <h2>Step.1 基本情報の登録</h2>
                <Grid>
                  <h3>公開情報（他の部員も見れる情報）</h3>
                  <TextField
                    label="ユーザー名"
                    variant="outlined"
                    required
                    helperText="ハンドルネームなどを指定しましょう"
                    margin="normal"
                    fullWidth
                    onChange={onChangeUserName}
                    value={user.username}
                  />
                  <TextField
                    label="短い自己紹介文"
                    variant="outlined"
                    helperText="学科やどんなことをしているか簡潔に書きましょう"
                    margin="normal"
                    fullWidth
                    onChange={onChangeShortSelfIntroduction}
                    value={user.shortSelfIntroduction}
                  />
                  <h3>非公開情報（大学へ提出する名簿に使用する情報）</h3>
                  <h4>本人情報</h4>

                  <Grid>
                    <NameInput
                      title="氏名"
                      firstNameTitle="名字"
                      lastNameTitle="名前"
                      onChange={onChangeName}
                      initFirstName={user.firstName}
                      initLastName={user.lastName}
                    />
                  </Grid>
                  <Grid>
                    <NameInput
                      title="氏名（カタカナ）"
                      firstNameTitle="ミョウジ"
                      lastNameTitle="ナマエ"
                      onChange={onChangeNameKana}
                      initFirstName={user.firstNameKana}
                      initLastName={user.lastNameKana}
                    />
                  </Grid>
                  <Grid>
                    <PhoneInput
                      onChange={onChangePhoneNumber}
                      title="携帯電話番号"
                      required
                      initPhoneNumber={user.phoneNumber}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      label="住所"
                      fullWidth
                      required
                      margin="normal"
                      onChange={onChangeAddress}
                      value={user.address}
                      helperText="郵便番号無しで入力してください"
                    />
                  </Grid>
                  <h4>緊急連絡先（親の連絡先）</h4>
                  <Grid>
                    <TextField
                      label="氏名"
                      required
                      margin="normal"
                      onChange={onChangeParentName}
                      value={user.parentName}
                    />
                  </Grid>
                  <Grid>
                    <PhoneInput
                      onChange={onChangeParentCellPhone}
                      title="携帯電話番号"
                      required
                      initPhoneNumber={user.parentCellPhoneNumber}
                    />
                  </Grid>
                  <Grid>
                    <PhoneInput
                      onChange={onChangeParentHomePhone}
                      title="固定電話番号（ある場合のみ記入）"
                      initPhoneNumber={user.parentHomePhoneNumber}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                      label="住所"
                      fullWidth
                      required
                      margin="normal"
                      onChange={onChangeParentAddress}
                      value={user.parentAddress}
                      helperText="郵便番号無しで入力してください"
                    />
                    <Button variant="contained" onClick={onClickSameAddress}>
                      本人住所と同じにする
                    </Button>
                    <Alert severity="warning">
                      以上のフォームの必須（*）科目を済ませないと Discord連携へは進めません。
                    </Alert>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={{ mb: 1 }}>
                <h2>Step.2 Discord連携</h2>
                <Typography>
                  デジクリではDiscordサーバーを所有しています。正規の部員のみがDiscordサーバーに入れるようにアカウントと連携が必要です。
                </Typography>
                <Typography>
                  Discordアカウントを持っていない方は先に
                  <a href="https://discord.com/register" target="_blank">
                    こちらから
                  </a>
                  Discordのアカウント作成を行いましょう（大学のメールアドレスで作る必要はありません!）
                </Typography>
              </Grid>
              <Button onClick={onClickSigninDiscord} variant="contained">
                {authState.user.discordUserId == "" ? "Discord連携" : "Discord再連携"}
              </Button>
            </>
          ) : (
            <></>
          )}
        </Container>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { register } = context.query;
  let registerMode = false;
  if (typeof register === "string") registerMode = register === "true";
  const props: Props = { registerMode: registerMode };
  return {
    props: props,
  };
};
export default ProfilePage;
