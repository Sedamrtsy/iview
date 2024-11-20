import * as React from "react";
import "../../App.css";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCardList from "../../components/QuestionCardList";
import VideoRecorder from "../../components/VideoRecorder";

export default function InterviewPage() {
  const nav = useNavigate();
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

  const handleStart = async () => {
    setIsStart(true);
    await fetchQuestions();
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
    if (candidate) {
      setCandiOK(true);
    } else {
      setCandiOK(false);
    }
  }, [candidate]);

  React.useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_LINK}getinterviewbyid/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Interview data could not be fetched");
        }
  
        const data = await response.json();
        setInter(data);
        console.log("Fetched interview data:", data);
      } catch (err) {
        console.error("Interview data could not be loaded", err.message);
        // Yönlendirmeyi kaldırarak sadece hatayı konsola yazdırın.
        // nav("/");
      }
    };
  
    if (id !== undefined && id !== "undefined") {
      fetchInterview();
    }
  }, [id, nav]);
  

  const fetchQuestions = async () => {
    try {
      if (inter?.question?.length > 0) {
        let newList = [];
        for (let i of inter.question) {
          const questResponse = await fetch(`${import.meta.env.VITE_API_LINK}getquestionbyid/${i}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!questResponse.ok) {
            throw new Error("Question data could not be fetched");
          }

          const questionData = await questResponse.json();
          newList.push(questionData);
        }
        setAllQuestions(newList);
      } else {
        console.error("Interview data does not contain questions.");
      }
    } catch (err) {
      console.error("Error occurred while fetching questions", err.message);
    }
  };

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
                  marginTop: "420px",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={!isStart ? handleStart : handleFinish}
                  className="interview-button"
                  style={{
                    marginLeft: !isStart ? "35%" : "60%",
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
