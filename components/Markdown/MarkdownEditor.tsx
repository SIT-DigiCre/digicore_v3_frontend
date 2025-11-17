import { ChangeEventHandler, useRef, useState } from "react";

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
import { Box, IconButton, Stack, Tooltip, useMediaQuery, useTheme } from "@mui/material";

import { FileObject } from "../../interfaces/file";
import { FileBrowserModal } from "../File/FileBrowser";

import MarkdownView from "./MarkdownView";

import type { SvgIconComponent } from "@mui/icons-material";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type ToolbarAction = {
  key: string;
  label: string;
  icon: SvgIconComponent;
  onClick: () => void;
};

const ActionButton = ({ icon: Icon, label, onClick }: ToolbarAction) => {
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
          minWidth: 36,
          minHeight: 36,
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const textFieldElement = useRef<HTMLTextAreaElement>(null);
  const mdPreviewDivElement = useRef<HTMLDivElement>(null);
  const [md, setMd] = useState<string>(value);
  const [mobileViewMode, setMobileViewMode] = useState<"editor" | "preview">("editor");
  const showEditor = !isMobile || mobileViewMode === "editor";
  const showPreview = !isMobile || mobileViewMode === "preview";

  const onScrollTextField = () => {
    if (!mdPreviewDivElement.current || !textFieldElement.current) {
      return;
    }
    mdPreviewDivElement.current.scrollTop =
      (mdPreviewDivElement.current.scrollHeight * textFieldElement.current.scrollTop) /
      (textFieldElement.current.scrollHeight - textFieldElement.current.clientHeight);
  };

  const getSelectionRange = () => {
    const textarea = textFieldElement.current;
    if (!textarea) {
      return { start: 0, end: 0 };
    }
    return {
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    };
  };

  const onChangeMd: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMd(e.target.value);
    onChange(e.target.value);
  };

  const focusTextarea = (selection?: { start: number; end: number }) => {
    if (!textFieldElement.current) return;
    requestAnimationFrame(() => {
      textFieldElement.current?.focus();
      if (selection) {
        textFieldElement.current?.setSelectionRange(selection.start, selection.end);
      }
    });
  };

  const updateMarkdown = (next: string, selection?: { start: number; end: number }) => {
    setMd(next);
    onChange(next);
    if (selection) {
      focusTextarea(selection);
    }
  };

  const ensureEditorVisible = () => {
    if (isMobile && mobileViewMode === "preview") {
      setMobileViewMode("editor");
    }
    return textFieldElement.current;
  };

  const wrapSelection = (wrapper: string, placeholder: string) => {
    if (!ensureEditorVisible()) return;
    const { start, end } = getSelectionRange();
    const selection = md.slice(start, end);
    const hasWrapper =
      selection.startsWith(wrapper) &&
      selection.endsWith(wrapper) &&
      selection.length >= wrapper.length * 2;
    if (hasWrapper) {
      const nextSelection = selection.slice(wrapper.length, selection.length - wrapper.length);
      const nextText = md.slice(0, start) + nextSelection + md.slice(end);
      updateMarkdown(nextText, {
        start,
        end: start + nextSelection.length,
      });
      return;
    }
    const content = selection || placeholder;
    const wrapped = `${wrapper}${content}${wrapper}`;
    const nextText = md.slice(0, start) + wrapped + md.slice(end);
    const offsetStart = start + wrapper.length;
    updateMarkdown(nextText, {
      start: offsetStart,
      end: offsetStart + content.length,
    });
  };

  const getLineBoundaries = (start: number, end: number) => {
    const text = md;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = end;
    while (lineEnd < text.length && text[lineEnd] !== "\n") {
      lineEnd += 1;
    }
    return { lineStart, lineEnd };
  };

  const toggleHeading = () => {
    if (!ensureEditorVisible()) return;
    const { start, end } = getSelectionRange();
    const { lineStart, lineEnd } = getLineBoundaries(start, end);
    const currentLine = md.slice(lineStart, lineEnd);
    const hasHeading = currentLine.startsWith("### ");
    const content = hasHeading
      ? currentLine.replace(/^###\s?/, "")
      : currentLine.trim().length
        ? currentLine.trim()
        : "見出し";
    const nextLine = hasHeading ? content : `### ${content}`;
    const nextText = md.slice(0, lineStart) + nextLine + md.slice(lineEnd);
    const selectionStart = lineStart + (hasHeading ? 0 : 4);
    updateMarkdown(nextText, {
      start: selectionStart,
      end: selectionStart + content.length,
    });
  };

  const toggleLinePrefix = (prefix: string) => {
    if (!ensureEditorVisible()) return;
    const { start, end } = getSelectionRange();
    const { lineStart, lineEnd } = getLineBoundaries(start, end);
    const block = md.slice(lineStart, lineEnd);
    const lines = block.split("\n");
    const prefixRegex = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    const hasPrefix = lines.every((line) => !line.trim() || prefixRegex.test(line));
    const updatedLines = lines.map((line) => {
      if (!line.trim()) {
        return line;
      }
      return hasPrefix ? line.replace(prefixRegex, "") : `${prefix}${line}`;
    });
    const nextBlock = updatedLines.join("\n");
    const nextText = md.slice(0, lineStart) + nextBlock + md.slice(lineEnd);
    updateMarkdown(nextText, {
      start: lineStart,
      end: lineStart + nextBlock.length,
    });
  };

  const toggleOrderedList = () => {
    if (!ensureEditorVisible()) return;
    const { start, end } = getSelectionRange();
    const { lineStart, lineEnd } = getLineBoundaries(start, end);
    const block = md.slice(lineStart, lineEnd);
    const lines = block.split("\n");
    const orderedRegex = /^\d+\.\s/;
    const hasOrdered = lines.every((line) => !line.trim() || orderedRegex.test(line));
    const updatedLines = lines.map((line, index) => {
      if (!line.trim()) {
        return line;
      }
      if (hasOrdered) {
        return line.replace(orderedRegex, "");
      }
      return `${index + 1}. ${line}`;
    });
    const nextBlock = updatedLines.join("\n");
    const nextText = md.slice(0, lineStart) + nextBlock + md.slice(lineEnd);
    updateMarkdown(nextText, {
      start: lineStart,
      end: lineStart + nextBlock.length,
    });
  };

  const toggleLink = () => {
    if (!ensureEditorVisible()) return;
    const { start, end } = getSelectionRange();
    const selection = md.slice(start, end);
    const linkPattern = /^\[([^[\]]+)\]\(([^)]+)\)$/;
    if (linkPattern.test(selection)) {
      const match = selection.match(linkPattern);
      const label = match?.[1] ?? "";
      const nextText = md.slice(0, start) + label + md.slice(end);
      updateMarkdown(nextText, {
        start,
        end: start + label.length,
      });
      return;
    }
    const label = selection || "リンクテキスト";
    const url = "https://example.com";
    const linkText = `[${label}](${url})`;
    const nextText = md.slice(0, start) + linkText + md.slice(end);
    updateMarkdown(nextText, {
      start: start + 1,
      end: start + 1 + label.length,
    });
  };

  const [isOpenFileBrowser, setIsOpenFileBrowser] = useState(false);
  const onFileSelected = (file: FileObject) => {
    setIsOpenFileBrowser(false);
    if (!ensureEditorVisible()) return;
    const { start, end } = getSelectionRange();
    const needsLineBreak = start > 0 && md.slice(start - 1, start) !== "\n" ? "\n" : "";
    const imageText = `${needsLineBreak}![${file.name}](${file.url})\n`;
    const nextText = md.slice(0, start) + imageText + md.slice(end);
    const nextPosition = start + imageText.length;
    updateMarkdown(nextText, { start: nextPosition, end: nextPosition });
  };

  const baseToolbarActions: ToolbarAction[] = [
    {
      key: "heading",
      label: "見出し (H3)",
      icon: HMobiledataIcon,
      onClick: () => {
        toggleHeading();
      },
    },
    {
      key: "bold",
      label: "太字",
      icon: FormatBoldIcon,
      onClick: () => {
        wrapSelection("**", "強調");
      },
    },
    {
      key: "italic",
      label: "斜体",
      icon: FormatItalicIcon,
      onClick: () => {
        wrapSelection("*", "Italic");
      },
    },
    {
      key: "quote",
      label: "引用",
      icon: FormatQuoteIcon,
      onClick: () => {
        toggleLinePrefix("> ");
      },
    },
    {
      key: "bullet",
      label: "箇条書き",
      icon: FormatListBulletedIcon,
      onClick: () => {
        toggleLinePrefix("- ");
      },
    },
    {
      key: "ordered",
      label: "番号付きリスト",
      icon: FormatListNumberedIcon,
      onClick: () => {
        toggleOrderedList();
      },
    },
    {
      key: "inlineCode",
      label: "インラインコード",
      icon: CodeIcon,
      onClick: () => {
        wrapSelection("`", "code");
      },
    },
    { key: "link", label: "リンク", icon: LinkIcon, onClick: toggleLink },
    {
      key: "image",
      label: "画像を挿入",
      icon: ImageIcon,
      onClick: () => setIsOpenFileBrowser(true),
    },
  ];

  const toolbarActions = isMobile
    ? [
        ...baseToolbarActions,
        {
          key: "toggleView",
          label: mobileViewMode === "editor" ? "プレビュー表示" : "編集に戻る",
          icon: mobileViewMode === "editor" ? VisibilityIcon : EditIcon,
          onClick: () => setMobileViewMode((prev) => (prev === "editor" ? "preview" : "editor")),
        },
      ]
    : baseToolbarActions;

  return (
    <>
      <FileBrowserModal
        open={isOpenFileBrowser}
        onCancel={() => {
          setIsOpenFileBrowser(false);
        }}
        onSelected={onFileSelected}
        onlyFileKind="image"
      />
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {toolbarActions.map((action) => (
              <ActionButton key={action.key} {...action} />
            ))}
          </Stack>
        </Box>
        <Stack direction="row" gap={2}>
          <Box sx={{ flex: 1, display: showEditor ? "block" : "none" }}>
            <textarea
              placeholder="ここにテキストを入力してください"
              value={md}
              onChange={onChangeMd}
              ref={textFieldElement}
              onScroll={onScrollTextField}
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
              ref={mdPreviewDivElement}
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
