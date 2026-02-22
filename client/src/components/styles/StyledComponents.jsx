
import {Link as LinkComponent} from 'react-router-dom'
import { keyframes, Skeleton, styled } from '@mui/material'

export const Link = styled(LinkComponent)`
 text-decoration: none,
 color: black;
 padding:0;
 &:hover {
 background-color: #f0577dff;
 }
`
const bounceAnimation = keyframes`
0% {transform: scale(1); }
50% {transform: scale(1.5); }
100% {transform: scale(1); }
`;

export const BouncingSkeleton = styled(Skeleton)(() => ({
    animation: `${bounceAnimation} 1s infinite`,
}))

export const SearchField = styled('input')`
padding: 8px 12px;
border: 1px solid #ccc;
border-radius: 8px;
transition: all 0.3s ease;
&:focus {
    outline: none;
    border-color: rgb(150, 147, 147);
    box-shadow: 0 0 5px rgba(161, 155, 156, 0.5);
    transform: scale(1.05);
}
    background-color: #f9f9f9;
    font-size: 1rem;
    outline: none;
    width: 100%;
    max-width: 300px;
`

export const CurveButton = styled('button')`
border-radius: 20px;
background-color: rgb(74, 70, 72);
color: white;
padding: 10px 20px;
border: none;
cursor: pointer;
transition: all 0.3s ease;
&:hover {
    background-color: rgb(39, 37, 37);
    transform: scale(1.05);
}
    outline: none;
    font-size: 1rem;
`

