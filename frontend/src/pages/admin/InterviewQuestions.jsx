import * as React from "react";
import "../../App.css";
//import AdminDrawer from "../../components/AdminDrawer";
import { useNavigate } from "react-router-dom";
import AddQuestion from "../../components/AddQuestion";
import EditQuestion from "../../components/EditQuestion";
import { useParams } from "react-router-dom";
import useAPI from "../../store/storeAPI";
import ToggleSwitch from "../../components/ToggleSwitch";
//import PackageChange from "../../components/PackageChange";

export default function InterviewQuestions() {
  const { id } = useParams();
  React.useEffect(() => {
    if (id === undefined || id === "undefined") {
      nav("/adminhomepage");
    }
  });
  const { fetchData, setData } = useAPI();
  //const [pack, setPack] = React.useState({});
  const [editID, setEditID] = React.useState("");
  const [questionOpen, setIsOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [interview, setInterview] = React.useState({});
  const [questions, setQuestions] = React.useState([]);
  const [interviewQuestions, setInterviewQuestions] = React.useState([]);
  const [packageQuestions, setPackageQuestions] = React.useState([]);
  const [activate, setActivate] = React.useState(true);
  //const [packModal, setPackModal] = React.useState(false);

  /*const handlePackModalOpen = () => {
    setPackModal(true);
  };*/

  /*const handlePackModalClose = () => {
    setPackModal(false);
  };*/

  const handleEdit = (e) => {
    if (interview.candidates.length > 0) {
      alert("Bu mülakattaki soruları değiştiremezsiniz.");
      return;
    }
    const edit = e.target.value;
    setEditID(edit);
    setEditOpen(true); // Düzenleme modal'ını açıyoruz
  };

  const nav = useNavigate();
  const goBack = () => nav(-1);

  const handleActivate = async (value) => {
    try {
      // Önce state'i güncelleyip sonra API isteği gönderiyoruz
      setActivate(value);

      // PATCH isteği ile API'yi güncelle
      const newBody = { activate: value };
      await setData(`patchinterview/${id}`, "PATCH", newBody);
    } catch (error) {
      console.error("Aktivasyon durumu değiştirilemedi:", error);
      // Hata yönetimi ekleyin, örneğin kullanıcıya uyarı gösterebilirsiniz
    }
  };

  const handleRec = async (quest) => {
    if (interview.candidates.length > 0) {
      alert("Bu mülakata yeni kayıt yapamazsınız.");
      return;
    }
    //"quest" değeri kayıttan sonra oluşturulan yeni question ın id değeri!!
    var newArr = [...interviewQuestions, quest];
    console.log(newArr);
    setInterviewQuestions(newArr);
    const newBody = { question: newArr };
    await setData(`patchinterview/${id}`, "PATCH", newBody);
    nav(0);
  };

  // Soru silme işlevi
  const handleDelete = async (e) => {
    if (interview.candidates.length > 0) {
      alert("Bu mülakattaki soruları silemezsiniz.");
      return;
    }
    const delID = e.target.value;
    const newIntQuestions = interviewQuestions;
    interviewQuestions.splice(interviewQuestions.indexOf(delID), 1);
    const newBody = { question: newIntQuestions };
    await setData(`updateinterview/${id}`, "PUT", newBody);
    await fetchData(`deletequestion/${delID}`, "DELETE");

    loadPage();
    nav(0);
  };

  const loadPage = async () => {
    const interData = await fetchData(`getinterviewbyid/${id}`, "GET");
    if (interData) {
      setInterview(interData);
      if (interData?.question && interData?.question?.length > 0) {
        setInterviewQuestions(interData.question);
        var list = [];
        for (let i of interData.question) {
          try {
            const questData = await fetchData(`getquestionbyid/${i}`, "GET");
            list.push(questData);
          } catch (err) {
            console.error("soru çekme hatası", err);
          }
        }
        setQuestions(list);
      }
    }
  };

  /*const loadPage = async () => {
    if (id === undefined || id === "undefined") {
      nav("/adminhomepage");
    }
    var interQuestList = [];
    var packQuestList = [];
    try {
      const interData = await fetchData(`getinterviewbyid/${id}`, "GET");
      if (interData?.question && interData.question.length > 0) {
        interQuestList = interData.question;
        setInterviewQuestions(interQuestList);
      }
      setInterview(interData);
      if (interData.package && interData.question !== "") {
        const packData = await fetchData(
          `getpackagebyid/${interData.package}`,
          "GET"
        );
        setPack(packData);
        packQuestList = packData.question;
        setPackageQuestions(packQuestList);
      }
      const mergedList = [...interQuestList, ...packQuestList];
      var questList = [];
      for (let i of mergedList) {
        const questData = await fetchData(`getquestionbyid/${i}`, "GET");
        questList.push(questData);
      }
      setQuestions(questList);
    } catch (err) {
      console.error("Error loading Page: ", err.message);
    }
  };*/

  React.useEffect(() => {
    if (id === undefined || id === "undefined") {
      nav("/adminhomepage"); // Eğer id geçersizse, geri yönlendir
      return;
    }

    const getActive = async () => {
      try {
        // API'den mevcut activate durumunu alıyoruz
        const data = await fetchData(`getinterviewbyid/${id}`, "GET");
        setActivate(data.activate); // Durumu güncelliyoruz
      } catch (error) {
        console.error("Aktiflik durumu alınamadı:", error);
        // Hata yönetimi ekleyebilirsiniz
      }
    };

    getActive();
    loadPage(); // Sayfa yükleme fonksiyonu çağrılıyor
  }, [id, fetchData]);

  const handleOpen = () => {
    if (interview.candidates.length > 0) {
      alert("Bu mülakata soru ekleyemezsiniz.");
      return;
    }
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);
  const handleEditClose = () => setEditOpen(false);

  return (
    <div>
      {/*<AdminDrawer />*/}
      <div style={{ marginTop: "7%" }}>
        <button
          style={{ backgroundColor: "#c0c9c0" }}
          className="back-button"
          onClick={goBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{ width: "24px", height: "24px" }} // İkonun boyutunu burada ayarlayın
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>

        <div className="question-table-container">
          <h3>{interview.title_name}</h3>
          <ToggleSwitch
            label="Activate"
            onChange={handleActivate}
            value={activate}
          ></ToggleSwitch>
          <button
            onClick={questionOpen ? handleClose : handleOpen}
            className="add-button2"
          >
            {questionOpen ? "Close" : "+Add"}
          </button>
          <AddQuestion
            isOpen={questionOpen}
            onClose={handleClose}
            onChange={handleRec}
          />
          <EditQuestion
            isOpen={editOpen}
            onClose={handleEditClose}
            val={editID}
          />
          {/*<button
            onClick={packModal ? handlePackModalClose : handlePackModalOpen}
            className="add-button2"
          >
            {packModal ? "Close" : "ChangePackage"}
          </button>
          <PackageChange
            isModalOpen={packModal}
            onClose={handlePackModalClose}
            onClick={handlePackModalOpen}
            value={pack._id}
            interview={id}
          />*/}
          <br />
          <table className="question-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Question</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions && questions.length > 0 ? (
                questions.map((q, index) => (
                  /*q!==null&&*/
                  <tr key={index}>
                    <td className="drag-handle">{index + 1}</td>
                    <td>{q?.question}</td>
                    <td>{q?.timer}</td>
                    <td>
                      <button
                        value={q?._id}
                        onClick={handleEdit}
                        className="edit-button"
                      >
                        {editOpen ? "Cancel" : "Edit"}
                        
                      </button>
                      <button
                        id={index}
                        value={q?._id}
                        onClick={handleDelete}
                        className="delete-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          style={{ width: "21px", height: "27px" }}
                        >
                          <path
                            fillRule="evenodd" 
                            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No questions found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="form-buttons">
            <button onClick={goBack} className="save-button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}