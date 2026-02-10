import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack } from '@mui/material'
import { memo } from 'react'
import { sampleNotifications } from '../../utils/sampleData'
const Notifications = () => {
  const friendRequestHandler = ({_id, accept}) => {
console.log(_id)
  }
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle sx={{margin:"auto"}}>
          Notifications
        </DialogTitle>
        {
          sampleNotifications.length > 0 ? (sampleNotifications.map((i, index) => <NotificationItem sender={i.sender} _id={i._id} key={index} handler={friendRequestHandler}/>)) : <p className='m-auto'>No notifications</p>
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({sender, _id, handler}) => {
  const {name, avatar} = sender;
   return <ListItem>
      <div className='flex items-center justify-between gap-4 w-full rounded-md border-2 border-pink-100 p-2'>
        <Avatar src={avatar}/>
        <p className='mr-auto'>{`${name} sent you a friend request.`}</p>
        <Stack direction={{
            xs:"column"
          }
        }>
          <Button onClick={() => handler({_id, accept:true})}>
       Accept
          </Button>
          <Button color='error' onClick={() => handler({_id, accept:false})}>
       Reject
          </Button>
        </Stack>
      </div>
    </ListItem>
})

export default Notifications
