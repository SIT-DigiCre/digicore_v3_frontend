import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

import { FileBrowserModal } from "../File/FileBrowser";
import MarkdownToolbar, { type ActionButtonProps } from "./MarkdownToolbar";
import MarkdownView from "./MarkdownView";

import type { FileObject } from "../../interfaces/file";

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

  useEffect(() => {
    setMd(value);
  }, [value]);

  const onChangeMd = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMd(e.target.value);
    onChange(e.target.value);
  };

  const insertBlock = useCallback(
    (text: string) => {
      // モバイルでプレビューモードの場合は、まずエディターモードに切り替える
      if (isMobile && mobileViewMode === "preview") {
        setMobileViewMode("editor");
      }

      // エディターが表示されるのを待ってから処理を実行
      requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const currentValue = textarea.value;
        const selectionStart = textarea.selectionStart ?? currentValue.length;
        const lineStart = currentValue.lastIndexOf("\n", selectionStart - 1) + 1;
        const isCurrentLineEmpty = selectionStart === lineStart;
        // 現在の行が空の場合は、改行を削除する
        const insertText =
          text.startsWith("\n") && isCurrentLineEmpty ? text.replace(/^\n/, "") : text;

        setMd((prev) => {
          const before = prev.slice(0, selectionStart);
          const after = prev.slice(selectionStart);
          const nextValue = `${before}${insertText}${after}`;

          onChange(nextValue);
          return nextValue;
        });

        textarea.focus();
      });
    },
    [onChange, isMobile, mobileViewMode],
  );

  const onFileSelected = (file: FileObject) => {
    setIsOpenFileBrowser(false);
    insertBlock(`![${file.name}](${file.url})\n`);
  };

  const toolbarActions = useMemo<ActionButtonProps[]>(() => {
    const actions: ActionButtonProps[] = [
      {
        icon: HMobiledataIcon,
        key: "heading",
        label: "見出し (H3)",
        onClick: () => insertBlock("\n### "),
      },
      {
        icon: FormatBoldIcon,
        key: "bold",
        label: "太字",
        onClick: () => insertBlock("**強調**"),
      },
      {
        icon: FormatItalicIcon,
        key: "italic",
        label: "斜体",
        onClick: () => insertBlock("*斜体*"),
      },
      {
        icon: FormatQuoteIcon,
        key: "quote",
        label: "引用",
        onClick: () => insertBlock("\n> "),
      },
      {
        icon: FormatListBulletedIcon,
        key: "bullet",
        label: "箇条書き",
        onClick: () => insertBlock("\n- "),
      },
      {
        icon: FormatListNumberedIcon,
        key: "ordered",
        label: "番号付きリスト",
        onClick: () => insertBlock("\n1. "),
      },
      {
        icon: CodeIcon,
        key: "inlineCode",
        label: "インラインコード",
        onClick: () => insertBlock("`code`"),
      },
      {
        icon: LinkIcon,
        key: "link",
        label: "リンク",
        onClick: () => insertBlock("[タイトル](https://example.com)"),
      },
      {
        icon: ImageIcon,
        key: "image",
        label: "画像を挿入",
        onClick: () => setIsOpenFileBrowser(true),
      },
    ];

    if (isMobile) {
      actions.push({
        icon: mobileViewMode === "editor" ? VisibilityIcon : EditIcon,
        key: "toggleView",
        label: mobileViewMode === "editor" ? "プレビュー表示" : "編集に戻る",
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
          <Box sx={{ display: showEditor ? "block" : "none", flex: 1 }}>
            <textarea
              ref={textareaRef}
              placeholder="ここにテキストを入力してください"
              aria-label="マークダウンエディタ"
              value={md}
              onChange={onChangeMd}
              style={{
                backgroundColor:
                  theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
                border: `1px solid ${
                  theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300]
                }`,
                borderRadius: "0.5rem",
                color:
                  theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[900],
                fontFamily: "inherit",
                fontSize: "1rem",
                height: isMobile ? 260 : 500,
                padding: "1rem",
                resize: "none",
                width: "100%",
              }}
            />
          </Box>
          <Box sx={{ display: showPreview ? "block" : "none", flex: 1 }}>
            <Box
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
                border: `1px solid ${
                  theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200]
                }`,
                borderRadius: "0.5rem",
                height: isMobile ? 260 : 500,
                overflowWrap: "anywhere",
                overflowY: "auto",
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
