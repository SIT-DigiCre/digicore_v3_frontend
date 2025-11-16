import Link from "next/link";

import { Add, FilterList } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

import { ButtonLink } from "../../components/Common/ButtonLink";
import PageHead from "../../components/Common/PageHead";
import { useWorks } from "../../hook/work/useWork";

const MyWorkPage = () => {
  const { works } = useWorks("my");

  return (
    <>
      <PageHead title="自分の作品" />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <ButtonLink href="/work" startIcon={<FilterList />} variant="text">
          作品一覧を見る
        </ButtonLink>
        <ButtonLink href="/work/new" startIcon={<Add />}>
          投稿する
        </ButtonLink>
      </Stack>
      <Stack>
        {works && works.length > 0 ? (
          <List>
            {works.map((w) => (
              <ListItem key={w.workId}>
                <ListItemButton component={Link} href={`/work/${w.workId}`}>
                  <ListItemText
                    secondary={w.authors.map((a) => a.username).join(", ")}
                    primary={w.name}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>
            まだあなたの作品はありません。作品を作ってどんどん投稿していこう!!
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default MyWorkPage;
