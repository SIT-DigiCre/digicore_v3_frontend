import { Chip, Stack } from "@mui/material";

type Props = {
  chipList: string[];
  onClick?: (index: number) => void;
};

const ChipList = ({ chipList, onClick }: Props) => (
  <Stack spacing={1} direction="row">
    {chipList.map((chipName, i) =>
      onClick ? (
        <Chip key={chipName} label={chipName} onClick={() => onClick(i)} />
      ) : (
        <Chip key={chipName} label={chipName} />
      ),
    )}
  </Stack>
);

export default ChipList;
