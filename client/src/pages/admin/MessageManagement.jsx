import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { fileFormat, transformImage } from "../../lib/features";
import { dashboardData } from "../../utils/sampleData";
import moment from "moment";
import { Avatar, Box } from "@mui/material";
import RenderAttachment from "../../components/shared/RenderAttachment";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "attachments",
    headerName: "Attachments",
    width: 200,
    headerClassName: "table-header",
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileFormat(url);
            return (
              <Box>
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{
                    color: "black",
                  }}
                >
                    {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    width: 400,
    headerClassName: "table-header",
  },
  {
    field: "sender",
    headerName: "Sent By",
    width: 200,
    headerClassName: "table-header",
    renderCell: (params) => (
      <div className="flex gap-4">
        <Avatar
          alt={params.row.sender.name}
          src={params.row.sender.avatar}
          sx={{
            marginTop:"3.4rem"
          }}
        />
        <span>{params.row.sender.name}</span>
      </div>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    width: 220,
    headerClassName: "table-header",
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    width: 130,
    headerClassName: "table-header",
  },
  {
    field: "createdAt",
    headerName: "Time",
    width: 250,
    headerClassName: "table-header",
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50),
        },
        createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      })),
    );
  }, []);

  return (
    <AdminLayout>
      <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={150}/>
    </AdminLayout>
  );
};

export default MessageManagement;
