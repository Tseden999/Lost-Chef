import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRotate } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage?.getItem('user'));
    setLoggedInUser(user)
  }, []);

  const LogoutUser = () => {
    if (window.confirm("You wanna logout?")) {
      localStorage.clear();
      window.location.href = "/login";
    } else {
      window.location.href = "/recipes";
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const auth = localStorage.getItem("token");

  const handleToggleMenu = () => {
    setIsOpen(false);
  };


  return (
    <div>
      <nav>
        <div className="nav-left" style={{ position: 'relative' }}>
          <FontAwesomeIcon
            icon={faBars}
            className="hamburger-icon"
            onClick={toggleMenu}
            style={isOpen ? { transform: "rotate(90deg)" } : {}}
          />

          <img onClick={() => window.location.assign("/")} src="/logo.png" height={55} width={55} style={{ position: 'absolute', left: 60, cursor: 'pointer' }} />
        </div>
        <div className={`nav-right ${isOpen ? "open" : ""}`}>
          <ul>
            {auth ? (
              <>
                <li>
                  <NavLink to="recipes" onClick={handleToggleMenu}>
                    Recipes
                  </NavLink>{" "}
                </li>

                <li>
                  <NavLink to="/addRecipe" onClick={handleToggleMenu}>
                    Add Recipe
                  </NavLink>{" "}
                </li>
                <li>
                  <NavLink to="/favouriteRecipes" onClick={handleToggleMenu}>
                    Favourites
                  </NavLink>{" "}
                </li>
                <li>
                  <NavLink to="login" onClick={LogoutUser}>
                    Logout
                  </NavLink>
                </li>
                <li style={{ padding: 5, paddingLeft: 12, paddingRight: 12, border: '0.5px solid gray', borderRadius: 50 }}>
                  <span style={{ marginRight: 7 }}>👤</span>
                  <span style={{ fontSize: 12, bottom: '1px', position: 'relative' }}>{loggedInUser?.name}</span>
                  {loggedInUser?.role == 'admin' && <img style={{ marginLeft: 5, top: 2, position: 'relative' }} src="/verified.svg" height={15} width={15} />}
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="login">Login</NavLink>{" "}
                </li>
                <li>
                  <NavLink to="signup">SignUp</NavLink>
                </li>
                <li>
                  <NavLink to="forgotPassword">Forgot Password</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
