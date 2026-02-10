import { memo } from 'react'
import { Link } from '../styles/StyledComponents'
import AvatarCard from './AvatarCard'

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat
}) => {
  return (
    <Link className='p-0' to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
      <div className={`${sameSender? "bg-rose-400":"bg-pink-200"} flex items-center p-4 gap-3 relative`}>
      <AvatarCard avatar={avatar}/>
      <div>
       <p>{name}</p>
       {
        newMessageAlert && (
          <p>
            {newMessageAlert.count} New Message
          </p>
        )
       }
      </div>
      {isOnline && <div className={`
      w-[10px]
      h-[10px]
      rounded-full
      bg-green-400
      ml-auto
      `}
      />}
      </div>
    </Link>
  )
}

export default memo(ChatItem)
