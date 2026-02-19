
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

