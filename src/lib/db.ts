
export interface User {
    id:string;
    name: string;
    email: string;
    password: string;
  }
  
  export interface Project {
    id:string;
    name:string;
    description:string;
    status:string;
    userId:string
  }

  export interface Task {
    id:string;
    name:string;
    description:string;
    status:string;
    projectId:string
  }

  declare global {
    var users: User[];
    var projects : Project[]
    var tasks : Task[]
  }
  
  export const users = global.users || [];
  export let projects = global.projects ||[]
  export let tasks = global.tasks || []

  if (!global.users) global.users = users;
  if (!global.projects) global.projects = projects
  if (!global.tasks) global.tasks = tasks
  