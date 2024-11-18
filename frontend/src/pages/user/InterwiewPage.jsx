import * as React from "react";
import "../../App.css";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import { useNavigate, useParams } from "react-router-dom";
import useAPI from "../../store/storeAPI";
import QuestionCardList from "../../components/QuestionCardList";
import VideoRecorder from "../../components/VideoRecorder";

export default function InterviewPage() {
  const nav = useNavigate();
  const { fetchData, setData } = useAPI();
  const [isStart, setIsStart] = React.useState(false);
  const [candidate, setCandidate] = React.useState("");
  const [candiOK, setCandiOK] = React.useState(false);
  const [inter, setInter] = React.useState({});
  const [videoURL, setVideoURL] = React.useState("");
  const [allQuestions, setAllQuestions] = React.useState([]);
  const [modalPen, setModalPen] = React.useState(true);
  const { id } = useParams();
  const videoRef = React.useRef(null); // VideoRecorder referansı

  const handleCandidate = (e) => {
    setCandidate(e);
  };

  // const handleStart = () => {
  //   setIsStart(true);
  // };

  const handleStart = async () => {
    await fetchQuestions();
    setIsStart(true);
    if (videoRef.current) {
      videoRef.current.startRecording(); // Video kaydını başlat
    }
  };
  const handleFinish = () => {
    if (videoRef.current) {
      videoRef.current.stopRecordingAndUpload(); // Video kaydını durdur ve yüklemeyi başlat
    }
  };

  const handleVideoURL = (e) => {
    setVideoURL(e);
  };

  React.useEffect(() => {
    if (
      candidate &&
      candidate !== null &&
      candidate !== undefined &&
      candidate !== "undefined"
    ) {
      setCandiOK(true);
    } else if (
      candidate === null ||
      candidate === undefined ||
      candidate === "undefined"
    ) {
      setCandiOK(false);
    }
  }, [candidate]);

  const fetchQuestions = async () => {
    try {
      const interData = await fetchData(`getinterviewbyid/${id}`, "GET");
      setInter(interData);
      console.log("Fetched questions data:", interData);
      if (interData?.question?.length > 0) {
        var newList = [];
        for (let i of interData.question) {
          const questData = await fetchData(`getquestionbyid/${i}`, "GET");
          newList.push(questData);
        }
        setAllQuestions(newList);
      }
    } catch (err) {
      console.error("Sorular çekilirken hata oluştu", err.message);
    }
  };
  React.useEffect(() => {
    if (id === undefined || id === "undefined") {
    }
    fetchQuestions();
    if (!allQuestions || allQuestions.length <= 0) {
      console.error("hata");
    }
  }, [id]);

  const handleModelClose = () => {
    setModalPen(false);
  };
  return (
    <div className="interview-page">    
      <PersonalInfoForm
        handleCandi={handleCandidate}
        isModalOpen={modalPen}
        onClose={handleModelClose}
        interid={id}
      />
      {candiOK ? (
        <div
          style={{
            marginTop: "1%",
            border: "5px solid #38817c",
            borderRadius: "10px",
            width: "77%",
            height: "540px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div style={{ marginTop: "10%" }}>
            <div style={{ marginLeft: "25%" }}>
              <div
                style={{
                  marginTop: "420px", // Butonu aşağı almak için ekledim
                  textAlign: "center", // Ortalamak için
                }}
              >
                <button
                  onClick={!isStart ? handleStart : handleFinish}
                  className="interview-button"
                  style={{
                    marginLeft: !isStart ? "35%" : "60%", // Başla biraz solda, Kaydı Bitir ve Gönder sağda
                    marginBottom: "2%",
                    width: "25%",
                    height: "5vh",
                    backgroundColor: "#3d8d88",
                    border: "none",
                    borderRadius: "2cap",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#79C9C4";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#3d8d88";
                    e.target.style.color = "white";
                  }}
                >
                  {!isStart ? "Başla" : "Kaydı Bitir ve Gönder"}
                </button>
              </div>
              <div className="videoRecorder">
                <VideoRecorder
                  className="videoRecorder"
                  ref={videoRef}
                  handleURL={handleVideoURL}
                  email={candidate.email}
                />
              </div>
              {isStart && (
                <QuestionCardList questions={allQuestions} canSkip={true} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );   
}
