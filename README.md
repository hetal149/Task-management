Task Management System

A simple and modern Task & Project Management Web App built with Next.js + Redux Toolkit + Tailwind + MUI.
Users can create projects, manage tasks inside projects, and track progress easily.

Features

🔐 Authentication
User Registration
User Login
Session stored using token (localStorage)

📁 Projects
Create project
Update project details
Delete project
Set project status (Pending / In Progress / Completed)

✅ Tasks
Add tasks inside a project
Edit task
Delete task
Update task status
Manage tasks per project
Separate Tasks Module to manage tasks across all projects

🧠 State Management
Redux Toolkit used for global state
Projects & Tasks stored in Redux store
No prop drilling

Installation
git clone https://github.com/hetal149/Task-management.git
cd task-management
npm install
npm run dev or npm build && npm start

🧭 How to Use
Step 1 — Register
Create a new account.

Step 2 — Login
Login with your credentials.

Step 3 — Create Projects
Add project title
Add description
Select status

Step 4 — Manage Tasks inside Project
When you open a project:
Add task
Edit task
Delete task
Change status

Step 5 — Task Module
From Tasks page:
View all tasks
Manage tasks across any project