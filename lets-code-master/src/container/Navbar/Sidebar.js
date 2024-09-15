import React, { useEffect, useState, useContext } from "react";
import "../style/Nav.scss";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ReturnAvtars from "../Avtars/Avtar";

// icons
import { HiOutlineHome } from "react-icons/hi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { BsDoorOpen } from "react-icons/bs";
import { LoaderContext } from "../context/LoaderContext";

const sidebarLi = [
  {
    name: "Home",
    icon: <HiOutlineHome />,
    to: "/",
  },
  {
    name: "Friends",
    icon: <LiaUserFriendsSolid />,
    to: "/user/friends",
  },
  {
    name: "Rooms",
    icon: <BsDoorOpen />,
    to: "/user/rooms",
  },
];

let Avtars = ReturnAvtars();

function Sidebar() {
  const defaultProfile =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png";

  const {  user_Index } = useContext(UserContext);
  const { load } = useContext(LoaderContext);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    // No DOM manipulation, just set active state declaratively
  }, [active]);

  return (
    <div className="sidebar mobile" id="sidebar">
      <Link to="/register">
        <div className="side-profile">
          <div className="profile-round">
            <img
              className={`${load ? "skeleton" : ""}`}
              src={load ? defaultProfile : user_Index ? Avtars[user_Index].src : defaultProfile}
              alt="User profile"
            />
          </div>
        </div>
      </Link>

      {sidebarLi.map((item, index) => (
        <Link to={item.to} key={`sidebar-item-${index}`}>
          <div
            className={`sidebar-li ${active === item.name ? "active" : ""}`}
            onClick={() => setActive(item.name)}
          >
            <div className="sidebar-li-ico">{item.icon}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;
