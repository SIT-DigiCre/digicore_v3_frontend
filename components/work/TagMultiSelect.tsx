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
  selectedTags: WorkTag[];
  onChange: (tags: WorkTag[]) => void;
};

const TagMultiSelect = ({ selectedTags, onChange }: Props) => {
  const { workTags } = useWorkTags();
  const handleOnChange = (e: SelectChangeEvent<WorkTag[]>) => {
    const value = e.target.value;
    if (typeof value !== "string") {
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
            {selected.map((value) => (
              <Chip key={value.id} label={value.name} />
            ))}
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
