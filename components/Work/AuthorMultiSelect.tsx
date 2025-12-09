import { FormControl, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { UserProfile, useUserProfiles } from "../../hook/user/useUserProfiles";

type Props = {
  selectedAuthorIds: string[];
  onChange: (authorIds: string[]) => void;
};

const AuthorMultiSelect = ({ selectedAuthorIds, onChange }: Props) => {
  const { userProfiles } = useUserProfiles();
  if (!userProfiles || userProfiles.length === 0) return null;

  const selectedAuthors = userProfiles.filter((userProfile) =>
    selectedAuthorIds.includes(userProfile.userId),
  );

  return (
    <FormControl>
      {/* <InputLabel id="multiple-author-label">作者</InputLabel> */}
      <Autocomplete<UserProfile>
        multiple
        options={userProfiles}
        getOptionLabel={(userProfile) => userProfile.username}
        value={selectedAuthors}
        renderInput={(params) => <TextField {...params} label="作者" />}
      />
      {/* <Select
        labelId="multiple-author-label"
        multiple={true}
        value={selectedAuthors}
        onChange={(event) => {
          const value = event.target.value;
          if (typeof value === "string") {
            onChange([value]);
          } else {
            onChange(value);
          }
        }}
        input={<OutlinedInput label="作者" />}
        renderValue={(selected) => (
          <Stack direction="row" spacing={1}>
            {selected.map((value) => {
              const userProfile = userProfiles.filter(
                (userProfile) => userProfile.userId === value,
              )[0];
              return <Chip key={value} label={userProfile.username} />;
            })}
          </Stack>
        )}
      >
        {userProfiles.map((userProfile) => (
          <MenuItem key={userProfile.userId} value={userProfile.userId}>
            <span>{userProfile.username}</span>
          </MenuItem>
        ))}
      </Select> */}
    </FormControl>
  );
};

export default AuthorMultiSelect;
