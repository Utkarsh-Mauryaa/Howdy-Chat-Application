import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import { useEffect } from "react";
import axios from "axios";
import { server } from "./utils/config";
import { useDispatch, useSelector } from "react-redux";
import {
  adminExists,
  adminNotExists,
  userExists,
  userNotExists,
} from "./redux/reducer/auth";

const Home = lazy(() => import("./pages/Home"));
const Groups = lazy(() => import("./pages/Groups"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));

import toast, { Toaster } from "react-hot-toast";
import { SocketProvider } from "./utils/socket";

const App = () => {
  const dispatch = useDispatch();
  const { user, userLoading, adminLoading } = useSelector(
    (state) => state.auth,
  ); // we get the user from the redux store, here state is entire Redux store state

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, []);

  useEffect(() => {
    axios
      .get(`${server}/api/v1/admin/`, { withCredentials: true })
      .then(({ data }) => dispatch(adminExists(data.admin)))
      .catch((err) => {
        dispatch(adminNotExists());
      });
  }, []);

  return userLoading || adminLoading ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          <Route
            path="/login"
            element={<ProtectRoute user={!user} redirect="/" />}
          >
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
