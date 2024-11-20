import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function QuestionList({ isModalOpen, onClose }) {
  const [questions, setQuestions] = React.useState([]); // Dinamik veriler için state
  const [loading, setLoading] = React.useState(true); // Yüklenme durumunu kontrol ediyoruz
  const [error, setError] = React.useState(null); // Hata yönetimi için state

  const nav = useNavigate();

  const goEdit = (e) => {
    const newid = e.target.value;
    nav(`/packagequestions/${newid}`);
  };

  // Çerezlerden token'ı alır
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  React.useEffect(() => {
    const fetchQuestion = async () => {
      setError(null);
      setLoading(true);
      const token = getCookie("token"); // Çerezden token alıyoruz

      try {
        const response = await fetch("https://iview.onrender.com/api/getquestion", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Token'ı çerezlerden gönderiyoruz
        });

        if (!response.ok) throw new Error("Questions did not fetch");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, []);

  // Eğer veriler yükleniyorsa, bir yükleme mesajı göster
  if (loading) {
    return <div>Loading...</div>;
  }

  // Eğer hata varsa hata mesajı göster
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {isModalOpen && (
        <div className="modal" onClick={onClose}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Modal dışına tıklanınca kapanır
          >
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <div className="table-container">
              <h2 className="table-title">Question List</h2>
              <table className="question-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((item) => (
                    <tr key={item._id}>
                      {/* Backend'den gelen ObjectId'yi kullan */}
                      <td>{item.question}</td>
                      <td>{item.timer} min</td> {/* Timer alanını backend'e göre düzenle */}
                      <button
                        value={item._id}
                        onClick={goEdit}
                        style={{ marginLeft: "75%", borderRadius: "2cap" }}
                        className="add-button2"
                      >
                        Edit
                      </button>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
