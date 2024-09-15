import React, { useState } from 'react';
import '../style/Modal.scss';

function AddFile(props) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div id="modal_AddFile" className="modal modal-active">
        <h1>Enter File Name</h1>
        <input type="text" />
        <div className="modal__footer">
          <button>{props.name}</button>
        </div>
        <button
          className="modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
    )
  );
}

export default AddFile;
