import { useState } from "react";

import { Autocomplete, Avatar, Chip, FormControl, TextField } from "@mui/material";

import { useUserSearch } from "../../hook/user/useUserSearch";
import { WorkAuthor } from "../../interfaces/work";

type Props = {
  initAuthors: WorkAuthor[];
  currentUser: WorkAuthor;
  onChange: (authorIds: string[]) => void;
};

const MAX_SELECTED_AUTHORS = 3;

const AuthorMultiSelect = ({ initAuthors, currentUser, onChange }: Props) => {
  const { searchResults, searchUsers } = useUserSearch();
  const [authors, setAuthors] = useState<WorkAuthor[]>(initAuthors);

  const handleChange = (newAuthors: WorkAuthor[]) => {
    if (newAuthors.length > MAX_SELECTED_AUTHORS) {
      return;
    }
    if (newAuthors.length === 0) {
      setAuthors([currentUser]);
      onChange([currentUser.userId]);
      return;
    }
    setAuthors(newAuthors);
    const newAuthorIds = newAuthors.map((author) => author.userId);
    onChange(newAuthorIds);
  };

  return (
    <FormControl>
      <Autocomplete
        multiple
        filterSelectedOptions
        filterOptions={(x) => x}
        value={authors}
        onChange={(_event, newValue) => {
          handleChange(newValue);
        }}
        renderValue={(value, getItemProps) =>
          value.map((option, index) => {
            const isCurrentUser = option.userId === currentUser.userId;
            const { key, onDelete, ...itemProps } = getItemProps({ index });
            return (
              <Chip
                avatar={<Avatar src={option.iconUrl} />}
                label={option.username}
                key={key}
                onDelete={isCurrentUser ? undefined : onDelete}
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
            <Avatar src={option.iconUrl} alt="" sx={{ width: 24, height: 24, marginRight: 1 }} />
            {option.username}
          </li>
        )}
        onInputChange={(_event, value) => {
          searchUsers(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="作者"
            placeholder="作者"
            disabled={authors.length >= MAX_SELECTED_AUTHORS}
          />
        )}
        sx={{ minWidth: 300, flexWrap: "wrap" }}
      />
    </FormControl>
  );
};

export default AuthorMultiSelect;
