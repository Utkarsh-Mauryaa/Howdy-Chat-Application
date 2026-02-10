import moment from "moment";
import { memo } from "react"
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { Box } from "@mui/material";
const Message = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message
  const timeAgo = moment(createdAt).fromNow();
  return (
    <div className={`p-2 rounded-xl border-2 border-slate-300 m-2 ${(sender?._id === user?._id) ? "self-end" : "self-start"}`}>
      {(sender?._id !== user._id) && <p className="text-pink-600 font-semibold text-xs">{sender.name}</p>}
      {content && <p>{content}</p>}
      {
        attachments.length > 0 && (
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);
            return <Box key={index}>
              <a href={url} target="_blank" download className="text-stone-950">
                {RenderAttachment(file, url)}
              </a>
            </Box>
          })
        )
      }
      <p className="text-xs text-gray-500">{timeAgo}</p>
    </div>
  )
}

export default memo(Message)
