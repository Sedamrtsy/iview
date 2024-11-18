import * as React from "react";
import "../App.css";
import useAPI from "../store/storeAPI";
import { useNavigate, useParams } from "react-router-dom";

export default function PackageChange({
  isModalOpen,
  onClose,
  value,
  interview,
}) {
  const nav = useNavigate();
  const { error, loading, setData, fetchData } = useAPI();

  const [packs, setPacks] = React.useState([]);
  const [currentPack, setCurrentPack] = React.useState({});
  const [sellectInterview, setSellectInterview] = React.useState("");

  const addQuestion = async () => {
    const newBody = { package: sellectInterview };
    await setData(`patchinterview/${interview}`, "PATCH", newBody);
    nav(0);
    onClose();
  };

  const handlePack = async (e) => {
    const val = e.target.value;
    setSellectInterview(val)
  };

  const fetchPackages = async () => {
    const data = await fetchData("getpackage", "GET");
    if (data) {
      setPacks(data);
    }
  };
  const fetchCurrentPack = async () => {
    if (!value) return;
    const data = await fetchData(`getpackagebyid/${value}`, "GET");
    if (data) {
      setCurrentPack(data);
    }
  };

  React.useEffect(() => {
    const loadComp = async () => {
      fetchPackages();
      fetchCurrentPack();
    };
    loadComp();
  }, [value]);

  return (
    <>
      {error && <h3>{error}</h3>}
      {loading && <h3>Loading...</h3>}
      {isModalOpen && (
        <div>
          <h3>Şu anki Paket: {currentPack.name}</h3>
          <h5>Paket Değiştir:</h5>
          <select className=" " onChange={handlePack}>
            {packs.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="modal-submit-button" onClick={addQuestion}>
            SAVE
          </button>
        </div>
      )}
    </>
  );
}
