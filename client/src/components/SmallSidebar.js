import React from "react";
import NavLinks from "./NavLinks";
import Wrapper from "../assets/wrappers/SmallSidebar";
import Logo from "../components/Logo";
import { FaTimes } from "react-icons/fa";
import { useAppContext } from "../context/appContext";

const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppContext();
  console.log(showSidebar);
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
