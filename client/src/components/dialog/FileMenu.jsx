import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu } from '../../redux/reducer/misc';
import { FaRegImage } from "react-icons/fa6";

const FileMenu = ({anchorE1}) => {

  const {isFileMenu} = useSelector(state=> state.misc);

  const dispatch = useDispatch();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div className='w-20'>
<MenuList>
  <MenuItem>
  <Tooltip title="Image">
    <FaRegImage />
  </Tooltip>
  <ListItemText style={{marginLeft: "0.5rem"}}>Image</ListItemText>
  </MenuItem>
</MenuList>
      </div>

    </Menu>
  )
}

export default FileMenu
