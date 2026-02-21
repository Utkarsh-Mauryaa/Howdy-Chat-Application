import { Box, Drawer, IconButton, Stack, styled, Typography } from "@mui/material";
import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import {Link as LinkComponent} from 'react-router-dom'
import { MdDashboardCustomize } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { BsChatSquareTextFill } from "react-icons/bs"
import { color } from "framer-motion";


const Link = styled(LinkComponent)`
text-decoration:none;
border-radius: 2rem;
color: black;
padding:1rem 2rem;
&:hover {
    background-color: #f0577dff;
}

`

const adminTabs = [{
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <MdDashboardCustomize />

},
{
    name: "Users",
    path: "/admin/user-management",
    icon: <MdManageAccounts />


},
{
    name: "Chats",
    path: "/admin/group-management",
    icon: <MdGroups />

},
{
    name: "Messages",
    path: "/admin/messages",
    icon: <BsChatSquareTextFill />

},
]

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();

  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
        <Typography variant="h5" textTransform={"uppercase"}>Howdy!</Typography>
        <Stack spacing={"1rem"}>
            {
                adminTabs.map((tab) => 
                    (<Link key={tab.path} to={tab.path}
                    sx={
                        location.pathname === tab.path && {
                            backgroundColor: "#f0577dff",
                            fontWeight: "bold",
                            color: "white",
                            ":hover": {
                                color: "rgba(249, 198, 198, 0.17)",
                            }
                        }
                    }
                    >
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {tab.icon}
                            <Typography sx={{
                                padding: "10px"
                            }}>{tab.name}</Typography>
                        </Stack>
                    </Link>)
                )
            }
        </Stack>

    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => setIsMobile(false);

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-[1fr_3fr] overflow-hidden h-screen">
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "20px",
          top: "20px",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <IoClose /> : <IoMenuOutline />}
        </IconButton>
      </Box>
      <div className="hidden md:block h-full overflow-y-auto">
        <Sidebar />
      </div>

      <div className="h-full overflow-y-auto bg-neutral-200">{children}</div>
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </div>
  );
};

export default AdminLayout;
