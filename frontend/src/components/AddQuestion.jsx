import * as React from "react";
import "../App.css";
import MinuteInput from "./MinuteInput";
import useAPI from "../store/storeAPI";
import { useNavigate } from "react-router-dom";

export default function AddQuestion({ isOpen, onClose, onChange }) {
  const nav = useNavigate();
  const { error, loading, setData } = useAPI();
  const [minutes, setMinutes] = React.useState("");
  const [question, setQuestion] = React.useState("");

  const addQuestion = async () => {
    const newBody = {
      question: question,
      timer: minutes,
    };
    const link = "createquestion";
    const order = "POST";
    const data = await setData(link, order, newBody);
    console.log(data);
    onChange(data._id);
    nav(0);
    onClose();
  };

  const handleQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const handleMinuteChange = (val) => {
    setMinutes(val);
  };

  return (
    <>
      {error && <h3>{error}</h3>}
      {loading && <h3>Loading...</h3>}
      {isOpen && (
        <div>
          <h5>Soru:</h5>
          <textarea
            onChange={handleQuestion}
            value={question}
            className="question-area"
          ></textarea>
          <MinuteInput val={minutes} onChange={handleMinuteChange} />
          <button className="modal-submit-button" onClick={addQuestion}>
            Add
          </button>
        </div>
      )}
    </>
  );
}
