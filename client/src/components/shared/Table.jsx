import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          padding: "1rem 2rem",
          borderRadius: "12px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p className="text-center">{heading}</p>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          className="h-[80%]"
          sx={{
            border: "none",
            ".table-header": {
              bgcolor: "#242323",
              color: "#e8e4e4",
              fontWeight: "bold",
              fontSize: "1rem",
            },
          }}
        />
      </Paper>
    </div>
  );
};

export default Table;
