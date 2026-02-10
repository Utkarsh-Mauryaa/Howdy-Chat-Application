import { useInputValidation } from '6pp'
import { Button, Dialog, DialogTitle, TextField } from '@mui/material'
import { useState } from 'react'
import { sampleUsers } from '../../utils/sampleData'
import UserItem from '../shared/UserItem'

const NewGroup = () => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectMemberHandler = (id) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter((currElement) => currElement !== id) : [...prev, id])
  }
  const submitHandler = () => {}
  const closeHandler = () => {}
  const groupName = useInputValidation("");
  return (
    <Dialog open onClose={closeHandler}>
      <div className="p-4 flex flex-col w-[270px] min-[465px]:w-[430px]">
        <DialogTitle sx={{ margin: "auto" }}>
          New Group
        </DialogTitle>
        <TextField label="Group Name" sx={{ margin: "auto" }} onChange={groupName.changeHandler} />
        <p className="p-4 text-center">Members</p>
        <div className="flex flex-col m-auto w-[calc(100%-30px)] min-[465px]:w-[290px]">
          {members.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </div>
        <div className="flex gap-4 m-auto p-2">
          <Button sx={{ border: "1px solid #bae6fd" }} onClick={submitHandler}>
            Create
          </Button>
          <Button color='error' sx={{ border: "1px solid #fdbabaff" }}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default NewGroup
