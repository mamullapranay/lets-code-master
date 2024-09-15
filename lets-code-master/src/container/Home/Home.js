import React, { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Main from "./Main";
import LoginSignup from "../Login-signup/LoginSignup";
import Nav from "../Navbar/Nav";
import ReturnAvtars from "../Avtars/Avtar"; // Ensure this is a valid component or remove if not used
import Friends from "../User/Friends";
import Sidebar from "../Navbar/Sidebar";
import Room from "../Rooms/Room";
import Loading from "../Load/Loading";
import { LoaderContext } from "../context/LoaderContext";
import Private from "../Private/Private";
import { UserContext } from "../context/UserContext";
import { ErrorContext } from "../context/ErrorContext";
import Editor from "../Editor/Editor";
import Modal from "../Modals/Modal";
import Profile from "../User/Profile"; // Ensure this component is imported

function Home() {
  const error = useContext(ErrorContext);
  const [userDetails, setUserDetails] = useState({});
  const [user_Name, set_User_Name] = useState("Login");
  const [user_Email, set_User_Email] = useState("Not Found");
  const [user_Avtar, set_User_Avtar] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
  );
  const [user_Index, set_User_Index] = useState(null);
  const [user_Rooms, set_User_Rooms] = useState([]);
  const [user_Id, set_User_Id] = useState("");
  const [Load, setLoad] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      setLoad(1);
      const id = localStorage.getItem("id");
      if (id) {
        try {
          const response = await axios.get(
            `https://lets-code-backend-f27r.onrender.com/api/v1/user/${id}`
          );
          const data = response.data;
          setUserDetails(data.user);
          set_User_Name(data.user.username);
          set_User_Index(data.user.profileIMG);
          set_User_Email(data.user.email);
          set_User_Rooms(data.user.rooms);
          set_User_Id(data.user._id);
        } catch (e) {
          error(e.response?.data?.error || 'An error occurred');
          setTimeout(() => error(''), 5000);
          set_User_Name("Login");
        } finally {
          setLoad(0);
        }
      } else {
        set_User_Name("Login");
        setLoad(0);
      }
    };

    getUser();
  }, [error]);

  return (
    <React.Fragment>
      {Load && <Loading />}
      <UserContext.Provider
        value={{
          set_User_Index,
          set_User_Name,
          set_User_Email,
          set_User_Rooms,
          set_User_Id,
          user_Index,
          user_Name,
          user_Email,
          user_Rooms,
          user_Id,
        }}
      >
        <LoaderContext.Provider value={{ Load, setLoad }}>
          <Modal />
          <Routes>
            <Route
              path="/"
              element={
                <div className="main-home-page">
                  <Sidebar />
                  <Nav />
                  <Main />
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className="main-home-page">
                  <Sidebar />
                  <Nav />
                  <Main />
                </div>
              }
            />
            <Route
              path="/user"
              element={
                <div className="main-home-page">
                  <Sidebar />
                  <Nav />
                  <Private component={<Profile />} />
                </div>
              }
            />
            <Route
              path="/user/friends"
              element={
                <div className="main-home-page">
                  <Sidebar />
                  <Nav />
                  <Private component={<Friends />} />
                </div>
              }
            />
            <Route
              path="/user/rooms"
              element={
                <div className="main-home-page">
                  <Sidebar />
                  <Nav />
                  <Private component={<Room />} />
                </div>
              }
            />
            <Route
              path="/user/rooms/:id"
              element={
                <div className="main-home-page">
                  <Sidebar />
                  <Nav />
                  <Editor />
                </div>
              }
            />
            <Route path="/register" element={<LoginSignup />} />
          </Routes>
        </LoaderContext.Provider>
      </UserContext.Provider>
    </React.Fragment>
  );
}

export default Home;
