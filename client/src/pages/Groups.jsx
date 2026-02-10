import {
  Box,
  Drawer,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  Button,
  Backdrop,
} from "@mui/material";
import { memo, useState, useEffect, Suspense } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import { sampleChats, sampleUsers } from "../utils/sampleData";
import { MdEdit } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { lazy } from "react";
import UserItem from "../components/shared/UserItem";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialog/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialog/AddMemberDialog")
);
const isAddMember = false;
const Groups = () => {
  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    console.log(groupNameUpdatedValue);
  };
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    console.log("Delete group");
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };
  const openAddMemberHandler = () => {
    console.log("add member");
  };
  const deleteHandler = () => {
    console.log("Delete");
    closeConfirmDeleteHandler();
  };
  const removeMemberHandler = (id) => {
    console.log("Removed Member " + id);
  };
  const GroupName = (
    <div className="flex flex-col gap-2">
      {isEdit ? (
        <>
          <TextField
            sx={{
              margin: "15px auto 0px auto",
              width: "340px",
            }}
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton
            onClick={updateGroupName}
            sx={{
              width: "40px",
              margin: "auto",
              padding: "8px",
            }}
          >
            <MdDone />
          </IconButton>
        </>
      ) : (
        <>
          <p className="font-sans text-4xl text-center font-semibold">
            {groupName}
          </p>
          <IconButton
            onClick={() => setIsEdit(true)}
            sx={{
              width: "40px",
              margin: "auto",
              padding: "8px",
            }}
          >
            {" "}
            <MdEdit />
          </IconButton>
        </>
      )}
    </div>
  );
  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);
  const IconBtns = (
    <>
      <Box
        sx={{
          display: "none",
          position: "fixed",
          right: "1rem",
          top: "1rem",
          "@media (max-width:640px)": {
            display: "block",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <IoMenuOutline className="h-[30px] w-[30px]" />
        </IconButton>
      </Box>
      <Tooltip title="Close">
        <IconButton
          className="absolute left-2 top-2"
          sx={{
            ":hover": {
              bgcolor: "rgba(137, 78, 166, 0.7)",
            },
            bgcolor: "rgba(200, 145, 237, 0.7)",
          }}
          onClick={navigateBack}
        >
          <MdKeyboardBackspace className="h-[30px] w-[30px] m-2" />
        </IconButton>
      </Tooltip>
    </>
  );
  const ButtonGroup = (
    <>
      <div className="w-fit min-[641px]:w-[300px] min-[800px]:w-[450px] m-auto flex gap-4 p-4">
        <Button
          startIcon={<MdDeleteOutline />}
          size="large"
          color="error"
          variant="outlined"
          sx={{
            marginLeft: "auto",
          }}
          onClick={openConfirmDeleteHandler}
        >
          Delete Group
        </Button>
        <Button
          startIcon={<IoAddOutline />}
          size="large"
          variant="outlined"
          sx={{
            marginRight: "auto",
          }}
          onClick={openAddMemberHandler}
        >
          Add Member
        </Button>
      </div>
    </>
  );
  return (
    <div className="flex-grow grid grid-cols-[1fr_1.6fr] h-[100vh]">
      <div className="bg-pink-200 h-full hidden min-[641px]:block">
        <GroupList myGroups={sampleChats} chatId={chatId} />
      </div>
      <div className="bg-neutral-200 h-full w-full col-span-2 min-[641px]:col-span-1">
        {IconBtns}
        {groupName && (
          <>
            {GroupName}
            <p className="m-4 text-center">Members</p>
            <div className="overflow-auto m-8 h-[400px] w-[300px] min-[800px]:w-[400px] m-auto">
              {sampleUsers.map((i) => {
                return (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={
                      "p-2 rounded-md shadow-[0_-0.5px_6px_-1px_rgba(0,0,0,0.1)]"
                    }
                    handler={removeMemberHandler}
                  />
                );
              })}
            </div>
            {ButtonGroup}
          </>
        )}
      </div>
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog />
        </Suspense>
      )}
      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
      <Drawer
        sx={{
          display: "none",
          "@media (max-width:640px)": {
            display: "block",
          },
          "& .MuiDrawer-paper": {
            backgroundColor: "#f99cb0", // any color
            color: "white", // text color
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupList myGroups={sampleChats} chatId={chatId} />
      </Drawer>
    </div>
  );
};

const GroupList = ({ myGroups = [], chatId }) => (
  <Stack sx={{overflow:"auto", height:"100vh"}}>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <p className="text-center p-2">No Groups</p>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault(); // this is ensuring that the chat that is already opened can't be reopened when user clicks on that chat again
      }}
    >
      <div className="flex items-center p-4 gap-3 relative w-[300px]">
        <AvatarCard avatar={avatar} />
        <p>{name}</p>
      </div>
    </Link>
  );
});

export default Groups;
