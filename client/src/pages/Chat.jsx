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
import {
  ALERT,
  CHAT_LEAVED,
  CHAT_OPENED,
  MEMBER_REMOVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../utils/events";
import { getSocket } from "../utils/socket";
import { useEffect } from "react";
import { removeMessagesAlert } from "../redux/reducer/chat.slice";
import { TypingLoader } from "../components/layout/Loaders";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [page, setPage] = useState(1);

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

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

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // emmitting message to the server
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_OPENED, {userId: user._id, members})
    dispatch(removeMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage([]);
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, {userId: user._id, members})
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatDetails.isLoading && chatDetails.isError) {
      toast.error("Chat not found or you are not a member.");
      navigate("/");
    }
  }, [chatDetails.isLoading, chatDetails.isError, navigate]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId],
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId],
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId],
  );

  const alertListener = useCallback(
    (data) => {
      if(data.chatId !== chatId) return
      const messageForAlert = {
        content:data.message,
        sender: {
          _id: "sdfknksmdfkm",
          name: "",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId],
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        className="flex-1 flex flex-col bg-neutral-200 overflow-x-hidden overflow-y-auto p-4"
      >
        {allMessages.map((i) => (
          <Message key={i._id} message={i} user={user} />
        ))}
        <span ref={bottomRef} />
      </div>
      {userTyping && <TypingLoader />}
      <form
        className="flex-shrink-0 p-4 bg-white border-t border-neutral-300"
        onSubmit={submitHandler}
      >
        <div className="flex items-center gap-2">
          <IconButton
            sx={{
              backgroundColor: "#5a9dd7ff",
              color: "white",
              "&:hover": {
                bgcolor: "#3794e6ff",
              },
              height: "48px",
              width: "48px",
            }}
            onClick={handleFileOpen}
          >
            <IoMdAttach />
          </IconButton>
          <input
            className="flex-1 h-12 border-2 border-neutral-500 outline-none rounded-2xl px-5"
            placeholder="Type your message here...."
            value={message}
            onChange={messageOnChange}
          />

          <IconButton
            type="submit"
            sx={{
              backgroundColor: "#cc7889ff",
              color: "white",
              "&:hover": {
                bgcolor: "error.dark",
              },
              height: "48px",
              width: "48px",
            }}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </div>
  );
};

export default AppLayout()(Chat);
