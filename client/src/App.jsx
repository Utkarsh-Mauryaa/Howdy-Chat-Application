import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import { useEffect } from "react";
import axios from "axios";
import { server } from "./utils/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducer/auth";
const Home = lazy(() => import("./pages/Home"));
const Groups = lazy(() => import("./pages/Groups"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import('./pages/NotFound'));
import {Toaster} from 'react-hot-toast'
import { SocketProvider } from "./utils/socket";


const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);  // we get the user from the redux store, here state is entire Redux store state

  useEffect(() => {
    axios.get(`${server}/api/v1/user/me`, {withCredentials: true})
    .then(({data}) => dispatch(userExists(data.user)))
    .catch((err) => dispatch(userNotExists()));
  }, [])

  return loading ? <LayoutLoader /> : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={<SocketProvider>
            <ProtectRoute user={user} />
          </SocketProvider>}>

            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />

          </Route>
          <Route path="/login" element={<ProtectRoute user={!user} redirect="/" />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
      <Toaster position="bottom-center"/>

    </BrowserRouter>
  )
}

export default App
