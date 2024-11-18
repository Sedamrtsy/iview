import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function AddPackage({ isModalOpen, onClose }) {
  const [packageName, setPackageName] = useState(""); // Paket adı için state
  const [loading, setLoading] = useState(false); // Yüklenme durumunu takip ediyoruz
  const [error, setError] = useState(null); // Hata yönetimi için state

  const nav = useNavigate();

  const handlePackageNameChange = (e) => {
    setPackageName(e.target.value); // Paket adı değiştikçe state'i güncelliyoruz
  };

  const handleSubmit = () => {
    setLoading(true); // Yükleme durumunu başlatıyoruz
    const token = sessionStorage.getItem("token");
    // Backend'e POST isteği yapıyoruz
    fetch("https://iview.onrender.com/api/createpackage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`
      },
      body: JSON.stringify({
        name: packageName,
        question: [] // Question dizisini boş bir dizi olarak gönderiyoruz
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Paket oluşturulurken hata oluştu");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Paket başarıyla oluşturuldu:", data);
        setLoading(false); // Yükleme tamamlandı
        setPackageName(""); // Formu temizle
        onClose(); // Modalı kapat
        nav("/packagequestions"); // Başarılı olursa yönlendirme yap
      })
      .catch((error) => {
        console.error("Paket oluşturulurken hata oluştu:", error); // Hata mesajını daha detaylı yazdır
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal" onClick={onClose}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Modal dışına tıklanınca kapanır
          >
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <h3>Question Package Name: </h3>
            <br />
            <input
              className="question-packagename-text"
              value={packageName}
              onChange={handlePackageNameChange} // Paket adı girişini izliyoruz
            />
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading} // Yüklenirken butonu devre dışı bırak
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Hata mesajı */}
          </div>
        </div>
      )}
    </div>
  );
}
