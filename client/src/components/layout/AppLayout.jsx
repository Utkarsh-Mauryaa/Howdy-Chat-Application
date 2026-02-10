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

function AppLayout() {
  return function (WrappedComponent) {
    return function Insider(props) {
      const params = useParams();
      const dispatch = useDispatch();
      const chatId = params.chatId;
      const { isMobile } = useSelector((state) => state.misc);
const {user} = useSelector(state => state.auth);
      const { isLoading, data, isError, error, refetch } = useGetMyChatsQuery("");

      useErrors([{isError, error}])

      const handleDeleteChat = (e, _id, groupChat) => {
        e.preventDefault();
        console.log("Delete chat", _id, groupChat);
      };
      const handleMobileClose = () => dispatch(setIsMobile(false));
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
                  newMessagesAlert={[{ chatId, count: 4 }]}
                  onlineUsers={["1", "2"]}
                  handleDeleteChat={handleDeleteChat}
                />
              </Drawer>
            )}

            <div className="flex-grow grid grid-cols-[1.2fr_2fr_1fr] overflow-hidden">
              <div className="h-full overflow-auto col-span-3 min-[640px]:col-span-1">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <ChatList
                    chats={data?.chats}
                    chatId={chatId}
                    newMessagesAlert={[{ chatId, count: 4 }]}
                    onlineUsers={["1", "2"]}
                    handleDeleteChat={handleDeleteChat}
                  />
                )}
              </div>
              <div className="bg-neutral-200 h-full w-full col-span-2 min-[1024px]:col-span-1 hidden min-[640px]:block">
                <WrappedComponent />
              </div>
              <div className="h-full text-stone-50 hidden min-[1024px]:block bg-neutral-900">
                <Profile user={user}/>
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
