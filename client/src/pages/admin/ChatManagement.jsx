import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { LayoutLoaderAdmin } from "../../components/layout/Loaders";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { useGetAdminChatsQuery } from "../../redux/api/api";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 150,
    headerClassName: "table-header",
    renderCell: (params) => (
      <div className="flex mt-2">
        <AvatarCard avatar={params.row.avatar} />
      </div>
    ),
  },
  {
    field: "name", // name should be same to the data that you send from the backend
    headerName: "Name",
    width: 300,
    headerClassName: "table-header",
  },
  {
    field: "groupChat",
    headerName: "Group",
    width: 100,
    headerClassName: "table-header",
  },

  {
    field: "totalMembers",
    headerName: "Total Members",
    width: 140,
    headerClassName: "table-header",
  },
  {
    field: "members",
    headerName: "Members",
    width: 400,
    headerClassName: "table-header",
    renderCell: (params) => (
      <div className="flex gap-2 mt-2">
        <AvatarCard max={100} avatar={params.row.members} />
      </div>
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    width: 140,
    headerClassName: "table-header",
  },
  {
    field: "creator",
    headerName: "Created By",
    width: 250,
    headerClassName: "table-header",
    renderCell: (params) => (
      <div className="flex items-center gap-2">
        <Avatar
          alt={params.row.creator.name}
          src={params.row.creator.avatar}
          sx={{
            marginTop: "0.3rem",
          }}
        />
        <span>{params.row.creator.name}</span>
      </div>
    ),
  },
];

const ChatManagement = () => {
  const { isLoading, data, error, isError } = useGetAdminChatsQuery("",{
    pollingInterval: 5000
  });

  useErrors([
    {
      isError,
      error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        })),
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <LayoutLoaderAdmin />
      ) : (
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
