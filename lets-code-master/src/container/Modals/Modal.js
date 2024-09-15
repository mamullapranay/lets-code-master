import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../context/ErrorContext";
import { LoaderContext } from "../context/LoaderContext";
import { UserContext } from "../context/UserContext"; // Make sure this is imported

import "../style/Modal.scss";

function Modal() {
  const [roomname, setRoomName] = useState("");
  const { set_User_Rooms, user_Rooms, user_Id } = useContext(UserContext);
  const error = useContext(ErrorContext);
  const {  setLoad } = useContext(LoaderContext);
  const navigate = useNavigate();

  const createRoom = async () => {
    setLoad(1);
    const token = localStorage.getItem("authToken-VNote");

    if (roomname.trim() === "") {
      error("Please provide a valid room name");
      setTimeout(() => error(""), 5000);
      setLoad(0);
      return;
    }

    if (!token) {
      error("Please log in first");
      setTimeout(() => error(""), 5000);
      navigate("/register");
      setLoad(0); // Ensure Load state is set back to 0
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `https://lets-code-backend-f27r.onrender.com/api/v1/rooms/create/${user_Id}`,
        { roomname },
        config
      );
      set_User_Rooms([...user_Rooms, response.data.detail]);
      document.getElementById("modal")?.classList.remove("modal-active");
      setRoomName(""); // Clear room name input
      error(`New room: ${response.data.detail.roomname} created`);
      setTimeout(() => error(""), 5000);
    } catch (e) {
      error(e.response?.data?.error || "An error occurred");
      setTimeout(() => error(""), 5000);
    } finally {
      setLoad(0); // Ensure Load state is set back to 0
    }
  };

  return (
    <div id="modal" className="modal">
      <div className="modal__content">
        <h1>Enter new room name:</h1>
        <input
          type="text"
          value={roomname}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <div className="modal__footer">
          <button onClick={createRoom}>Save</button>
        </div>
        <button
  className="modal__close"
  onClick={() => {
    setRoomName("");
    document.getElementById("modal")?.classList.remove("modal-active");
  }}
>
  &times;
</button>

      </div>
    </div>
  );
}

export default Modal;
