
import {Link as LinkComponent} from 'react-router-dom'
import { styled } from '@mui/material'

export const Link = styled(LinkComponent)`
 text-decoration: none,
 color: black;
 padding:0;
 &:hover {
 background-color: #f0577dff;
 }
`

