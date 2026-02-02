"use client"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

type Props = {
  rows: any[];
  columns: GridColDef[];
};


const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({rows,columns}:Props) {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
