import { Avatar, ListItem, Typography } from '@mui/material'
import { memo } from 'react'
import { IoIosAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import { transformImage } from '../../lib/features';


const UserItem = ({ user, handler, handlerIsLoading, isAdded=false, styling}) => {
  const { name, _id, avatar } = user
  return (

    <ListItem>
      <div className={`flex items-center justify-between gap-4 w-full ${styling}`}>
        <Avatar src={transformImage(avatar)}/>
        <p className='mr-auto'>{name}</p>
        <button
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
          className="group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95"
        >
          {isAdded ? <IoIosRemoveCircle className='text-red-300 w-[50px] h-[30px] cursor-pointer group-hover:text-red-500 transition-colors duration-200'/>:<IoIosAddCircle className='text-blue-300 w-[50px] h-[30px] cursor-pointer group-hover:text-blue-500 transition-colors duration-200' />}
        </button>
      </div>
    </ListItem>


  )
}

export default memo(UserItem)
