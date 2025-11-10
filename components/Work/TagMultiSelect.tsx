import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Stack } from "@mui/material";
import Select from "@mui/material/Select";

import { useWorkTags } from "../../hook/work/useWorkTag";

type Props = {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
};

const TagMultiSelect = ({ selectedTags, onChange }: Props) => {
  const { workTags } = useWorkTags();

  if (workTags.length === 0) return null;

  return (
    <FormControl>
      <InputLabel id="multiple-tag-label">タグ</InputLabel>
      <Select
        labelId="multiple-tag-label"
        multiple={true}
        value={selectedTags}
        onChange={(event) => {
          const value = event.target.value;
          if (typeof value === "string") {
            onChange([value]);
          } else {
            onChange(value);
          }
        }}
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
