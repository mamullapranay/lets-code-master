import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import ReturnAvtars from "../../Avtars/Avtar";
import { ErrorContext } from "../../context/ErrorContext";
import LoaderRing from "../../useFul/Loader";

let Avtars = ReturnAvtars();

function Invite({ total_Users_p, friends_p, sended_p }) {
  const error = useContext(ErrorContext);
  const [load, setLoad] = useState(-1);
  const [total_Users, setTotalUsers] = useState(total_Users_p);
  const [friends, setFriends] = useState(friends_p);
  const [sended, setSended] = useState(sended_p);
  const [filter, setFilter] = useState(total_Users_p);

  // Sync props to state
  useEffect(() => {
    setTotalUsers(total_Users_p);
    setFriends(friends_p);
    setSended(sended_p);
    setFilter(total_Users_p);
  }, [total_Users_p, friends_p, sended_p]);

  const return_Filters = () => {
    if (filter.length === 0) {
      return (
        <div className="empty">
          <h3>Nothing is here..</h3>
        </div>
      );
    }
    return null;
  };

  const sendRequest = async (id, index) => {
    setLoad(index);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      let id1 = id;
      let id2 = localStorage.getItem("id");

      await axios.put(
        "https://lets-code-backend-f27r.onrender.com/api/v1/friends/send",
        { id1, id2 },
        config
      );
      await axios.put(
        `https://lets-code-backend-f27r.onrender.com/api/v1/user/notification/add/${id1}`,
        { value: `new friend request received` },
        config
      );

      setLoad(-1);
      error("Request successfully sent");

      setTimeout(() => {
        error("");
      }, 5000);

      document.getElementById(id1).classList.remove("fa-user-plus");
      document.getElementById(id1).classList.add("fa-hourglass-half");
      document.getElementById(id).removeAttribute("id");
    } catch (e) {
      error(e.response?.data?.error || "An error occurred");
      setTimeout(() => {
        error("");
      }, 5000);
      setLoad(-1);
    }
  };

  const checkingFlag = (e, index_id, index) => {
    if (e === 2) {
      return (
        <i
          className="fas fa-hourglass-half"
          onClick={() => {
            error("Request already sent");
            setTimeout(() => {
              error("");
            }, 5000);
          }}
        ></i>
      );
    } else if (e === 1) {
      return (
        <i
          className="fas fa-check-square"
          onClick={() => {
            error("Already your friend");
            setTimeout(() => {
              error("");
            }, 5000);
          }}
        ></i>
      );
    } else {
      return (
        <i
          className="fas fa-user-plus"
          id={index_id}
          onClick={() => sendRequest(index_id, index)}
        ></i>
      );
    }
  };

  const returnMainData = () => {
    return (
      <>
        {return_Filters()}
        {filter.map((res, index) => {
          let flag = 0;
          friends.forEach((re) => {
            if (res._id === re._id) {
              flag = 1;
            }
          });
          if (flag !== 1) {
            sended.forEach((re) => {
              if (re === res._id) {
                flag = 2;
              }
            });
          }

          return (
            <div className="main-bot-box" key={`friend-request-${res._id}`}>
              <div className="left">
                <img src={Avtars[res.profileIMG || 0].src} alt="Avatar" />
                <h4>{res.username}</h4>
              </div>
              <div className="right">
                {load === index ? <LoaderRing /> : checkingFlag(flag, res._id, index)}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const returnSkeleton = () => {
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="main-bot-box skeleton-text"
              style={{ padding: "20px 0" }}
            ></div>
          ))}
      </>
    );
  };

  return (
    <div className="invite-friends">
      <div className="invite-type">
        <h2>Invite Friends</h2>
        <input
          type="text"
          onChange={(e) => {
            const query = e.target.value.trim();
            const filteredUsers = total_Users.filter((user) =>
              user.username.includes(query)
            );
            setFilter(filteredUsers);
          }}
        />
      </div>
      <div className="invite-result">
        <h2>Results</h2>
        <div className="search-results">
          {total_Users == null || friends == null || sended == null || filter == null
            ? returnSkeleton()
            : returnMainData()}
        </div>
      </div>
    </div>
  );
}

export default Invite;
