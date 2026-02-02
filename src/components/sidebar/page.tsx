"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { IconButton } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AppRoutes } from "@/app/utils/constant";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-md ${
      pathname === path ? "bg-blue-600 text-white" : "hover:bg-blue-100"
    }`;

  return (
    <div className="flex h-screen">
      <div className="md:hidden fixed top-3 left-3 z-50">
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>
      <div
        className={`
          bg-white shadow-lg w-64 p-4 flex flex-col justify-between
          fixed md:static h-full z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          <div className="flex justify-between items-center mb-6 z-50">
            <span className="font-bold text-lg">Task Manager</span>
            <div className="block md:hidden">
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href={AppRoutes.Projects}
              onClick={() => setOpen(false)}
              className={linkClass(AppRoutes.Projects)}
            >
              Projects
            </Link>

            <Link
              href={AppRoutes.Tasks}
              onClick={() => setOpen(false)}
              className={linkClass(AppRoutes.Tasks)}
            >
              Tasks
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1  bg-gray-50 overflow-auto">{children}</div>
    </div>
  );
};

export default Sidebar;
