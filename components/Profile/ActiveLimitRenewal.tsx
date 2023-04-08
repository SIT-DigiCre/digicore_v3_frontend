import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useActiveLimit } from "../../hook/profile/useActiveLimit";


const ActiveLimitRenewal = () => {
  const [activeLimit, updateActiveLimit] = useActiveLimit();
  const router = useRouter();

  return (
    <>
      {activeLimit}
      <br />
      <Button
        variant="contained"
        onClick={() => { updateActiveLimit().then((() => router.reload())) }}
        sx={{ mt: 2 }}
      >
        有効期限の更新
      </Button>
    </>
  );
};

export default ActiveLimitRenewal;
