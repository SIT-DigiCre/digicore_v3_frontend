import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Box, Button, Modal, TextField } from "@mui/material";

import PageHead from "../../../components/Common/PageHead";
import TagRow from "../../../components/Work/TagRow";
import { useAuthState } from "../../../hook/useAuthState";
import { useErrorState } from "../../../hook/useErrorState";
import { WorkTagUpdate } from "../../../interfaces/work";
import { apiClient, createServerApiClient } from "../../../utils/fetch/client";

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const client = createServerApiClient(req);

  try {
    const tagsRes = await client.GET("/work/tag");
    const tags = tagsRes.data?.tags || [];

    const tagDetails = await Promise.all(
      tags.map(async (tag) => {
        try {
          const detailRes = await client.GET("/work/tag/{tagId}", {
            params: {
              path: {
                tagId: tag.tagId,
              },
            },
          });
          return detailRes.data;
        } catch {
          return null;
        }
      }),
    );

    const validTagDetails = tagDetails.filter((detail) => detail !== null && detail !== undefined);

    return {
      props: {
        tagDetails: validTagDetails,
      },
    };
  } catch {
    return {
      props: {
        tagDetails: [],
      },
    };
  }
};

const WorkTagIndexPage = ({
  tagDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { authState } = useAuthState();
  const { setNewError, removeError } = useErrorState();
  const [createModal, setCreateModal] = useState(false);
  const [newTag, setNewTag] = useState<WorkTagUpdate>({ name: "", description: "" });

  const createWorkTag = async (name: string, description: string) => {
    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "work-tag-create-fail", message: "ログインしてください" });
      return;
    }

    if (name.length === 0) {
      setNewError({ name: "work-tag-create-fail", message: "タグ名を入力してください" });
      return;
    }

    try {
      await apiClient.POST("/work/tag", {
        body: {
          name,
          description,
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      removeError("work-tag-create-fail");
      router.reload();
    } catch {
      setNewError({ name: "work-tag-create-fail", message: "タグの新規作成に失敗しました" });
    }
  };

  const deleteWorkTag = async (tagId: string) => {
    if (!authState.isLogined || !authState.token) {
      setNewError({ name: "work-tag-delete-fail", message: "ログインしてください" });
      return;
    }

    try {
      await apiClient.DELETE("/work/tag/{tagId}", {
        params: {
          path: {
            tagId,
          },
        },
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      removeError("work-tag-delete-fail");
      router.reload();
    } catch {
      setNewError({ name: "work-tag-delete-fail", message: "タグの削除に失敗しました" });
    }
  };

  return (
    <>
      <PageHead title="作品タグ一覧" />
      <div>
        <div>
          <Button variant="contained" onClick={() => setCreateModal(true)}>
            新規作成
          </Button>
        </div>
        <div>
          {tagDetails.map((tagDetail) => (
            <TagRow key={tagDetail.tagId} tagDetail={tagDetail} deleteWorkTag={deleteWorkTag} />
          ))}
        </div>
      </div>

      <Modal open={createModal}>
        <Box style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
          <Box sx={{ bgcolor: "background.paper", p: 4 }}>
            <TextField
              label="タグ名"
              variant="outlined"
              required
              margin="normal"
              fullWidth
              value={newTag.name}
              onChange={(e) => {
                setNewTag({ ...newTag, name: e.target.value });
              }}
            />
            <TextField
              label="説明"
              variant="outlined"
              required
              margin="normal"
              fullWidth
              value={newTag.description}
              onChange={(e) => {
                setNewTag({ ...newTag, description: e.target.value });
              }}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ margin: "1rem" }}
              onClick={() => {
                createWorkTag(newTag.name, newTag.description);
                setCreateModal(false);
                setNewTag({ name: "", description: "" });
              }}
            >
              作成
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setCreateModal(false);
                setNewTag({ name: "", description: "" });
              }}
              style={{ margin: "1rem" }}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default WorkTagIndexPage;
