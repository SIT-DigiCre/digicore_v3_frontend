import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  Stepper,
  StepLabel,
  Step,
  StepProps,
} from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuthState } from "../../hook/useAuthState";
import { PrivateParentProfileEditor, PrivatePersonalProfileEditor } from "./PrivateProfileEditor";
import { PublicProfileEditor } from "./ProfileEditor";
import { useDiscordLogin } from "../../hook/profile/useDiscordLogin";

type Props = {
  registerMode: boolean;
};
const ProfileRegister = ({ registerMode }: Props) => {
  const { authState } = useAuthState();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (localStorage.getItem("reg_discord")) {
      localStorage.removeItem("reg_discord");
      if (authState.user.discordUserId) {
        setStep(4);
      } else {
        setStep(3);
      }
    }
  }, []);
  return (
    <>
      {authState.isLoading || !authState.isLogined ? (
        <p>Loading...</p>
      ) : (
        <Container sx={{ mx: 5, my: 3 }}>
          <Stepper activeStep={step}>
            <Step>
              <StepLabel>プロフィール登録</StepLabel>
            </Step>
            <Step>
              <StepLabel>個人情報登録</StepLabel>
            </Step>
            <Step>
              <StepLabel>緊急連絡先登録</StepLabel>
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
        <PrivatePersonalProfileEditor
          onSave={() => {
            setStep(2);
          }}
        />
      );
    case 2:
      return (
        <PrivateParentProfileEditor
          onSave={() => {
            setStep(3);
          }}
        />
      );
    case 3:
      localStorage.setItem("reg_discord", "true");
      return (
        <div style={{ textAlign: "center" }}>
          <Typography>
            デジクリではDiscordサーバーを所有しています。正規の部員のみがDiscordサーバーに入れるようにアカウントと連携が必要です。
          </Typography>
          <Typography>
            Discordアカウントを持っていない方は先に
            <a href="https://discord.com/register" target="_blank" rel="noopener">
              こちらから
            </a>
            Discordのアカウント作成を行いましょう（大学のメールアドレスで作る必要はありません!）
          </Typography>
          <Button href={discord.loginUrl}>Discord連携</Button>
        </div>
      );
    case 4:
      router.push("/user/joined");
      return (
        <>
          <p>これで登録は完了です。</p>
        </>
      );
  }
  return <></>;
};
