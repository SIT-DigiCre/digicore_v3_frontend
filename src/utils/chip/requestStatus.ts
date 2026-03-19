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

  if (status === "pending") {
    return {
      color: "warning",
      label: "審査中",
    };
  }

  // 想定外の status は「不明」として扱い、仕様変更や新ステータス追加時の誤表示を防ぐ
  return {
    color: "default",
    label: "不明",
  };
};
