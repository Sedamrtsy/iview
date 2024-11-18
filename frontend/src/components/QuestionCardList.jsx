import * as React from "react";
import "../App.css";

// Her bir Card bileşeni
const Card = ({ question, time, onNextQuestion, canSkip }) => {
  const numberTime =parseInt(time)
  const formedTime = 60*numberTime;
  const [remainingTime, setRemainingTime] = React.useState(formedTime);

  // Zamanlayıcı
  React.useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    if (remainingTime <= 0) {
      clearInterval(timer);
      onNextQuestion();
    }

    return () => clearInterval(timer); // Temizlik için
  }, [remainingTime, onNextQuestion]);

  return (
  <div className="candidateQuestionCard">
    <h3>{question}</h3>
    <p
      style={{
        position: "absolute",
        top: "131px",
        right: "209px",
        margin: "0",
        padding: "5px",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Yarı saydam arka plan
        borderRadius: "5px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333",
      }}
    >
      Kalan Süre: {remainingTime} saniye
    </p>
    {canSkip && (
      <button
        style={{
          fontFamily: "Montserrat",
          width: "35%",
          height: "5vh",
          backgroundColor: "#3d8d88",
          border: "none",
          borderRadius: "2cap",
          cursor: "pointer",
          marginTop: "187px",
          color: "white",
          marginLeft: "20px",
        }}
        onClick={onNextQuestion}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#79C9C4";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#3d8d88";
          e.target.style.color = "white";
        }}
      >
        Bu Soruyu Geç
      </button>
    )}
  </div>
  );
};

// CardList bileşeni
export default function QuestionCardList({ questions, canSkip }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
    }
  };

  // Eğer questions dizisi boş veya undefined ise hata oluşmasını engelle
  if (!questions || questions.length === 0) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <Card
        className="questionCard"
        question={`Soru:  ${questions[currentIndex].question}`}
        time={questions[currentIndex].timer}
        onNextQuestion={handleNextQuestion}
        canSkip={canSkip}
      />
    </div>
  );
  
}
