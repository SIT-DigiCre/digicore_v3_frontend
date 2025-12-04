import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";

type PaginationProps = {
  page: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  hasPreviousPage,
  hasNextPage,
  onChange,
}) => {
  const handlePrevClick = () => {
    if (!hasPreviousPage) return;
    onChange(page - 1);
  };

  const handleNextClick = () => {
    if (!hasNextPage) return;
    onChange(page + 1);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mt={2}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={handlePrevClick}
        disabled={!hasPreviousPage}
      >
        前へ
      </Button>
      <Typography>{page} ページ目</Typography>
      <Button
        variant="outlined"
        endIcon={<ArrowForward />}
        onClick={handleNextClick}
        disabled={!hasNextPage}
      >
        次へ
      </Button>
    </Stack>
  );
};

export default Pagination;
