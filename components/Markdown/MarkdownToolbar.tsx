import { IconButton, Stack, Tooltip, useTheme } from "@mui/material";

import type { SvgIconComponent } from "@mui/icons-material";

export type ActionButtonProps = {
  key: string;
  label: string;
  icon: SvgIconComponent;
  onClick: () => void;
};

const ActionButton = ({ icon: Icon, label, onClick }: ActionButtonProps) => {
  const theme = useTheme();
  const borderColor =
    theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300];
  const backgroundColor =
    theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.background.paper;

  return (
    <Tooltip title={label} arrow>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          backgroundColor,
          color: theme.palette.text.primary,
          minWidth: "2rem",
          minHeight: "2rem",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

type MarkdownToolbarProps = {
  actions: ActionButtonProps[];
};

const MarkdownToolbar = ({ actions }: MarkdownToolbarProps) => {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" justifyContent="flex-start">
      {actions.map((action) => {
        const { key, ...rest } = action;
        return <ActionButton key={key} {...rest} />;
      })}
    </Stack>
  );
};

export default MarkdownToolbar;
