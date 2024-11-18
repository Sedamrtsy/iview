import * as React from "react";
import "../App.css";
import ToggleSwitch from "./ToggleSwitch";
import useAPI from "../store/storeAPI";
import { useNavigate } from "react-router-dom";

export default function CreatInterview({ isModalOpen, onClose }) {
  const nav = useNavigate();
  const { loading, error, fetchData, setData } = useAPI();
  const [title, setTitle] = React.useState("");
  //const [pack, setPack] = React.useState([]);
  const [selectedPack, setSelectedPack] = React.useState("");
  const [skip, setSkip] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  /*const handlePackages = (e) => {
    setSelectedPack(e.target.value);
  };*/

  const handleSkip = (value) => {
    setSkip(value);
  };

  const handleShow = (value) => {
    setShow(value);
  };

  /*
  React.useState(() => {
    const fetchPakages = async () => {
      const link = "/getpackage";
      const order = "GET";
      const data = await fetchData(link, order);
      setPack(data);
    };
    fetchPakages();
  }, []);
  */

  const submitButton = async () => {
    const link = "/creatinterview";
    const order = "POST";
    const bodyInterview = {
      title_name: title,
      package: selectedPack,
      can_skip: skip,
      showing: show,
    };
    setData(link, order, bodyInterview);
    nav(0);
    onClose();
  };
  return (
    <>
      {isModalOpen && (
        <div className="modal" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={onClose}>
              &times;
            </span>
            {error && <h3>{error}</h3>}
            {loading && <h3>Loading...</h3>}
            <br />
            <h3>Title:</h3>
            <input
              value={title}
              onChange={handleTitle}
              className="create-text-field"
            ></input>
            {/*<h3>Package:</h3>
            <select
              type="select"
              onChange={handlePackages}
              className="create-text-field"
            >
              <option></option>
              {pack !== null ? (
                pack.map((pck, index) => (
                  <option key={index} value={pck._id}>
                    {pck.name}
                  </option>
                ))
              ) : (
                <div />
              )}
            </select>*/}
            <div className="form-group">
              <br />
              <ToggleSwitch
                onChange={handleSkip}
                value={skip}
                label="Can Skip"
              />
              <br />
              <ToggleSwitch
                onChange={handleShow}
                value={show}
                label="Show At Once"
              />
            </div>
            <button className="modal-submit-button" onClick={submitButton}>
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
}
