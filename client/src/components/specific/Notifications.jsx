import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
} from "@mui/material";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducer/misc";
import toast from "react-hot-toast";

const Notifications = () => {
  
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async ({ _id, accepted }) => {
    dispatch(setIsNotification(false));
    try {
      const res = await acceptRequest({ requestId: _id, accepted });
      if (res.data?.success) {
        console.log("Use Socket here");
        toast.success(res.data.message);
      } else toast.error(res.data?.error || "Something went wrong");
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    }
  };
  const closeHandler = () => {
    dispatch(setIsNotification(false));
  };

  useErrors([{ error, isError }]);
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle sx={{ margin: "auto" }}>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests?.length > 0 ? (
              data?.allRequests?.map((i, index) => (
                <NotificationItem
                  sender={i.sender}
                  _id={i._id}
                  key={index}
                  handler={friendRequestHandler}
                />
              ))
            ) : (
              <p className="m-auto">No notifications</p>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <div className="flex items-center justify-between gap-4 w-full rounded-md border-2 border-pink-100 p-2">
        <Avatar src={avatar} />
        <p className="mr-auto">{`${name} sent you a friend request.`}</p>
        <Stack
          direction={{
            xs: "column",
          }}
        >
          <Button onClick={() => handler({ _id, accepted: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accepted: false })}>
            Reject
          </Button>
        </Stack>
      </div>
    </ListItem>
  );
});

export default Notifications;
