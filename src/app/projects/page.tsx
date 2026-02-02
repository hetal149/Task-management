"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PrimaryNav from "@/components/primary-nav/page";
import DataTable from "@/components/data-table/page";
import Modal from "@/components/modal/page";
import { Button, MenuItem, TextField } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProject, removeProject, setProjects } from "@/store/projectSlice";
import { IProject } from "@/lib/type";
import { AppRoutes } from "../utils/constant";
import { toast } from "react-toastify";
import Sidebar from "@/components/sidebar/page";

const Projects = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxProjects = useAppSelector((state) => state.project.projects);

  const [form, setForm] = useState<IProject>({
    name: "",
    description: "",
    status: "",
  });
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const r = await fetch(`/api/projects?userId=${user.id}`,{      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },});
      const j = await r.json();
      if (j.success) {
        dispatch(setProjects(j.data));
        console.log("projects", j.data);
      }
    } catch (err) {
      console.log("error fetching projects", err);
    }
  };

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch("/api/projects", {
        method: "POST",
              headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, userId: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        dispatch(addProject(data.data));
        toast.success("Project created successfully!");
      } else {
        toast.error("Failed to add project");
      }
      setForm({ name: "", description: "", status: "" });
      setOpen(false);
    } catch (err) {
      console.error("error adding project", err);
    }
  };

  const handleDelete = (id: string) => {
    setIsDeleteOpen(true);
    setDeleteId(id);
  };
  const handleDeleteSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const resposne = await fetch(`/api/projects/${deleteId}`, {
        method: "DELETE",
              headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resposne.ok) {
        dispatch(removeProject(deleteId as string));
        toast.success("Project deleted successfully!");
        setDeleteId(null);
        setIsDeleteOpen(false);
      } else {
        toast.error("Failed to delete project");
      }
    } catch (err) {
      console.error("error deleting project", err);
      toast.error("Failed to delete project");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(AppRoutes.SignIn);
      return;
    }
    fetchProjects();
  }, []);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 180 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => router.push(`/projects/${params.row.id}`)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
    <Sidebar>
      <PrimaryNav />
      <div className="p-4">
        <Button variant="outlined" onClick={() => setOpen(true)}>
          + Add New Project
        </Button>

        <DataTable rows={reduxProjects} columns={columns} />

        <Modal
          open={open}
          title="Add New Project"
          onClose={() => setOpen(false)}
          onSubmit={handleAdd}
        >
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            select
            label="Status"
            fullWidth
            margin="dense"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {["Pending", "In Progress", "Completed"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Modal>
        <Modal
          open={isDeleteOpen}
          title="Confirmation modal"
          onClose={() => setIsDeleteOpen(false)}
          onSubmit={handleDeleteSubmit}
        >
          <p>Are you sure you want to delete this project?</p>
        </Modal>
      </div>
      </Sidebar>
    </>
  );
};

export default Projects;
