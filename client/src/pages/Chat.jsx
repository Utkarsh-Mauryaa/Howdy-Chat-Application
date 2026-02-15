import { useInfiniteScrollTop, useSocketEvents } from "6pp";
import { IconButton, Skeleton } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { IoMdAttach, IoMdSend } from "react-icons/io";
import { useDispatch } from "react-redux";
import FileMenu from "../components/dialog/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import Message from "../components/shared/Message";
import { useErrors } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { setIsFileMenu } from "../redux/reducer/misc";
import { NEW_MESSAGE } from "../utils/events";
import { getSocket } from "../utils/socket";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [page, setPage] = useState(1);

  const[fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const chatDetails = useChatDetailsQuery({ chatId }, { skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages,
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget)
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // emmitting message to the server
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessagesHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data.message]);
  }, []);

  const eventHandler = { [NEW_MESSAGE]: newMessagesHandler };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <div
        ref={containerRef}
        className="flex flex-col bg-neutral-200 overflow-x-hidden overflow-y-auto p-4 h-[620px]"
      >
        {allMessages.map((i) => (
          <Message key={i._id} message={i} user={user} />
        ))}
      </div>
      <form className="h-[100px]" onSubmit={submitHandler}>
        <div className="flex">
          <IconButton
            sx={{
              backgroundColor: "#5a9dd7ff",
              color: "white",
              "&:hover": {
                bgcolor: "#3794e6ff",
              },
              margin: "7px",
              height: "40px",
              position: "relative",
              top: "6px",
            }}
            onClick={handleFileOpen}
          >
            <IoMdAttach />
          </IconButton>

          <input
            className="w-full h-full border-2 border-neutral-500 outline-none rounded-2xl p-5"
            placeholder="Type your message here...."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <IconButton
            type="submit"
            sx={{
              backgroundColor: "#cc7889ff",
              color: "white",
              "&:hover": {
                bgcolor: "error.dark",
              },
              margin: "7px",
              height: "40px",
              position: "relative",
              top: "6px",
            }}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
    </>
  );
};

export default AppLayout()(Chat);
