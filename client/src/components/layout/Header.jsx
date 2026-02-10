import { IoMdSearch } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import { IoMenuOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { lazy, Suspense } from "react";
import { Backdrop, Tooltip } from "@mui/material";
import axios from "axios";
import { server } from "../../utils/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducer/auth";
import { setIsMobile, setIsSearch } from "../../redux/reducer/misc";

const SearchDialog = lazy(() => import("../specific/Search"));
const Notifications = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const dispatch = useDispatch()
  const { isSearch } = useSelector(state => state.misc)
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const navigate = useNavigate();
  const handleMobile = () => {
    dispatch(setIsMobile(true))
  };
  const openSearchDialog = () => {
    dispatch(setIsSearch(true))
  };
  const openNewGroup = () => {
    setIsNewGroup((prev) => !prev);
  };
  const navigateToGroup = () => {
    navigate("/groups");
  };
  const openNotifications = () => {
    setIsNotification((prev) => !prev);
  };
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <nav className="flex bg-rose-400 h-[45px] justify-between">
        <p className="ml-3 mt-2 hidden min-[640px]:block">Howdy!</p>
        <Tooltip title={"See chats"}>
          <IoMenuOutline
            onClick={handleMobile}
            className="ml-3 mt-2 h-[30px] w-[25px] cursor-pointer block min-[640px]:hidden cursor-pointer"
          />
        </Tooltip>
        <div className="flex gap-8 mr-4">
          <Tooltip title={"Search a chat"}>
            <IoMdSearch
              onClick={openSearchDialog}
              className="h-[25px] w-[22px] mt-3 min-[640px]:h-[30px] min-[640px]:w-[25px] min-[640px]:mt-2 cursor-pointer"
            />
          </Tooltip>

          <Tooltip title={"Add someone"}>
            <IoAddOutline
              onClick={openNewGroup}
              className="h-[25px] w-[22px] mt-3 min-[640px]:h-[30px] min-[640px]:w-[25px] min-[640px]:mt-2 cursor-pointer"
            />
          </Tooltip>

          <Tooltip title={"See Groups"}>
            <MdGroupAdd
              onClick={navigateToGroup}
              className="h-[25px] w-[22px] mt-3 min-[640px]:h-[30px] min-[640px]:w-[25px] min-[640px]:mt-2 cursor-pointer"
            />
          </Tooltip>

          <Tooltip title={"Notifications"}>
            <IoMdNotifications
              onClick={openNotifications}
              className="h-[22px] w-[25px] mt-3 min-[640px]:h-[30px] min-[640px]:w-[25px] min-[640px]:mt-2 cursor-pointer"
            />
          </Tooltip>

          <Tooltip title={"Log out"}>
            <IoExit
              onClick={logoutHandler}
              className="h-[25px] w-[22px] mt-3 min-[640px]:h-[30px] min-[640px]:w-[25px] min-[640px]:mt-2 cursor-pointer"
            />
          </Tooltip>
        </div>
      </nav>
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notifications />
        </Suspense>
      )}
    </>
  );
};

export default Header;
