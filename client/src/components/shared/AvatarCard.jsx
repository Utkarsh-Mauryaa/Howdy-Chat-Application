import { Avatar, AvatarGroup } from '@mui/material'
import { transformImage } from '../../lib/features'
const AvatarCard = ({avatar = [], max=4}) => {
  return (
    <div className='flex'>
        <AvatarGroup max={max} spacing={20}>
            {avatar.map((i, index) => (
                <Avatar
                key={Math.random() * 100}
                src={transformImage(i)}
                alt={`Avatar ${index}`}
                sx={{
                    width: "2rem",
                    height: "2rem",
                    border: "2px solid white"
                }}
                />
            ))}
        </AvatarGroup>
    </div>
  )
}

export default AvatarCard