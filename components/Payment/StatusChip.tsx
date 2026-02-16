import { Chip } from "@mui/material";

import type { PaymentHistory } from "@/interfaces/form";

type StatusChipProps = {
  payment: PaymentHistory;
};

const StatusChip = ({ payment }: StatusChipProps) => {
  if (payment.checked) {
    return <Chip label="確認済み" color="success" size="small" />;
  }
  return <Chip label="確認待ち" color="warning" size="small" />;
};

export default StatusChip;
