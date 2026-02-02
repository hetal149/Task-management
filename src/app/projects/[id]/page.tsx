"use client";

import DataTable from "@/components/data-table/page";
import Modal from "@/components/modal/page";
import { Button, MenuItem, TextField } from "@mui/material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setProject,
  setTasks,
  addTask,
  updateTask,
  removeTask,
} from "@/store/projectSlice";
import { IProject, ITask } from "@/lib/type";
import { AppRoutes } from "@/app/utils/constant";
import { toast } from "react-toastify";

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxProject = useAppSelector((state) => state.project.project);
  const reduxTasks = useAppSelector((state) => state.project.tasks);

  const [formDetails, setFormDetails] = useState<ITask>({
    id: "",
    name: "",
    description: "",
    status: "Pending",
  });
  const [projectForm, setProjectForm] = useState<IProject>(reduxProject);
  const [open, setOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getProjectDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json: { success: boolean; data: IProject } = await res.json();
      if (json.success) {
        dispatch(setProject(json.data));
        setProjectForm(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks?projectId=${id}`, {
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
    const token = localStorage.getItem("token");
    try {
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
          body: JSON.stringify({ ...formDetails, projectId: id }),
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

  const handleProjectSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });
      const json: { success: boolean; data: IProject } = await res.json();
      if (json.success) {
        dispatch(setProject(json.data));
        toast.success("Project Updated successfully!");
        router.push(AppRoutes.Projects);
      } else {
        toast.error("Failed to update project");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id) return;
    getProjectDetails();
    getTasks();
  }, [id]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Title", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
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
    <div className="p-12">
      <span className="font-semibold text-2xl align-middle mb-4">
        Update Project Details
      </span>

      <TextField
        label="Title"
        fullWidth
        margin="dense"
        value={projectForm.name}
        onChange={(e) =>
          setProjectForm({ ...projectForm, name: e.target.value })
        }
      />
      <TextField
        label="Description"
        fullWidth
        margin="dense"
        value={projectForm.description}
        onChange={(e) =>
          setProjectForm({ ...projectForm, description: e.target.value })
        }
      />
      <TextField
        select
        label="Status"
        fullWidth
        margin="dense"
        value={projectForm.status}
        onChange={(e) =>
          setProjectForm({ ...projectForm, status: e.target.value })
        }
      >
        {["Pending", "In Progress", "Completed"].map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <div className="flex gap-3 mt-4 mb-6">
        <Button variant="outlined" color="success" onClick={handleProjectSave}>
          Save
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => router.push(AppRoutes.Projects)}
        >
          Close
        </Button>
      </div>

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
        title="Add/Edit ITask"
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
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
          {["Pending", "In Progress", "Completed", "On Hold"].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
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
  );
};

export default ProjectDetails;
