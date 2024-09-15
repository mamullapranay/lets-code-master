import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";
import { LoaderContext } from "../context/LoaderContext";
import "../style/Friends.scss";
import Invite from "./Friends/Invite";
import UserFriends from "./Friends/UserFriends";

function Friends(props) {
  const error = useContext(ErrorContext);
  const { setLoad } = useContext(LoaderContext);

  const [totalUsers, setTotalUsers] = useState(null);
  const [sended, setSended] = useState(null);
  const [friends, setFriends] = useState(null);
  const [userRooms, setUserRooms] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id");

      if (!id) {
        error("User ID not found");
        return;
      }

      try {
        setLoad(1);

        // Fetch all users
        const usersResponse = await axios.get(
          `https://lets-code-backend-f27r.onrender.com/api/v1/user/getall/${id}`
        );
        setTotalUsers(usersResponse.data.all);

        // Fetch friends data
        const friendsResponse = await axios.get(
          `https://lets-code-backend-f27r.onrender.com/api/v1/friends/getfriends/${id}`
        );
        setSended(friendsResponse.data.sended);
        setFriends(friendsResponse.data.friends);
        setUserRooms(friendsResponse.data.rooms);

      } catch (e) {
        error(e.response?.data?.error || "An unexpected error occurred");
        setTimeout(() => {
          error("");
        }, 5000);
      } finally {
        setLoad(0);
      }
    };

    fetchData();
  }, [error, setLoad]);

  return (
    <div className="main-friend-page">
      <Invite total_Users_p={totalUsers} friends_p={friends} sended_p={sended} />
      <UserFriends sended={sended} friends={friends} user_Rooms={userRooms} />
    </div>
  );
}

export default Friends;
