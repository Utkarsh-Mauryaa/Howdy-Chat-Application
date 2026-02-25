import { ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { FaFileAlt } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { MdAudioFile, MdVideoFile } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducer/misc";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => {
    imageRef.current?.click();
  };
  const selectAudio = () => {
    audioRef.current?.click();
  };
  const selectVideo = () => {
    videoRef.current?.click();
  };
  const selectFile = () => {
    fileRef.current?.click();
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send at max 5 ${key} at a time.`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm).unwrap();

      if (res.success) toast.success(`${key} sent successfully!`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });
    } catch (error) {
      const message =
        typeof error?.data === "string"
          ? error.data
          : error?.data?.message || error?.error || `Failed to send ${key}`;

      toast.error(message, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <Menu
      anchorEl={anchorE1}
      open={isFileMenu}
      onClose={closeFileMenu}
      sx={{
        padding: "2px",
      }}
    >
      <div className="w-35">
        <MenuList>
          <MenuItem onClick={selectImage}>
            <FaRegImage className="text-[20px]" />
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Image")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={selectAudio}>
            <MdAudioFile className="text-[24px] ml-[-3px]" />
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audio")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem onClick={selectVideo}>
            <MdVideoFile className="text-[24px] ml-[-4px]" />
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Video")}
              ref={videoRef}
            />
          </MenuItem>

          <MenuItem onClick={selectFile}>
            <FaFileAlt className="text-[22px] ml-[-4px]" />
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "File")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
