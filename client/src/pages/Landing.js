import React from "react";
import { Link } from "react-router-dom";

import main from "../assets/images/main.svg";
// import Logo from "../components/Logo";
import { Logo } from "../components";

import Wrapper from "../assets/wrappers/Testing";
//importing styled component

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
        {/* <img src={logo} alt="jobify" className="logo" /> */}
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span>App
          </h1>
          <p>searching app</p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        {/* right next to it we should keep the image then only it will get binded */}
        <img src={main} alt="job hunt" className="img main-img"></img>
      </div>
    </Wrapper>
  );
};

export default Landing;

// container comes with base classes which setup some width.
//page styled component
// we should be having two components one for the text
// the second column is for the image

// once some basic set up is done think about styling.

// one important thing is wrapper is only responsible for styling not the logic
