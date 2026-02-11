import { Avatar } from '@mui/material'
import { FaUser } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FaCircleInfo } from "react-icons/fa6";
import moment from 'moment'
import {transformImage} from '../../lib/features'

const Profile = ({user}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Avatar 
      src={transformImage(user?.avatar?.url)}
      sx={{
        width:170,
        height:170,
        objectFit: "contain",
        marginBottom: "1rem",
        border:"5px solid white",
        marginTop: "8px"
      }}
      
      />
      <ProfileCard heading={"Bio"} text={user?.bio} Icon={<FaCircleInfo  className='h-6'/>}/>
      <ProfileCard heading={"Name"} text={user?.name} Icon={<MdOutlineDriveFileRenameOutline  className='h-8 w-6'/>}/>
      <ProfileCard heading={"Username"} text={user?.username} Icon={<FaUser />}/>
      <ProfileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<FaCalendarAlt />}/>
    </div>
  )
}
const ProfileCard = ({text, Icon, heading}) => {
  return <div className='flex items-center gap-4 text-center w-full justify-center m-2'>
    {Icon && <div className='relative top-[-6px]'>
    {Icon}
    </div>}
    <div className='flex flex-col'>
      <h1 className='font-bold text-center'>
        {text}
      </h1>
      <h4>
        {heading}
      </h4>
    </div>
  </div>
}

export default Profile
