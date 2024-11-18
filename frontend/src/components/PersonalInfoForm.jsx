import * as React from "react";
import "../App.css";
import useAPI from "../store/storeAPI";
import { useNavigate } from "react-router-dom";

export default function PersonalInfoForm({
  handleCandi,
  isModalOpen,
  onClose,
  interid
}) {
  const nav = useNavigate();
  const {fetchData, setData } = useAPI();
  const [interview,setInterview] = React.useState({});
  const [candidatesEmails, setCandidatesEmails] = React.useState([]);
  const [candidatesPhones, setCandidatesPhones] = React.useState([]);
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isChecked, setIsChecked] = React.useState(false);

  const getAllCandidates = async () => {
    try {
      const interData = await fetchData(`getinterviewbyid/${interid}`, "GET");
      if(interData){
        setInterview(interData)
      }
      if (interData?.candidates !== null && interData?.candidates?.length > 0) {
        var candis = [];
        for (let i of interData.candidates) {
          const candiData = await fetchData(`getcandidatebyid/${i}`, "GET");
          candis.push(candiData);
        }
        var candismails = [];
        var candisphones = [];
        for (let j of candis) {
          candismails.push(j.email);
          candisphones.push(j.phone_number);
        }
        setCandidatesEmails(candismails);
        setCandidatesPhones(candisphones);
      }
    } catch (err) {
      console.error("Hatalı işlem", err.message);
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleSurname = (e) => {
    setSurname(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const checkValues = async () => {
    if (phone?.length < 10 || phone[0] === "0" || phone?.length > 10) {
      alert(
        "numaranızı başında sıfır olmadan giriniz. + ve ülke kodu kullanmayınız."
      );
      return false;
    }
    if (email?.length < 7) {
      alert("geçerli bir email giriniz.");
      return false;
    }
    if (name?.length <= 2) {
      alert("İsim boş geçilemez");
      return false;
    }
    if (surname?.length <= 2) {
      alert("Soyisim kısmı boş geçilemez");
      return false;
    }
    var acandi = {
      name: name,
      surname: surname,
      email: email,
      phone_number: phone,
      interview: interid,
    };

    if (
      candidatesEmails.includes(acandi.email) ||
      candidatesPhones.includes(acandi.phone_number)
    ) {
      alert("Mülakat kaydınız alınmıştır.");
      //nav(-1);
      return false;
    }
    if(isChecked){
      return true;
    }else if(!isChecked){
      alert("You must accept the terms and conditions.");
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    const loadPageAndCheck = async () => {
      await getAllCandidates();
      console.log(interview)
      if(!interview.activate){
        //nav(-1);
      }
    };
    loadPageAndCheck();
  }, []);

  const handleSave = async () => {
    const check = checkValues();
    if (check) {
      var acandi = {
        name: name,
        surname: surname,
        email: email,
        phone_number: phone,
        interview: interid,
      };
      const candi = await setData("createcandidates", "POST", acandi);
      var newArr = [...interview.candidates]
      newArr.push(candi._id);
      const newBody = {candidates : newArr}
      await setData(`patchinterview/${interid}`, "PATCH", newBody);
      handleCandi(candi);
      onClose()
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3 style={{ color: "#38817c" }}>Please Enter Your Personal Information</h3>
            <div className="form-container">
              <h5 className="interview-text-input">Name:</h5>
              <input
                placeholder="required*"
                onChange={handleName}
                className="interview-text-field"
              />
              <h5 className="interview-text-input">Surname:</h5>
              <input
                placeholder="required*"
                onChange={handleSurname}
                className="interview-text-field"
              />
              <h5 className="interview-text-input">Email:</h5>
              <input
                placeholder="required*"
                onChange={handleEmail}
                className="interview-text-field"
              />
              <h5 className="interview-text-input">Phone:</h5>
              <input
                placeholder="required* sıfır kullanmayınız. Örnek: 5554443322"
                onChange={handlePhone}
                className="interview-text-field"
              />
            </div>
            <div className="chekbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                Accept terms and conditions
              </label>
            </div>

            <br />
            <button className="modal-submit-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
