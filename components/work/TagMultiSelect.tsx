import {
  Stack,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { useWorkTags } from "../../hook/work/useWorkTag";
import { WorkTag } from "../../interfaces/work";

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
              const workTag = workTags.filter((workTag) => workTag.id === value)[0];
              return <Chip key={value} label={workTag.name} />;
            })}
          </Stack>
        )}
      >
        {workTags.map((value) => (
          <MenuItem key={value.id} value={value.id}>
            <span>{value.name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagMultiSelect;
