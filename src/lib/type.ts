  export interface IProject {
    id?:string;
    name:string;
    description:string;
    status:string;
    userId?:string
  }

  export interface ITask {
    id?:string;
    name:string;
    description:string;
    status:string;
    projectId?:string
  }
