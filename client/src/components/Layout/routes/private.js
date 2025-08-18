import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../../spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API + "/api/v1/auth/user-auth"
        );

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        setOk(false);
        // Optionally clear invalid auth data
        // localStorage.removeItem("auth");
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
