import { Autocomplete, Avatar, Chip, FormControl, TextField } from "@mui/material";
import { useProfiles } from "../../hook/profile/useProfiles";
import { useUserSearch } from "../../hook/user/useUserSearch";
import { UserProfile } from "../../interfaces/user";

type Props = {
  selectedAuthorIds: string[];
  currentUserId: string;
  onChange: (authorIds: string[]) => void;
};

const AuthorMultiSelect = ({ selectedAuthorIds, currentUserId, onChange }: Props) => {
  const { searchResults, searchUsers } = useUserSearch();
  const selectedAuthors = useProfiles(selectedAuthorIds);

  return (
    <FormControl>
      <Autocomplete
        multiple
        filterSelectedOptions
        filterOptions={(x) => x}
        value={selectedAuthors}
        onChange={(event, newValue) => {
          onChange(newValue.map((author) => author.userId));
        }}
        renderValue={(value, getItemProps) =>
          value.map((option, index) => {
            const isCurrentUser = option.userId === currentUserId;
            const { key, ...itemProps } = getItemProps({ index });
            return (
              <Chip
                avatar={<Avatar src={option.iconUrl} />}
                label={option.username}
                key={key}
                onDelete={isCurrentUser ? undefined : itemProps.onDelete}
                {...itemProps}
                disabled={isCurrentUser}
              />
            );
          })
        }
        options={searchResults}
        getOptionKey={(option) => option.userId}
        getOptionLabel={(option) => option.username}
        renderOption={(props, option) => (
          <li {...props} key={option.userId}>
            <Avatar
              src={option.iconUrl}
              alt={option.username}
              sx={{ width: 24, height: 24, marginRight: 1 }}
            />
            {option.username}
          </li>
        )}
        onInputChange={(event, value) => {
          searchUsers(value);
        }}
        renderInput={(params) => <TextField {...params} label="作者" placeholder="作者" />}
        sx={{ width: 500 }}
      />
    </FormControl>
  );
};

export default AuthorMultiSelect;
