import type { ChipProps } from "@mui/material";

export const getRequestStatusChipProps = (status: string): Pick<ChipProps, "label" | "color"> => {
  if (status === "approved") {
    return {
      color: "success",
      label: "承認済み",
    };
  }

  if (status === "rejected") {
    return {
      color: "error",
      label: "却下",
    };
  }

  return {
    color: "warning",
    label: "審査中",
  };
};
