import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";

import CodeIcon from "@mui/icons-material/Code";
import EditIcon from "@mui/icons-material/Edit";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HMobiledataIcon from "@mui/icons-material/HMobiledata";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";

import { FileObject } from "../../interfaces/file";
import { FileBrowserModal } from "../File/FileBrowser";

import MarkdownToolbar, { type ActionButtonProps } from "./MarkdownToolbar";
import MarkdownView from "./MarkdownView";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [md, setMd] = useState<string>(value);
  const [mobileViewMode, setMobileViewMode] = useState<"editor" | "preview">("editor");
  const [isOpenFileBrowser, setIsOpenFileBrowser] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showEditor = !isMobile || mobileViewMode === "editor";
  const showPreview = !isMobile || mobileViewMode === "preview";

  const onChangeMd = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMd(e.target.value);
    onChange(e.target.value);
  };

  const ensureEditorVisible = useCallback(() => {
    if (isMobile && mobileViewMode === "preview") {
      setMobileViewMode("editor");
    }
  }, [isMobile, mobileViewMode]);

  const insertBlock = useCallback(
    (text: string) => {
      ensureEditorVisible();
      textareaRef.current?.focus();

      const textarea = textareaRef.current;

      if (!textarea) {
        setMd((prev) => {
          const updated = prev + text;
          onChange(updated);
          return updated;
        });
        return;
      }

      const currentValue = textarea.value;
      const selectionStart = textarea.selectionStart ?? currentValue.length;
      const selectionEnd = textarea.selectionEnd ?? currentValue.length;
      const lineStart = currentValue.lastIndexOf("\n", selectionStart - 1) + 1;
      const isCurrentLineEmpty = selectionStart === selectionEnd && selectionStart === lineStart;
      const insertText =
        text.startsWith("\n") && isCurrentLineEmpty ? text.replace(/^\n/, "") : text;

      setMd((prev) => {
        const before = prev.slice(0, selectionStart);
        const after = prev.slice(selectionEnd);
        const nextValue = `${before}${insertText}${after}`;
        const caretPosition = selectionStart + insertText.length;

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = caretPosition;
            textareaRef.current.selectionEnd = caretPosition;
          }
        });

        onChange(nextValue);
        return nextValue;
      });
    },
    [ensureEditorVisible, onChange],
  );

  const onFileSelected = (file: FileObject) => {
    setIsOpenFileBrowser(false);
    insertBlock(`![${file.name}](${file.url})\n`);
  };

  const toolbarActions = useMemo<ActionButtonProps[]>(() => {
    const actions: ActionButtonProps[] = [
      {
        key: "heading",
        label: "見出し (H3)",
        icon: HMobiledataIcon,
        onClick: () => insertBlock("\n### "),
      },
      {
        key: "bold",
        label: "太字",
        icon: FormatBoldIcon,
        onClick: () => insertBlock("**強調**"),
      },
      {
        key: "italic",
        label: "斜体",
        icon: FormatItalicIcon,
        onClick: () => insertBlock("*斜体*"),
      },
      {
        key: "quote",
        label: "引用",
        icon: FormatQuoteIcon,
        onClick: () => insertBlock("\n> "),
      },
      {
        key: "bullet",
        label: "箇条書き",
        icon: FormatListBulletedIcon,
        onClick: () => insertBlock("\n- "),
      },
      {
        key: "ordered",
        label: "番号付きリスト",
        icon: FormatListNumberedIcon,
        onClick: () => insertBlock("\n1. "),
      },
      {
        key: "inlineCode",
        label: "インラインコード",
        icon: CodeIcon,
        onClick: () => insertBlock("`code`"),
      },
      {
        key: "link",
        label: "リンク",
        icon: LinkIcon,
        onClick: () => insertBlock("[タイトル](https://example.com)"),
      },
      {
        key: "image",
        label: "画像を挿入",
        icon: ImageIcon,
        onClick: () => setIsOpenFileBrowser(true),
      },
    ];

    if (isMobile) {
      actions.push({
        key: "toggleView",
        label: mobileViewMode === "editor" ? "プレビュー表示" : "編集に戻る",
        icon: mobileViewMode === "editor" ? VisibilityIcon : EditIcon,
        onClick: () => setMobileViewMode((prev) => (prev === "editor" ? "preview" : "editor")),
      });
    }

    return actions;
  }, [insertBlock, isMobile, mobileViewMode]);

  return (
    <>
      <FileBrowserModal
        open={isOpenFileBrowser}
        onCancel={() => setIsOpenFileBrowser(false)}
        onSelected={onFileSelected}
        onlyFileKind="image"
      />
      <Stack spacing={2}>
        <MarkdownToolbar actions={toolbarActions} />
        <Stack direction="row" gap={2}>
          <Box sx={{ flex: 1, display: showEditor ? "block" : "none" }}>
            <textarea
              ref={textareaRef}
              placeholder="ここにテキストを入力してください"
              value={md}
              onChange={onChangeMd}
              style={{
                height: isMobile ? 260 : 500,
                width: "100%",
                fontSize: "1rem",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: `1px solid ${
                  theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300]
                }`,
                backgroundColor:
                  theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
                color:
                  theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[900],
                fontFamily: "inherit",
                resize: "none",
              }}
            />
          </Box>
          <Box sx={{ flex: 1, display: showPreview ? "block" : "none" }}>
            <Box
              sx={{
                height: isMobile ? 260 : 500,
                overflowY: "auto",
                overflowWrap: "anywhere",
                borderRadius: "0.5rem",
                border: `1px solid ${
                  theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]
                }`,
                backgroundColor:
                  theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
                padding: "1rem",
              }}
            >
              <MarkdownView md={md} />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};
export default MarkdownEditor;
