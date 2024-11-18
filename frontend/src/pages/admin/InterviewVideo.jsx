import * as React from "react";
import "../../App.css";
//import AdminDrawer from "../../components/AdminDrawer";
import ToggleSwitch from "../../components/ToggleSwitch";
import { useNavigate, useParams } from "react-router-dom";
import useAPI from "../../store/storeAPI";

export default function InterviewVideo() {
  const { id, val } = useParams();
  const nav = useNavigate();
  const candidateID = val;
  const { fetchData, setData } = useAPI();
  const [interview, setInterview] = React.useState({});
  const [candidate, setCandidate] = React.useState({});
  const [video, setVideo] = React.useState("");
  const [savedNote, setNote] = React.useState("");
  const [watched, setWatched] = React.useState(false);
  const [approve, setApprove] = React.useState(false);
  const [reject, setReject] = React.useState(false);
  const [recWatch, setRecWatch] = React.useState("");
  const [candidateStat, setCandidateStat] = React.useState("");

  const handleNote = (e) => {
    setNote(e.target.value);
  };
  const handleApprove = (value) => {
    setApprove(value);
    setReject(!value);
  };
  const handleReject = (value) => {
    setApprove(!value);
    setReject(value);
  };

  const handleWatched = () => {
    setWatched(true);
  };
  function capitalize(str) {
    if (!str) return ""; // Eğer boş bir string geldiyse, boş döner
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  React.useEffect(() => {
    if (candidate?.status && candidate.status.length > 3) {
      console.log("Candidate status:", candidate.status);
      if (candidate.status === "rejected" || candidate.status === "approved") {
        setWatched(true);
      }
      var stat = candidate.status.toString();
      setCandidateStat(capitalize(stat));
      console.log("Candidate status:", candidate.status);
    }
  });

  // const fetchInterview = async () => {
  //   const data = await fetchData(`getinterviewbyid/${interID}`, "GET");
  //   if (data) {
  //     setInterview(data);
  //     const candidateData = await fetchData(
  //       `getcandidatebyid/${candidateID}`,
  //       "GET"
  //     );
  //     if (candidateData) {
  //       setCandidate(candidateData);
  //       setVideo(candidateData.video);
  //     }
  //   }
  // };

  const fetchInterview = async () => {
    try {
      const data = await fetchData(`signvideo/${candidateID}`, "GET");
      if (data && data.signedUrl) {
        setVideo(data.signedUrl);
      }

      const candidateData = await fetchData(`getcandidatebyid/${candidateID}`, "GET");
      if (candidateData) {
        setCandidate(candidateData);

        console.log("Candidate data:", candidateData);
        console.log("Signed video URL:", data.signedUrl);
      }

      const İnterwiewData = await fetchData(`getinterviewbyid/${candidateData.interview}`, "GET");
      setInterview(İnterwiewData);
      console.log("Interview data:", İnterwiewData);

    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };
  

  const goBack = () => {
    nav(-1);
  };

  React.useEffect(() => {
    if (!id || !val) {
      goBack();
    } else {
      fetchInterview();
    }
  }, [id, val]);

  // React.useEffect(() => {
  //   if (watched) {
  //     if (reject === false && approve === false) {
  //       setRecWatch("watched");
  //     } else if (reject === true) {
  //       setRecWatch("rejected");
  //     } else if (approve === true) {
  //       setRecWatch("approved");
  //     }
  //   }
  // }, [reject, approve, watched]);

  const submitInterview = async () => {
    const currentStatus = approve
      ? "approved"
      : reject
      ? "rejected"
      : watched
      ? "watched"
      : "";
  
    const bodyNote =
      savedNote && savedNote.length > 0 ? savedNote : candidate.note;
  
    const newBody = {
      note: bodyNote,
      status: currentStatus,
    };
  
    console.log("Submitting interview data:", newBody);
  
    await setData(`patchcandidates/${candidateID}`, "PATCH", newBody);
    alert("Değişiklikler kaydedildi.");
  };
  
  return (
    <div>
      {/*<AdminDrawer />*/}
      <div style={{marginTop : "4%"}}/*className="adminDrawerOpen"*/>
        <div className="video-interview-container">
          <div className="video-section">
          <button className="back-button" onClick={goBack} style={{ position: "absolute", top: "85px", left: "30px", background:"none" }}>         
            <svg 
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
              style={{ width: "24px", height: "24px" }} // İkonun boyutunu burada ayarlayın
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </button>
          <h2 style={{ marginTop: "-43px", marginLeft: "50px" }}>
            {interview.title_name || "Interview Name"}
          </h2>
            <div className="video-player">
              <video onClick={handleWatched} controls preload="auto" alt={candidate._id} type="video/webm" src={video} style={{ width: "58%", height: "430px", marginLeft:"50px" }}/>
            </div>
          </div>
          <div className="details-section">
            <h3>
              {(candidate.name || "CandidateName") +
                " " +
                (candidate.surname || "CandidateSurname")}
            </h3>
            <h6 style={{ marginTop: "0px", fontSize: "15px" }}> Status: {candidate.status}</h6>
            <div className="notes-section" style={{ marginTop: "-30px" }}>
              <label >Email: </label>
              <input
                className="candiInfo"
                disabled
                placeholder={candidate.email || "Email Information"}
                rows="8"
                style={{ marginLeft: "5px" }}
              />
              <label>Phone: </label>
              <input
                className="candiInfo"
                disabled
                placeholder={candidate.phone_number || "Phone Information"}
                rows="8"
              />
            </div>
            <div className="notes-section">
              <textarea
                placeholder={candidate.note}
                value={savedNote}
                onChange={handleNote}
                rows="8"
              ></textarea>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
              <ToggleSwitch onChange={handleApprove} value={approve} label={"Approve:"} />
              <ToggleSwitch onChange={handleReject} value={reject} label={"Reject:"} />
            </div>
            <br />
            <button onClick={submitInterview} className="save-button" style={{ marginTop:"-15px"}}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
