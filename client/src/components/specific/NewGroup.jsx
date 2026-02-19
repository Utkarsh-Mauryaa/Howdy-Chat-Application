import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { sampleUsers } from "../../utils/sampleData";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducer/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery("");

  console.log(data)

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id],
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Select at least 2 members");
    newGroup("Creating New Group....", { name: groupName.value, members: selectedMembers });
    closeHandler();
  };
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  const groupName = useInputValidation("");
  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <div className="p-4 flex flex-col w-[270px] min-[465px]:w-[430px]">
        <DialogTitle sx={{ margin: "auto" }}>New Group</DialogTitle>
        <TextField
          label="Group Name"
          sx={{ margin: "auto" }}
          onChange={groupName.changeHandler}
        />
        <p className="p-4 text-center">Members</p>
        <div className="flex flex-col m-auto w-[calc(100%-30px)] min-[465px]:w-[290px]">
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          )}
        </div>
        <div className="flex gap-4 m-auto p-2">
          <Button sx={{ border: "1px solid #bae6fd" }} onClick={submitHandler} disabled={isLoadingNewGroup}>
            Create
          </Button>
          <Button
            color="error"
            sx={{ border: "1px solid #fdbabaff" }}
            onClick={closeHandler}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default NewGroup;
