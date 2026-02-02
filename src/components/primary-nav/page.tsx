"use client";
import { AppRoutes } from "@/app/utils/constant";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";

const PrimaryNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
      router.push(AppRoutes.SignIn);
    } catch (e) {}
  };
  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div></div>
          <div className="flex items-center space-x-4 font-semibold">
            {isLoggedIn && (
              <Button
                type="button"
                color="error"
                onClick={() => handleLogout()}
              >
                <LogoutIcon />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PrimaryNav;
