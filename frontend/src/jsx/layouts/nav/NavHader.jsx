import React, { Fragment, useContext, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import logo from "/assets/images/logo.png";
export function NavMenuToggle() {
  setTimeout(() => {
    let mainwrapper = document.querySelector("#main-wrapper");
    if (mainwrapper.classList.contains("menu-toggle")) {
      mainwrapper.classList.remove("menu-toggle");
    } else {
      mainwrapper.classList.add("menu-toggle");
    }
  }, 200);
}

const NavHader = () => {
  const [toggle, setToggle] = useState(true);
  const { navigationHader, openMenuToggle, background } =
    useContext(ThemeContext);
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo">
        <img src={import.meta.env.VITE_WAARI_LOGO_PATH} alt="logo" />
      </Link>


      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
