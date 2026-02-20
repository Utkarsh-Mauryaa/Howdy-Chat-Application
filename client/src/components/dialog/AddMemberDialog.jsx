import { Dialog, DialogTitle, Button, Skeleton } from "@mui/material";
import { sampleUsers } from "../../utils/sampleData";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducer/misc";

const AddMemberDialog = ({ chatId }) => {
const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const {isLoading, data, isError, error} = useAvailableFriendsQuery(chatId)

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation,
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const addMemberSubmit = () => {
    addMembers("Adding Members...", {members: selectedMembers, chatId})
    closeHandler(); // will make afterwards when making backend
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  useErrors([{isError, error}])
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <div className="flex flex-col text-center w-[340px] m-2">
        <DialogTitle>Add Member</DialogTitle>
        <div className="flex flex-col m-2">
          {isLoading? <Skeleton/> : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => {
              return (
                <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
              );
            })
          ) : (
            <p className="font-sans font-normal">No friends</p>
          )}
        </div>
        <div
          className="flex w-fit ml-auto 
        mr-auto mt-4 gap-2"
        >
          <Button color="error" variant="outlined" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            disabled={isLoadingAddMembers}
            onClick={addMemberSubmit}
          >
            Add
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddMemberDialog;
