import * as React from "react";
import "../../App.css";
//import AdminDrawer from "../../components/AdminDrawer";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useAPI from "../../store/storeAPI";
import { MdPending } from "react-icons/md";

export default function VideoCollection() {
  const {fetchData } = useAPI();
  const [interview, setInterview] = React.useState({});
  const [candidates, setCandidates] = React.useState([]);
  const [video, setVideo] = React.useState([]);
  const { id } = useParams();
  const nav = useNavigate();
  const goVideo = (e) => {
    const val = e.target.value
    nav(`/interviewvideo/${id}/${val}`);
  };
  const goBack = () => {
    nav(-1);
  };

  const getCandidates = async () => {
    if (id === undefined || id === "undefined") {
      nav(-1);
    }
    const data = await fetchData(`getinterviewbyid/${id}`, "GET");
    setInterview(data);
    if (data?.candidates && candidates !== 0) {
      var newList = [];
      var videosList = [];
      for (let i of data.candidates) {
        const candidateData = await fetchData(`getcandidatebyid/${i}`, "GET");
        newList.push(candidateData);
        var candidateID = candidateData._id;
        var candidateName = candidateData.name;
        var candidateSurname = candidateData.surname;
        candidateName += " " + candidateSurname;
        var candidateVideo = candidateData.video;
        var candidateStatus = candidateData.status;
        videosList.push({
          id: candidateID,
          name: candidateName,
          video: candidateVideo,
          watched : candidateStatus
        });
      }
      setVideo(videosList);
      setCandidates(newList);
    }
  };

  React.useEffect(() => {
    const getInter = async () => {
      await getCandidates();
    };
    getInter();
  }, []);

  const Card = ({ valid, name, video, watched }) => {
    const getStatus = (status) => {
      if (status === "approved") {
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="green"
              style={{ width: "24px", height: "24px",marginBottom: "55px",marginLeft: "-260px", marginTop: "-56px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
       
          color: "green",
        };
      } else if (status === "rejected") {
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="red"
              style={{ width: "24px", height: "24px" ,marginBottom: "55px",marginLeft: "-260px", marginTop: "-56px"}}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
          
          color: "red",
        };
      } else if (status === "pending") {
        return {
          icon: (
            <MdPending  style={{ width: "24px", height: "24px" ,marginBottom: "55px",marginLeft: "-260px", marginTop: "-56px"}}/>
          ),

          color: "orange",
        };
      }
      return null;
    };
  
    const status = getStatus(watched);
  
    return (
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
          border: "2px solid transparent",
          width: "300px",
          height: "220px",
          margin: "10px",
        }}
      >
        <h5 style={{ marginTop: "10px" }}>{name}</h5>
        {status && (
          <div style={{ color: status.color, marginBottom: "10px" }}>
            {status.icon}
            <span style={{ marginLeft: "8px", fontSize: "16px" }}>
              {status.text}
            </span>
          </div>
        )}
        <video
          className="videocard"
          alt={name}
          src={video}
          value={valid}
          onClick={goVideo}
          style={{marginTop:"-40px"}}
        />
        <button value={valid} onClick={goVideo} className="card-info-button" style={{
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "8px", // Optional: to add space between the icon and text
          marginLeft: "105px",  // Moves the button slightly to the right
          marginTop: "-103px",
          position: "relative", // Allow positioning inside the card
          zIndex: 10, // Ensure it's above other elements
          borderRadius: "1cap",
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          Watch
        </button>
      </div>
    );
  };
  
  return (
    <div>
 
      {/*<AdminDrawer />*/}
      <div /*className="adminDrawerOpen"*/ className="adminpage">
      <button className="back-button" onClick={goBack}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
          style={{ width: "24px", height: "24px",  marginLeft: "-230" }} // İkonun boyutunu burada ayarlayın
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
      </button>
      <h2 style={{ marginTop: "-95px" }} >{interview.title_name}</h2>
        <div className="gridVideoCollection-container">
          {video !== null ? (
            video.map((v, index) => (
              <Card key={index} valid={v.id} name={v.name} video={v.video} watched={v.watched} />
            ))
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
