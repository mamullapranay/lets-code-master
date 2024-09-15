import React, { useState } from "react";

function ModalCode({
  password,
  userName,
  userEmail,
  image,
  set_User_Name,
  set_User_Email,
  set_User_Avtar,
  setMode,
  setName,
  setEmail,
  setImg,
  user_Name,
  user_Email,
  user_Avtar,
}) {
  const [typedPass, setTypedPass] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);

  const handleConfirm = () => {
    if (password === typedPass) {
      setTypedPass('');
      setWrongPassword(false);
      set_User_Name(userName);
      set_User_Email(userEmail);
      set_User_Avtar(image);
      setMode(false);
      closeModal();
    } else {
      setWrongPassword(true);
    }
  };

  const closeModal = () => {
    setMode(false);
    setName(user_Name);
    setEmail(user_Email);
    setImg(user_Avtar);
    setTypedPass('');
    setWrongPassword(false);
  };

  return (
    <div id="modal-code" className="modal">
      <div className="modal__content">
        <h1>Enter Password :</h1>
        <input
          type="password"
          value={typedPass}
          onChange={(e) => setTypedPass(e.target.value)}
        />
        {wrongPassword && (
          <h4 id="wrong-password" style={{ opacity: 1 }}>
            Please enter the correct password.
          </h4>
        )}
        <div className="modal__footer">
          <button onClick={handleConfirm}>Confirm</button>
        </div>
        <span
  className="modal__close"
  onClick={closeModal}
  role="button"
  tabIndex="0" // to make it focusable
  aria-label="Close Modal" // for accessibility
>
  &times;
</span>

      </div>
    </div>
  );
}

export default ModalCode;
