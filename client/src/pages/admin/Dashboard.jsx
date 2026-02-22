import { Container, Paper, Typography } from "@mui/material";
import moment from "moment";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { MdAdminPanelSettings, MdGroups } from "react-icons/md";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { useAdminStatsQuery } from "../../redux/api/api";
import { LayoutLoader } from "../../components/layout/Loaders";
import { useErrors } from "../../hooks/hook";

const Dashboard = () => {
  const { isLoading, data, error, isError } = useAdminStatsQuery("",{
    pollingInterval:2000
  });

  const { stats } = data || {};

  useErrors([
    {
      isError,
      error,
    },
  ]);

  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#333",
      }}
    >
      <div className="flex items-center gap-4 w-full">
        <MdAdminPanelSettings className="text-5xl" />
        <SearchField placeholder="Search?." />
        <CurveButton>Search</CurveButton>
        <p className="ml-auto hidden min-[1024px]:block">
          {moment().format("dddd, D MMMM YYYY")}
        </p>
        <IoMdNotifications className="text-3xl text-gray-600" />
      </div>
    </Paper>
  );

  const Widgets = (
    <div className="flex flex-col gap-4 sm:flex-row justify-between flex-wrap items-stretch items-center mt-4 mb-4">
      <Widget title={"Users"} value={stats?.usersCount} icon={<FaUser />} />
      <Widget title={"Chats"} value={stats?.totalChatsCount} icon={<MdGroups />} />
      <Widget
        title={"Messages"}
        value={stats?.messagesCount}
        icon={<BiSolidMessageSquareDetail />}
      />
    </div>
  );
  return isLoading ? (
    <LayoutLoader />
  ) : (
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}
        <div className="flex flex-col gap-4 flex-wrap lg:flex-row">
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              marginBottom: "24px",
              color: "#333",
              flex: "1 1 300px",
              width: "100%",
            }}
          >
            <p className="p-4 margin-2 text-3xl">Last 7 Days Messages</p>
            <LineChart value={stats?.messagesChart || []} />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              flex: "1 1 300px",
              maxWidth: "400px",
              width: "100%",
              position: "relative",
              borderRadius: "12px",
            }}
          >
            <DoughnutChart
              labels={["Single Chats", "Group Chats"]}
              value={[stats?.totalChatsCount - stats?.groupsCount || 0, stats?.groupsCount || 0]}
            />
            <div className="absolute flex justify-center items-center w-full h-full">
              <MdGroups className="text-3xl" />
              <p>Vs</p>
              <FaUser />
            </div>
          </Paper>
        </div>
        {Widgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, icon }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#333",
        flex: "1 1 300px",
        maxWidth: "400px",
        width: "100%",
        borderRadius: "12px",
        gap: "16px",
      }}
    >
      <div className="flex items-center gap-4 flex-col">
        <Typography
          sx={{
            borderRadius: "50%",
            width: "6rem",
            height: "6rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "rgba(0,0,0,0.7)",
            border: "5px solid rgba(0,0,0,0.9)",
          }}
        >
          {value}
        </Typography>
        <div className="flex flex-col gap-4">
          <span className="text-3xl m-auto">{icon}</span>
          <Typography>{title}</Typography>
        </div>
      </div>
    </Paper>
  );
};

export default Dashboard;
