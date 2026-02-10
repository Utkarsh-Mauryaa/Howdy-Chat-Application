import { Dialog, DialogTitle, Button } from "@mui/material";
import { sampleUsers } from "../../utils/sampleData";
import UserItem from "../shared/UserItem";
import { useState } from "react";

const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const addMemberSubmit = () => {
    closeHandler(); // will make afterwards when making backend
  };
  const closeHandler = () => {
    setSelectedMembers([]); //just for eg
    setMembers([]);
  };
  return (
    <Dialog open onClose={closeHandler}>
      <div className="flex flex-col text-center w-[340px] m-2">
        <DialogTitle>Add Member</DialogTitle>
        <div className="flex flex-col m-2">
          {members.length > 0 ? (
            members.map((i) => {
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
            disabled={isLoadingAddMember}
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
