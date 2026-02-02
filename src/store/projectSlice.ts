
import { IProject, ITask } from "@/lib/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name:"project",
initialState:{
    project:{
        name:"",
        description:"",
        status:""
    },
    projects:[] as IProject[],
    tasks:[] as ITask[],
},
reducers:{
    setProject:(state,action:PayloadAction<IProject>)=>{
        state.project = action.payload
    },
        setProjects: (state, action: PayloadAction<IProject[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<IProject>) => {
      state.projects.push(action.payload);
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      state.projects = state.projects.map(p => (p.id === action.payload.id ? action.payload : p));
    },
    setTasks:(state,action:PayloadAction<ITask[]>)=>{
        state.tasks = action.payload
    },
     addTask: (state, action: PayloadAction<ITask>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<ITask>) => {
      state.tasks = state.tasks.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
}
})

export const {addProject,removeProject,updateProject,setProjects,setProject,setTasks,addTask,updateTask,removeTask}= projectSlice.actions;
export default projectSlice.reducer;