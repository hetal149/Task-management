"use client";

import DataTable from "@/components/data-table/page";
import Modal from "@/components/modal/page";
import { ITask } from "@/lib/type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTask,
  removeTask,
  setProjects as setReduxProjects,
  setTasks,
  updateTask,
} from "@/store/projectSlice";
import { Button, MenuItem, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrimaryNav from "@/components/primary-nav/page";
import Sidebar from "@/components/sidebar/page";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const reduxTasks = useAppSelector((state) => state.project?.tasks);
  const reduxProjects = useAppSelector((state) => state.project?.projects);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formDetails, setFormDetails] = useState<ITask>({
    id: "",
    name: "",
    description: "",
    status: "Pending",
    projectId: "",
  });

  useEffect(() => {
    if (reduxProjects.length === 0) return;
    setProjects(
      reduxProjects.map((project) => ({
        id: project.id as string,
        name: project.name,
      })),
    );
  }, [reduxProjects]);

  useEffect(() => {
    getTasks();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(`/api/projects?userId=${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        dispatch(setReduxProjects(data.data));
        console.log("projects", data.data);
      }
    } catch (err) {
      console.log("error fetching projects", err);
    }
  };
  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json: { success: boolean; data: ITask[] } = await res.json();
      if (json.success) {
        dispatch(setTasks(json.data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskDetails = async (row: ITask) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${row.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json: { success: boolean; data: ITask } = await res.json();
      if (json.success) {
        setFormDetails(json.data);
        setIsEdit(true);
        setSelectedId(row.id as string);
        setOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: string) => {
    setIsDeleteOpen(true);
    setDeleteId(id);
  };

  const handleDeleteSubmit = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(removeTask(deleteId));
        toast.success("Task deleted successfully!");
        setDeleteId(null);
        setIsDeleteOpen(false);
      } else {
        toast.error("Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isEdit && selectedId) {
        const res = await fetch(`/api/tasks/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDetails),
        });
        const json: { success: boolean; data: ITask } = await res.json();
        if (json.success) {
          dispatch(updateTask(json.data));
          toast.success("Task Updated successfully!");
        } else {
          toast.error("Failed to update task");
        }
      } else {
        const res = await fetch(`/api/tasks`, {
          method: "POST",
           headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formDetails }),
        });
        const json: { success: boolean; data: ITask } = await res.json();
        if (json.success) {
          dispatch(addTask(json.data));
          toast.success("Task Created successfully!");
        } else {
          toast.error("Failed to create task");
        }
      }
      setOpen(false);
      setFormDetails({ id: "", name: "", description: "", status: "Pending" });
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Title", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    {
      field: "projectId",
      headerName: "Project",
      width: 130,
      valueGetter: (params) => {
        const project = reduxProjects.find((p) => p.id === params);
        return project?.name || "-";
      },
    },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleTaskDetails(params.row as ITask)}
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
      <div className="p-12">
        <Button
          variant="outlined"
          onClick={() => {
            setOpen(true);
            setIsEdit(false);
            setFormDetails({
              id: "",
              name: "",
              description: "",
              status: "Pending",
            });
          }}
          className="mt-8 mb-3.5 py-2 px-3.5 text-amber-50 rounded-b-md border-none cursor-pointer bg-blue-400"
        >
          + Add New Task
        </Button>

        <Modal
          open={open}
          title="Add/Edit Task"
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
        >
          <TextField
            select
            label="Project"
            fullWidth
            margin="dense"
            value={formDetails.projectId || ""}
            onChange={(e) =>
              setFormDetails({ ...formDetails, projectId: e.target.value })
            }
          >
            {projects.map((project,index) => (
              <MenuItem key={index} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={formDetails.name}
            onChange={(e) =>
              setFormDetails({ ...formDetails, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={formDetails.description}
            onChange={(e) =>
              setFormDetails({ ...formDetails, description: e.target.value })
            }
          />
          <TextField
            select
            label="Status"
            fullWidth
            margin="dense"
            value={formDetails.status}
            onChange={(e) =>
              setFormDetails({ ...formDetails, status: e.target.value })
            }
          >
            {["Pending", "In Progress", "Completed", "On Hold"].map(
              (status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ),
            )}
          </TextField>
        </Modal>

        <Modal
          open={isDeleteOpen}
          title="Confirm Delete"
          onClose={() => setIsDeleteOpen(false)}
          onSubmit={handleDeleteSubmit}
        >
          <p>Are you sure you want to delete this task?</p>
        </Modal>

        <DataTable rows={reduxTasks} columns={columns} />
      </div>
      </Sidebar>
    </>
  );
};

export default Tasks;
