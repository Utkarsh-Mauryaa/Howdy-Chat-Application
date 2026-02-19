import { useParams } from "react-router-dom";
import { sampleChats } from "../../utils/sampleData";
import Title from "../shared/Title";
import ChatList from "../specific/Chatlist";
import Header from "./Header";
import Profile from "../specific/Profile";
import { useGetMyChatsQuery } from "../../redux/api/api";
import { Drawer, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducer/misc";
import { useErrors } from "../../hooks/hook";
import { getSocket } from "../../utils/socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from "../../utils/events";
import { useSocketEvents } from "6pp";
import { useCallback } from "react";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducer/chat.slice";
import { useEffect } from "react";
import { getOrSaveFromStorage } from "../../lib/features";

function AppLayout() {
  return function (WrappedComponent) {
    return function Insider(props) {
      const params = useParams();
      const dispatch = useDispatch();
      const chatId = params.chatId;
      const socket = getSocket();
      const { isMobile } = useSelector((state) => state.misc);
      const { user } = useSelector((state) => state.auth);
      const {newMessagesAlert} = useSelector((state) => state.chat)
      const { isLoading, data, isError, error, refetch } =
        useGetMyChatsQuery("");

      useErrors([{ isError, error }]);

      useEffect(() => {
        getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value:newMessagesAlert})
      }, [newMessagesAlert])

      const handleDeleteChat = (e, _id, groupChat) => {
        e.preventDefault();
        console.log("Delete chat", _id, groupChat);
      };
      const handleMobileClose = () => dispatch(setIsMobile(false));

      const newMessageAlertHandler = useCallback((data) => {
        if(data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      }, [chatId]);

      const newRequestListener = useCallback(() => {
        dispatch(incrementNotification());
      }, []);

      const refetchListener = useCallback(() => {
        refetch();
      }, []);

      const eventHandler = {
        [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]: refetchListener,
      };

      useSocketEvents(socket, eventHandler);

      return (
        <>
          <Title />
          <div className="flex flex-col h-screen">
            <Header />

            {isLoading ? (
              <Skeleton />
            ) : (
              <Drawer open={isMobile} onClose={handleMobileClose}>
                <ChatList
                  w="70vw"
                  chats={data?.chats}
                  chatId={chatId}
                  onlineUsers={["1", "2"]}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                />
              </Drawer>
            )}

            <div className="flex-grow grid grid-cols-[1.2fr_2fr_1fr] overflow-hidden h-full">
              <div className="h-full overflow-y-auto col-span-3 min-[640px]:col-span-1">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <ChatList
                    chats={data?.chats}
                    chatId={chatId}
                    onlineUsers={["1", "2"]}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                  />
                )}
              </div>
              <div className="bg-neutral-200 h-full w-full col-span-2 min-[1024px]:col-span-1 hidden min-[640px]:block overflow-hidden">
                <WrappedComponent {...props} chatId={chatId} user={user} />
              </div>
              <div className="h-full text-stone-50 hidden min-[1024px]:block bg-neutral-900 overflow-y-auto">
                <Profile user={user} />
              </div>
            </div>
          </div>
        </>
      );
    };
  };
}
// explanation of the code http://claude.ai/chat/2ea6c347-df3b-4d30-9b89-8b4758b13553
export default AppLayout;