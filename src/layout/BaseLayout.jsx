import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";
import useAuth from "../hooks/useAuth";

const BaseLayout = () => {
  useAuth();
  
  return (
    <main className="page-wrapper">
      <Sidebar />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
