import { useRef } from "react";
import AppLayout from "../components/layout/AppLayout"
import { IoMdAttach } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { IconButton } from "@mui/material";
import FileMenu from "../components/dialog/FileMenu";
import { sampleMessage } from "../utils/sampleData";
import Message from "../components/shared/Message";

const Chat = () => {
  const containerRef = useRef(null);
  const user = {
    _id: "ksdjfk",
    name: "rohan"
  }
  return (
    <>
      <div ref={containerRef} className="flex flex-col bg-neutral-200 overflow-x-hidden overflow-y-auto p-4 h-[90%]">
{sampleMessage.map((i => <Message key={i._id} message={i} user={user}/>))}
      </div>
      <form className="h-[10%]">
        <div className="flex">
          <IconButton sx={{
            backgroundColor: "#5a9dd7ff",
            color: "white",
            "&:hover":{
bgcolor: "#3794e6ff"
            },
            margin:"7px",
            height:"40px",
            position:"relative",
            top:"6px"
          }}>
            <IoMdAttach/>
          </IconButton>

          <input className="w-full h-full border-2 border-neutral-500 outline-none rounded-2xl p-5" placeholder="Type your message here...."/>

          <IconButton type="submit" sx={{
            backgroundColor: "#cc7889ff",
            color: "white",
            "&:hover":{
bgcolor: "error.dark"
            },
            margin:"7px",
            height:"40px",
            position:"relative",
            top:"6px"
          }}>
            <IoMdSend/>
          </IconButton>
        </div>
      </form>
      <FileMenu/>
    </>
  )
}

export default AppLayout()(Chat)
