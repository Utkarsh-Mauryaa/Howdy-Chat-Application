import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Skeleton } from "@mui/material";
import { dashboardData } from "../../utils/sampleData";
import { transformImage } from "../../lib/features";
import { useErrors } from "../../hooks/hook";
import { useGetAdminUsersQuery } from "../../redux/api/api";

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
      <Avatar
        alt={params.row.name}
        src={params.row.avatar}
        sx={{
          marginTop: "0.3rem",
        }}
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "friends",
    headerName: "Friends",
    width: 150,
    headerClassName: "table-header",
  },
  {
    field: "groups",
    headerName: "Groups",
    width: 150,
    headerClassName: "table-header",
  },
];
const UserManagement = () => {
  const { isLoading, data, error, isError } = useGetAdminUsersQuery();

  useErrors([
    {
      isError,
      error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if(data) {
      setRows(
        data.users.map((user) => ({
          ...user,
          id: user._id,
          avatar: transformImage(user.avatar, 50),
        })),
      );

    }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Table heading={"All Users"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
