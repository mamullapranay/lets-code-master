import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReturnAvtars from "../Avtars/Avtar";
import { UserContext } from "../context/UserContext";
import "../style/Nav.scss";

// icons
import { BiUser } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import { AiFillCaretDown } from "react-icons/ai";

const Avtars = ReturnAvtars();

function Nav() {
  const navigate = useNavigate();
  const defaultProfileImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png";

  // Corrected state variable and setter function
  const [width, setWidth] = useState(window.innerWidth);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { user_Name, user_Index, set_User_Index, set_User_Name } = useContext(UserContext);

  // Handle window resize event and cleanup
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfileClick = () => {
    setDropdownVisible(!isDropdownVisible); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    localStorage.clear();
    set_User_Index(null);
    set_User_Name("Login");
    navigate("/");
    setDropdownVisible(false); // Hide dropdown after logout
  };

  const handleProfileRedirect = () => {
    navigate("/user");
    setDropdownVisible(false); // Hide dropdown after redirect
  };

  return (
    <nav className="top-nav">
      <div className="left-nav" id="left-nav">
        <div>
          <img src="https://cdn.iconscout.com/icon/free/png-256/notepad-2642816-2192663.png" alt="Logo" />
        </div>
      </div>

      <div className="right-nav" id="right-nav">
        <div className="nav-profile" onClick={handleProfileClick}>
          <img
            src={user_Index ? Avtars[user_Index].src : defaultProfileImg}
            style={{ borderRadius: "50%" }}
            alt="User Avatar"
          />
          <h4>{user_Name}</h4>
          <AiFillCaretDown />
        </div>

        {isDropdownVisible && (
          <div className="nav-profile-drop">
            <div onClick={handleProfileRedirect}>
              <BiUser />
              <h4>Profile</h4>
            </div>
            <div onClick={user_Index != null ? handleLogout : () => navigate("/register")}>
              <IoLogOutOutline />
              <h4>{user_Index != null ? "Log-Out" : "Log-In"}</h4>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
