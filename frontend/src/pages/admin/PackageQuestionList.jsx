import * as React from "react";
import "../../App.css";
import AdminDrawer from "../../components/AdminDrawer";
import { useNavigate } from "react-router-dom";
import AddQuestion from "../../components/AddQuestion";
import EditQuestion from "../../components/EditQuestion";
import { useParams } from "react-router-dom";
import useAPI from "../../store/storeAPI";

export default function PackageQuestionList() {
  const { error, loading, fetchData, setData } = useAPI();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editID, setEditID] = React.useState("");
  const { id } = useParams();
  const [questionOpen, setIsOpen] = React.useState(false);
  const [pack, setPackage] = React.useState({});
  const [question, setQuestion] = React.useState([]);

  const handleEdit = (e) => {
    const edit = e.target.value;
    setEditID(edit);
    setEditOpen(true);  // Düzenleme modal'ını açıyoruz
  };

  React.useEffect(() => {
    if (id === undefined) {
      nav(0);
    }
    const getPackage = async () => {
      try {
        const link = `getpackagebyid/${id}`;
        const order = "GET";
        const data = await fetchData(link, order);
        setPackage(data);

        if (data?.question?.length > 0) {
          const questionsData = await Promise.all(
            data.question.map(async (questId) => {
              const questLink = `getquestionbyid/${questId}`;
              const questData = await fetchData(questLink, order);
              return questData;
            })
          );
          setQuestion(questionsData); // Tüm sorular geldikten sonra tek seferde state güncellemesi
        }
      } catch (err) {
        console.error("Error fetching package or questions:", err);
      }
    };

    getPackage();
  }, [id, fetchData]);

  const handleAddquestion = async (e) => {
    const link = `updatepackage/${pack._id}`;
    const order = "PUT";
    const newBody = { question: [...pack.question, e] }; // Mevcut sorulara yenisini ekliyoruz
    const data = await setData(link, order, newBody);
    setPackage((prevPack) => ({
      ...prevPack,
      question: newBody.question, // package state'ini güncelliyoruz
    }));
    nav(0);
  };

  const handleDelete = async (e) => {
    const val = e.target.value;
    const index = parseInt(e.target.id, 10);
    const questions = [...pack.question]; // Orijinal diziyi bozmamak için kopyalıyoruz
    console.log(index)
    console.log(questions)
    questions.splice(index, 1);
    console.log(questions);

    const newBody = { question: questions };
    const link = `patchpackage/${id}`;
    const order = "PATCH";
    await setData(link, order, newBody);
    const dellink = `deletequestion/${val}`;
    await fetchData(dellink, "DELETE");
    const data = await fetchData(`getpackagebyid/${id}`, "GET");
    setPackage(data);
    setQuestion(data.question);
};

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleEditClose = () => setEditOpen(false);

  const nav = useNavigate();
  const goBack = () => nav(-1);

  return (
    <div>
      <AdminDrawer />
      <div className="adminDrawerOpen">
        {error && <h3>{error}</h3>}
        {loading && <h3>Loading...</h3>}
        <button className="back-button" onClick={goBack}>
          {" "}
          Back
        </button>
        <div className="question-table-container">
          <h3>{pack.name || "Package Name"}</h3>
          <button
            onClick={questionOpen ? handleClose : handleOpen}
            className="add-button2"
          >
            {questionOpen ? "Close" : "+Add"}
          </button>
          <AddQuestion
            isOpen={questionOpen}
            onClose={handleClose}
            onChange={handleAddquestion}
          />
          <EditQuestion isOpen={editOpen} onClose={handleEditClose} val={editID} />
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
              {question.map(
                (q, index) =>
                  q != null && (
                    <tr key={index}>
                      <td className="drag-handle">{index+1}</td>
                      <td>{q.question}</td>
                      <td>{q.timer}</td>
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
                          value={q._id}
                          onClick={handleDelete}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
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
