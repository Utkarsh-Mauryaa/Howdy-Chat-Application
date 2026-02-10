import { useInputValidation } from "6pp";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducer/misc";
import UserItem from "../shared/UserItem";
const users = [1, 2, 3];
const Search = () => {
  const dispatch = useDispatch();
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
  const search = useInputValidation("");
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", {receiverId: id})
  };
  const [users, setUsers] = useState([]);
  const searchCloseHandler = () => dispatch(setIsSearch(false));
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      try {
        const { data } = await searchUser(search.value);
        setUsers(data.users);
      } catch (e) {
        console.log(e);
      }
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          margin: { xs: "16px", sm: "32px" },
          width: { xs: "calc(100% - 32px)", sm: "auto" },
        },
      }}
    >
      <Stack
        p={{ xs: "1rem", sm: "1.5rem", md: "2rem" }}
        direction={"column"}
        width={{
          xs: "100%",
          sm: "400px",
          md: "25rem",
        }}
      >
        <DialogTitle
          textAlign={"center"}
          sx={{
            padding: { xs: "8px 0 16px", sm: "16px 0" },
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Find People
        </DialogTitle>

        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            marginBottom: "1rem",
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosSearch />
                </InputAdornment>
              ),
            },
          }}
        />

        <List
          sx={{
            width: "100%",
            maxHeight: { xs: "50vh", sm: "60vh" },
            overflow: "auto",
            padding: 0,
          }}
        >
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
