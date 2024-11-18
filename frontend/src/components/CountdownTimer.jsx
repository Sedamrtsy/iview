import * as React from "react";
import "../App.css";

const CountdownTimer = ({ totalTimeInMinutes }) => {
  const [timeLeft, setTimeLeft] = React.useState(totalTimeInMinutes * 60);

  React.useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
  <div>
    <h2
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        margin: "0",
        padding: "5px",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Arka planı belirginleştirmek için
        borderRadius: "5px",
        color: "#333", // Yazı rengi
        fontSize: "16px",
        fontWeight: "bold",
      }}
    >
      Kalan Süreeee: {formatTime(timeLeft)}
    </h2>
    {timeLeft <= 0 && <p>Süre doldu!</p>}
  </div>

  );
};

export default CountdownTimer;
