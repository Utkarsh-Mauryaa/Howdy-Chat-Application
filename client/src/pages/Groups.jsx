import { useSocketEvents } from "6pp";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { lazy, memo, Suspense, useEffect, useState } from "react";
import { IoAddOutline, IoMenuOutline } from "react-icons/io5";
import {
  MdDeleteOutline,
  MdDone,
  MdEdit,
  MdKeyboardBackspace,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/StyledComponents";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducer/misc";
import { MEMBER_REMOVED } from "../utils/events";
import { getSocket } from "../utils/socket";
import { motion } from "framer-motion";

const ConfirmDeleteDialog = lazy(
  () => import("../components/dialog/ConfirmDeleteDialog"),
);
const AddMemberDialog = lazy(
  () => import("../components/dialog/AddMemberDialog"),
);

const Groups = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myGroups = useMyGroupsQuery();
  const socket = getSocket();
  const { isAddMember } = useSelector((state) => state.misc);

  const chatId = useSearchParams()[0].get("group");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId },
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation,
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation,
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation,
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");

  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupDetails.data) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  // Clear state when no group is selected
  useEffect(() => {
    if (!chatId) {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    }
  }, [chatId]);

  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };
  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };
  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    // Clear the group details state immediately
    setGroupName("");
    setGroupNameUpdatedValue("");
    setMembers([]);
    setIsEdit(false);
    // Navigate to groups page without query params
    navigate("/groups");
  };
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
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
            disabled={isLoadingGroupName}
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
            disabled={isLoadingGroupName}
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
  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <div className="flex-grow grid grid-cols-[1fr_1.6fr] h-[100vh]">
      <div className="bg-pink-200 h-full hidden min-[641px]:block">
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </div>
      <div className="bg-neutral-200 h-full w-full col-span-2 min-[641px]:col-span-1">
        {IconBtns}
        {groupName && (
          <>
            {GroupName}
            <p className="m-4 text-center">Members</p>
            <div className="overflow-auto m-8 h-[400px] w-[300px] min-[800px]:w-[400px] m-auto">
              {isLoadingRemoveMember ? (
                <CircularProgress />
              ) : (
                members.map((i) => {
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
                })
              )}
            </div>
            {ButtonGroup}
          </>
        )}
      </div>
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
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
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </div>
  );
};

const GroupList = ({ myGroups = [], chatId }) => (
  <Stack sx={{ overflow: "auto", height: "100vh" }}>
    {myGroups.length > 0 ? (
      myGroups.map((group, index) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} index={index}/>
      ))
    ) : (
      <p className="text-center p-2">No Groups</p>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId, index }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault(); // this is ensuring that the chat that is already opened can't be reopened when user clicks on that chat again
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center p-4 gap-3 relative w-[300px]"
      >
        <AvatarCard avatar={avatar} />
        <p>{name}</p>
      </motion.div>
    </Link>
  );
});

export default Groups;
