import { Drawer, IconButton } from "@mui/material";
import { useState } from "react";
import { IoMenuOutline, IoClose } from "react-icons/io5";
import { Navigate, useLocation, Link } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { BsChatSquareTextFill } from "react-icons/bs";
import { MdOutlineExitToApp } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLazyAdminLogoutQuery } from "../../redux/api/api";
import { adminNotExists } from "../../redux/reducer/auth";
import toast from "react-hot-toast";

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <MdDashboardCustomize />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <MdManageAccounts />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <MdGroups />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <BsChatSquareTextFill />,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [adminLogout, _] = useLazyAdminLogoutQuery();

  const logoutHandler = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      const res = await adminLogout().unwrap();
      toast.success(res.message || "Logout successful!", {
        id: toastId,
      });
      dispatch(adminNotExists());
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed", {
        id: toastId,
      });
      dispatch(adminNotExists());
    }
  };

  return (
    <div className="h-full w-full flex flex-col px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
      {/* Header */}
      <h2 className="text-xl md:text-2xl font-semibold uppercase mb-8 md:mb-10 lg:mb-12">
        Howdy!
      </h2>

      {/* Navigation Links */}
      <div className="flex flex-col gap-3">
        {adminTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`
                flex items-center gap-4 px-6 py-3 rounded-full 
                transition-all duration-200 no-underline
                ${
                  isActive
                    ? "bg-[#f0577dff] text-white font-semibold"
                    : "text-black hover:bg-[#f0577dff] hover:text-white"
                }
              `}
            >
              <span className="text-xl md:text-2xl flex-shrink-0">
                {tab.icon}
              </span>
              <span className="text-sm md:text-base whitespace-nowrap">
                {tab.name}
              </span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={logoutHandler}
          className="
            flex items-center gap-4 px-6 py-3 rounded-full 
            text-black hover:bg-[#f0577dff] hover:text-white 
            transition-all duration-200 text-left w-full
          "
        >
          <span className="text-xl md:text-2xl flex-shrink-0">
            <MdOutlineExitToApp />
          </span>
          <span className="text-sm md:text-base whitespace-nowrap">Logout</span>
        </button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => setIsMobile(false);

  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex h-screen overflow-y-hidden">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <IconButton
          onClick={handleMobile}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          {isMobile ? (
            <IoClose className="text-2xl" />
          ) : (
            <IoMenuOutline className="md:text-2xl text-sm" />
          )}
        </IconButton>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-[280px] lg:w-[300px] xl:w-[320px] h-screen overflow-y-auto bg-white border-r border-gray-200 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-neutral-200">
        <div className="w-full h-full p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Drawer */}
      <Drawer
        open={isMobile}
        onClose={handleClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "280px",
            maxWidth: "85vw",
          },
        }}
      >
        <Sidebar />
      </Drawer>
    </div>
  );
};

export default AdminLayout;
