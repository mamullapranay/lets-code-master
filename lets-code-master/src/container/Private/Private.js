import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";
import { UserContext } from "../context/UserContext";
import { ErrorContext } from "../context/ErrorContext";

const Private = ({ component }) => {
  const error = useContext(ErrorContext);
  const navigate = useNavigate();
  const { setLoad } = useContext(LoaderContext);
  const token = localStorage.getItem("authToken-VNote");
  
  const { 
    set_User_Index, 
    set_User_Name, 
    set_User_Email 
  } = useContext(UserContext);

  useEffect(() => {
    if (!token) {
      navigate("/register");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoad(1);

        // Check if the user ID exists in localStorage
        if (!localStorage.getItem("id")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          };

          const { data } = await axios.get("https://lets-code-backend-f27r.onrender.com/api/private", config);
          localStorage.setItem("id", data.id);
        }

        const userId = localStorage.getItem("id");
        if (userId) {
          const { data } = await axios.get(`https://lets-code-backend-f27r.onrender.com/api/v1/user/${userId}`);
          
          set_User_Name(data.user.username);
          set_User_Index(data.user.profileIMG);
          set_User_Email(data.user.email);
        } else {
          throw new Error("User ID not found");
        }

        setLoad(0);
      } catch (e) {
        setLoad(0);
        error(e.response?.data?.error || "An error occurred");
        setTimeout(() => error(""), 5000);
        navigate("/register");
        set_User_Name("Login");
      }
    };

    fetchUserData();
  }, [token, navigate, setLoad, set_User_Index, set_User_Name, set_User_Email, error]);

  return component;
};

export default Private;
