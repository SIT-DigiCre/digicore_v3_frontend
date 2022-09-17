import { Stack, Chip } from "@mui/material";

type Props = {
  chipList: string[];
  onClick?: (index: number) => void;
};

const ChipList = ({ chipList, onClick }: Props) => (
  <Stack spacing={1} direction="row">
    {chipList.map((chipName, i) =>
      onClick ? <Chip label={chipName} onClick={() => onClick(i)} /> : <Chip label={chipName} />,
    )}
  </Stack>
);

export default ChipList;
