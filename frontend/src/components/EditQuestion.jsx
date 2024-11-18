import * as React from "react";
import "../App.css";
import useAPI from "../store/storeAPI";
import MinuteInput from "./MinuteInput";
import { useNavigate } from "react-router-dom";

export default function EditQuestion({ isOpen, onClose, val }) {
    const nav = useNavigate();
  const { error, loading, fetchData, setData } = useAPI();
  const [quest, setQuest] = React.useState({});
  const [currQuest, setCurrQuest] = React.useState("");
  const [currTime, setCurrTime] = React.useState("");

  // Soru ve zaman değerlerini inputlardan alıyoruz
  const handleQuest = (e) => {
    setCurrQuest(e.target.value);
  };
  
  const handleTime = (e) => {
    setCurrTime(e);
  };

  // Soru verisini API'den alıyoruz
  const loadData = async () => {
    try {
      const data = await fetchData(`getquestionbyid/${val}`, "GET");
      setQuest(data);
      setCurrQuest(data.question); // Güncel soru bilgisini dolduruyoruz
      setCurrTime(data.timer);     // Güncel süre bilgisini dolduruyoruz
    } catch (err) {
      console.error("Data çekme işleminde hata:", err.message);
    }
  };

  // Güncelleme işlemi için API'ye PATCH isteği
  const updateData = async () => {
    const newBody = {
      question: currQuest,
      timer: currTime
    };
    console.log(newBody);
    try {
      await setData(`patchquestion/${val}`, "PATCH", newBody);
      onClose(); // Güncellemeden sonra pencereyi kapatma
    } catch (err) {
      console.error("Data güncelleme işleminde hata:", err.message);
    }
    nav(0)
  };

  // Modal açıldığında soruyu yüklemek için
  React.useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  return (
    <>
      {error && <h3>{error}</h3>}
      {loading && <h3>Loading...</h3>}
      {isOpen && (
        <div>
          <h5>Soru:</h5>
          <textarea
            onChange={handleQuest}
            value={currQuest}
            className="question-area"
          ></textarea>
          <MinuteInput val={currTime} onChange={handleTime} />
          <button className="modal-submit-button" onClick={updateData}>
            Update
          </button>
          <button className="modal-submit-button" onClick={onClose}>Cancel</button>
        </div>
      )}
    </>
  );
}
