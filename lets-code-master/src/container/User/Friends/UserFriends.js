import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ReturnAvtars from "../../Avtars/Avtar";
import { UserContext } from "../../context/UserContext";

let Avtars = ReturnAvtars();

function UserFriends({ friends }) {
  const { user_Rooms } = useContext(UserContext);
  const [userFriends, setUserFriends] = useState(friends);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setUserFriends(friends);
  }, [friends]);

  const returnRooms = () => {
    if (!userFriends || userFriends.length === 0) {
      return (
        <div className="empty">
          <h3>Nothing is here...</h3>
        </div>
      );
    } else {
      return userFriends[selected].rooms.map((res, index) => {
        if (user_Rooms.some((e) => e.roomID === res.roomID)) {
          return (
            <Link to={`/user/rooms/${res.roomID}`} key={`user-room-${index}`}>
              <div className="main-bot-box">
                <div className="left">
                  <h4>{res.roomname}</h4>
                </div>
                <div className="right">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </Link>
          );
        }
        return null; // To avoid warnings if no matching room is found
      });
    }
  };

  const returnMainData = () => {
    return (
      <>
        {userFriends.map((res, index) => (
          <div
            className={`main-bot-box ${index === selected ? "active" : ""}`}
            key={`user-friend-${index}`}
            onClick={() => setSelected(index)}
          >
            <div className="left">
              <img src={Avtars[res.profileIMG]?.src} alt="Profile" />
              <h4>{res.username}</h4>
            </div>
            <div className="right">
              <i className="fas fa-angle-right"></i>
            </div>
          </div>
        ))}
      </>
    );
  };

  const returnSkeleton = () => {
    return (
      <>
        {[...Array(4)].map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="main-bot-box skeleton-text"
            style={{ padding: "20px 0" }}
          ></div>
        ))}
      </>
    );
  };

  return (
    <div className="main-friends">
      <div className="friends-list">
        <h2>Friends</h2>
        <div className="search-results select">
          {userFriends === null ? returnSkeleton() : returnMainData()}
        </div>
      </div>
      <div className="friends-common">
        <h2>Common-Rooms</h2>
        {userFriends === null ? (
          returnSkeleton()
        ) : (
          <div className="search-results select">{returnRooms()}</div>
        )}
      </div>
    </div>
  );
}

export default UserFriends;
