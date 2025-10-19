import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import logo from './Icons/online-store.png';

const NavBar = () => {
  const { isAuthenticated } = useAuth();

  const navBarStyle = "bg-blue-900 text-white shadow-md z-50";
  const navBrandStyle = "text-yellow-500 font-bold text-4xl"; // Increased text size here
  const navLinkStyle = "text-white font-bold text-3xl hover:text-yellow-500"; // Increased text size here
  //const navLinkHighlightStyle = "text-yellow-500";
  const navLinkHoverStyle = "hover:text-yellow-500";
  const highlightLinkStyle = "text-yellow-500";

  return (
    <nav className={`fixed top-0 left-0 w-full ${navBarStyle} shadow-md z-50`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
        <Link className={navBrandStyle} to="/">
          <img src={logo} alt="logo" className="w-10 h-10 inline-block mr-2" />
          Bidding System
        </Link>
        <button
          className="text-white md:hidden focus:outline-none"
          type="button"
          onClick={() => {
            document.getElementById("navbar-menu").classList.toggle("hidden");
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <div
          className="hidden md:flex md:items-center md:space-x-4"
          id="navbar-menu"
        >
          <ul className="flex flex-col md:flex-row md:space-x-8">
            <li className="nav-item">
              <Link
                className={`${navLinkStyle} ${navLinkHoverStyle}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`${navLinkStyle} ${navLinkHoverStyle}`}
                to="/works"
              >
                How it works
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`${navLinkStyle} ${navLinkHoverStyle}`}
                to="/about"
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`${navLinkStyle} ${navLinkHoverStyle}`}
                to="/contact"
              >
                Contact us
              </Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`${navLinkStyle} ${highlightLinkStyle} ${navLinkHoverStyle}`}
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`${navLinkStyle} ${highlightLinkStyle} ${navLinkHoverStyle}`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className={`${navLinkStyle} ${highlightLinkStyle} ${navLinkHoverStyle}`}
                  to="/profile"
                >
                  My Profile
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
