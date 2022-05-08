import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthState } from "../../hook/useAuthState";
import { GroupAPIData, GroupsAPIData } from "../../interfaces/api";
import { axios } from "../../utils/axios";

const GenerationSelect = () => {
  const { authState } = useAuthState();
  const [currentSelect, setCurrentSelect] = useState<string>();
  const [groups, setGroups] = useState<GroupsAPIData>();
  const getGenerations = () => {
    axios
      .get("/group", {
        headers: {
          Authorization: "bearer " + authState.token,
        },
      })
      .then((res) => {
        const groupsApiData: GroupsAPIData = res.data;
        const generations: GroupsAPIData = {
          groups: groupsApiData.groups.filter((g) => /\d\dth/.test(g.name)),
        };
        setGroups(generations);
        setCurrentSelect(
          generations.groups.find((g) => g.joined)
            ? generations.groups.find((g) => g.joined).id
            : undefined,
        );
      });
  };
  useEffect(() => {
    if (!authState.isLogined) return;
    getGenerations();
  }, [authState]);
  const onChange = (e: SelectChangeEvent<string>) => {
    if (currentSelect) {
      axios
        .delete(`/group/${currentSelect}`, {
          headers: {
            Authorization: "bearer " + authState.token,
          },
        })
        .then((res) => {
          setCurrentSelect(e.target.value);
          axios
            .post(
              `/group/${currentSelect}`,
              {},
              {
                headers: {
                  Authorization: "bearer " + authState.token,
                },
              },
            )
            .then((res1) => getGenerations());
        });
    } else {
      setCurrentSelect(e.target.value);
      axios
        .post(
          `/group/${currentSelect}`,
          {},
          {
            headers: {
              Authorization: "bearer " + authState.token,
            },
          },
        )
        .then((res1) => getGenerations());
    }
  };
  if (!groups) return <></>;
  return (
    <FormControl fullWidth>
      <InputLabel>〇〇期</InputLabel>
      <Select onChange={onChange} value={currentSelect}>
        {groups.groups.map((group) => (
          <MenuItem value={group.id}>{group.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenerationSelect;
