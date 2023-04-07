import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Stepper,
  StepLabel,
  Step,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuthState } from "../../hook/useAuthState";
import { PublicProfileEditor } from "./ProfileEditor";
import { useDiscordLogin } from "../../hook/profile/useDiscordLogin";
import NameInput from "./NameInput";
import PhoneInput from "./PhoneInput";
import { usePrivateProfile } from "../../hook/profile/usePrivateProfile";
import { UserPrivateProfile } from "../../interfaces/user";
import { objectEquals } from "../../utils/common";

type Props = {
  registerMode: boolean;
};
const ProfileRegister = ({ registerMode }: Props) => {
  const { authState } = useAuthState();
  const [privateProfile] = usePrivateProfile();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!authState.isLogined) return;
    if (authState.user.username !== authState.user.studentNumber) {
      console.log(authState.user);
      if (privateProfile.firstName !== "") {
        if (authState.user.discordUserId !== "") setStep(3);
        else setStep(2);
      } else setStep(1);
    }
  }, [authState, privateProfile]);
  return (
    <>
      {authState.isLoading || !authState.isLogined ? (
        <p>Loading...</p>
      ) : (
        <Container>
          <Stepper activeStep={step}>
            <Step>
              <StepLabel>プロフィール登録</StepLabel>
            </Step>
            <Step>
              <StepLabel>個人情報&緊急連絡先登録</StepLabel>
            </Step>
            <Step>
              <StepLabel>Discord連携</StepLabel>
            </Step>
          </Stepper>
          <Steps step={step} setStep={setStep} />
        </Container>
      )}
    </>
  );
};
export default ProfileRegister;
type StepsProps = { step: number; setStep: Dispatch<SetStateAction<number>> };
const Steps = ({ step, setStep }: StepsProps) => {
  const discord = useDiscordLogin();
  const router = useRouter();
  const [privateProfile, updateProfile] = usePrivateProfile(true);
  const [editPrivateProfile, setEditPrivateProfile] = useState<UserPrivateProfile>(privateProfile);
  useEffect(() => {
    setEditPrivateProfile(privateProfile);
  }, [privateProfile]);
  switch (step) {
    case 0:
      return (
        <PublicProfileEditor
          onSave={() => {
            setStep(1);
          }}
        />
      );
    case 1:
      return (
        <>
          <Grid>
            <h3>個人情報</h3>
            <NameInput
              title="氏名"
              firstNameTitle="名字"
              lastNameTitle="名前"
              onChange={(first, last) => {
                setEditPrivateProfile({
                  ...editPrivateProfile,
                  firstName: first,
                  lastName: last,
                });
              }}
              initFirstName={editPrivateProfile.firstName}
              initLastName={editPrivateProfile.lastName}
            />
            <NameInput
              title="氏名（カタカナ）"
              firstNameTitle="ミョウジ"
              lastNameTitle="ナマエ"
              onChange={(first, last) => {
                setEditPrivateProfile({
                  ...editPrivateProfile,
                  firstNameKana: first,
                  lastNameKana: last,
                });
              }}
              initFirstName={editPrivateProfile.firstNameKana}
              initLastName={editPrivateProfile.lastNameKana}
            />
            <h5>性別</h5>
            <FormControl>
              <RadioGroup
                value={editPrivateProfile.isMale ? "male" : "female"}
                name="sex-radio-group"
                onChange={(e) => {
                  setEditPrivateProfile({
                    ...editPrivateProfile,
                    isMale: e.target.value === "male",
                  });
                }}
              >
                <FormControlLabel value="female" control={<Radio />} label="女性" />
                <FormControlLabel value="male" control={<Radio />} label="男性" />
              </RadioGroup>
            </FormControl>
            <PhoneInput
              onChange={(num) => {
                setEditPrivateProfile({ ...editPrivateProfile, phoneNumber: num });
              }}
              title="携帯電話番号"
              required
              initPhoneNumber={editPrivateProfile.phoneNumber}
            />
            <TextField
              label="住所"
              fullWidth
              required
              margin="normal"
              onChange={(e) => {
                setEditPrivateProfile({ ...editPrivateProfile, address: e.target.value });
              }}
              value={editPrivateProfile.address}
              helperText="郵便番号無しで入力してください"
            />
          </Grid>
          <Grid>
            <h3>緊急連絡先</h3>
            <TextField
              label="保護者氏名"
              required
              margin="normal"
              onChange={(e) => {
                setEditPrivateProfile({ ...editPrivateProfile, parentName: e.target.value });
              }}
              value={editPrivateProfile.parentName}
            />
            <PhoneInput
              onChange={(num) => {
                setEditPrivateProfile({ ...editPrivateProfile, parentCellphoneNumber: num });
              }}
              title="携帯電話番号"
              required
              initPhoneNumber={editPrivateProfile.parentCellphoneNumber}
            />
            <PhoneInput
              onChange={(num) => {
                setEditPrivateProfile({ ...editPrivateProfile, parentHomephoneNumber: num });
              }}
              title="固定電話番号（ある場合のみ記入）"
              initPhoneNumber={editPrivateProfile.parentHomephoneNumber}
            />
            <TextField
              label="住所"
              fullWidth
              required
              margin="normal"
              onChange={(e) => {
                setEditPrivateProfile({ ...editPrivateProfile, parentAddress: e.target.value });
              }}
              value={editPrivateProfile.parentAddress}
              helperText="郵便番号無しで入力してください"
            />
            <Button
              variant="contained"
              onClick={() => {
                setEditPrivateProfile({
                  ...editPrivateProfile,
                  parentAddress: editPrivateProfile.address,
                });
              }}
            >
              本人住所と同じにする
            </Button>
            <br />
            <Button
              variant="contained"
              disabled={objectEquals(privateProfile, editPrivateProfile)}
              onClick={() => {
                updateProfile(editPrivateProfile).then((result) => {
                  if (result) setStep(2);
                });
              }}
              sx={{ mt: 2 }}
            >
              次へ
            </Button>
          </Grid>
        </>
      );
    case 2:
      return (
        <div style={{ textAlign: "center", margin: "1em" }}>
          <Typography>
            デジクリではDiscordサーバーを所有しています。
            正規の部員のみがDiscordサーバーに入れるようにアカウントと連携が必要です。
          </Typography>
          <Typography>
            Discordアカウントを持っていない方は先に
            <a href="https://discord.com/register" target="_blank" rel="noopener">
              こちらから
            </a>
            Discordのアカウント作成を行いましょう（大学のメールアドレスで作る必要はありません!）
          </Typography>
          <Button href={discord.loginUrl} variant="contained">
            Discord連携
          </Button>
        </div>
      );
    case 3:
      setTimeout(() => {
        router.push("/user/joined");
      }, 1000);
      return (
        <>
          <p>これで登録は完了です。</p>
        </>
      );
  }
  return <></>;
};
