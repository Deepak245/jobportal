import React from "react";
import { Outlet } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";
import { Navbar, BigSidebar, SmallSidebar } from "../../components/index";
const SharedLayout = () => {
  return (
    <Wrapper>
      {/* <nav>
        <Link to="add-job">Add Job</Link>
        <Link to="all-job">all Jobs</Link>
      </nav> */}
      <main className="dashboard">
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default SharedLayout;
