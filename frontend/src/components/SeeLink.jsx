import * as React from "react";
import "../App.css";

export default function SeeLink({ isModalOpen, onClose, viewLink }) {
  const copyLink = () => {
    navigator.clipboard.writeText(viewLink);
    onClose();
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal" onClick={onClose}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <div className="table-container">
              <h2 className="table-title">Interview Link:</h2>
              <input
                disabled
                value={viewLink}
                className="question-packagename-text"
              />
              <button
                onClick={copyLink}
                style={{ marginLeft: "75%", borderRadius: "2cap" }}
                className="add-button2"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
