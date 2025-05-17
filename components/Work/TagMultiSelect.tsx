import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";

import { useWorkTags } from "../../hook/work/useWorkTag";

type Props = {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
};

const TagMultiSelect = ({ selectedTags, onChange }: Props) => {
  const { workTags } = useWorkTags();
  const handleOnChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    if (typeof value === "string") {
      onChange([value]);
    } else {
      onChange(value);
    }
  };
  if (workTags.length === 0) return <></>;
  return (
    <FormControl>
      <InputLabel id="multiple-tag-label">タグ</InputLabel>
      <Select
        labelId="multiple-tag-label"
        multiple
        value={selectedTags}
        onChange={handleOnChange}
        input={<OutlinedInput label="タグ" />}
        renderValue={(selected) => (
          <Stack direction="row" spacing={1}>
            {selected.map((value) => {
              const workTag = workTags.filter((workTag) => workTag.tagId === value)[0];
              return <Chip key={value} label={workTag.name} />;
            })}
          </Stack>
        )}
      >
        {workTags.map((value) => (
          <MenuItem key={value.tagId} value={value.tagId}>
            <span>{value.name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagMultiSelect;
