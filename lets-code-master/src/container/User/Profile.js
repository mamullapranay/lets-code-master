import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "../context/LoaderContext";
import { UserContext } from "../context/UserContext";
import "../style/Profile.scss";
import BottomProfile from "./Profile/BottomProfile";
import TopProfile from "./Profile/TopProfile";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const { setLoad } = useContext(LoaderContext);
  const { setUserName } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const id = localStorage.getItem("id");
      if (!id) {
        // Redirect if no user ID is found
        navigate("/login");
        return;
      }

      try {
        setLoad(1); // Start loading
        const response = await axios.get(
          `https://lets-code-backend-f27r.onrender.com/api/v1/user/${id}`
        );
        setUserDetails(response.data);
        setUserName(response.data.name); // Assuming there's a 'name' field in user data
      } catch (e) {
        console.error("Failed to fetch user details", e.response?.data?.error);
      } finally {
        setLoad(0); // Stop loading
      }
    };

    fetchUserDetails();
  }, [navigate, setLoad, setUserName]);

  return (
    <div className="main-profile-page">
      {userDetails ? (
        <>
          <TopProfile userDetails={userDetails} />
          <BottomProfile userDetails={userDetails} />
        </>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
}

export default Profile;
