import * as React from "react";
import "../../App.css";
//import AdminDrawer from "../../components/AdminDrawer";
import QuestionList from "../../components/QuestionList";
import { useNavigate } from "react-router-dom";
import CreateInterview from "../../components/CreateInterview"; // Typo düzeltildi
import SeeLink from "../../components/SeeLink";
import useAPI from "../../store/storeAPI";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function AdminHomePage() {
  const { fetchData } = useAPI();
  const [sentlink, setLink] = React.useState("");
  const [listOpen, setListOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [packages, setPackages] = React.useState([]);

  const nav = useNavigate(); // useNavigate tanımlamasını yukarı aldık.

  const handleDetail = (e) => {
    const link = e.target.value;
    nav(`/interviewdetail/${link}`);
  };

  const seeVideos = (e) => {
    const link = e.target.value;
    if (!link) {
      console.error("Link değeri geçerli değil."); // Hata kontrolü
      return;
    }
    nav(`/videocollection/${link}`);
  };
  
  const handleDelete = async (e) => {
    const takenid = e.target.value;
  
    console.log("Silinecek mülakat ID'si:", takenid); // Bu satır eklenerek ID kontrol edilebilir
  
    if (!takenid) {
      console.error("Mülakat ID'si tanımsız.");
      alert("Geçerli bir mülakat ID'si yok.");
      return;
    }
  
    try {
      const interData = await fetchData(`getinterviewbyid/${takenid}`, "GET");
      if (interData.candidates.length > 0) {
        alert("Bu mülakatı silemezsiniz.");
        return;
      }
  
      const deleteResponse = await fetchData(`deleteinterview/${takenid}`, "DELETE");
      if (deleteResponse.success) {
        setPackages((prevPackages) => prevPackages.filter((pack) => pack._id !== takenid));
        alert("Mülakat başarıyla silindi.");
      } else {
        throw new Error("Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Mülakat silinemedi:", error);
      alert("Bir hata oluştu, mülakat silinemedi.");
    }
  };
  
  

  const handleLinkOpen = async (e) => {
    const link = e.target.value;
    const interview = await fetchData(`getinterviewbyid/${link}`, "GET");
    if (interview.activate === false) {
      alert("Bu mülakatın linki paylaşılamaz");
      return;
    }
    const sendLink = `https://iview.onrender.com/interviewpage/${link}`;
    setLink(sendLink);
    setLinkOpen(true);
  };

  const handleLinkClose = () => {
    setLinkOpen(false);
  };

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleListClose = () => {
    setListOpen(false);
  };

  React.useEffect(() => {
    const fetchPackages = async () => {
      const link = "getinterview";
      const order = "GET";
      const data = await fetchData(link, order);
      setPackages(data);
    };
    fetchPackages();
    if (packages === null) {
      nav(0);
    }
  }, [fetchData]); // fetchData bağımlılığı eklendi.

  // const Card = ({ stat, title, total, holdon, value }) => (
  //   <div className={`card ${stat ? "active" : "inactive"}`}>
  //     <button value={value} onClick={handleDetail} className="card-info-button">
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         viewBox="0 0 16 16"
  //         fill="currentColor"
  //         className="size-1"
  //       >
  //         <path
  //           fillRule="evenodd"
  //           d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //       Detail
  //     </button>
  //     <button
  //       value={value}
  //       onClick={handleLinkOpen}
  //       className="card-link-button"
  //     >
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         viewBox="0 0 16 16"
  //         fill="currentColor"
  //         className="size-1"
  //       >
  //         <path
  //           fillRule="evenodd"
  //           d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z"
  //           clipRule="evenodd"
  //         />
  //         <path
  //           fillRule="evenodd"
  //           d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //       See Link

  //     </button>
  //     <button
  //       value={value}
  //       onClick={handleDelete}
  //       className="card-delete-button"
  //     >
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         viewBox="0 0 16 16"
  //         fill="currentColor"
  //         className="size-1"
  //       >
  //         <path
  //           fillRule="evenodd"
  //           d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     </button>
  //     <h2 className="card-title">{title}</h2>
  //     <div style={{ position: "relative", top: "-25px" }}> {/* Tüm kısmı yukarı alacak div */}
  //       <h4 style={{ textAlign: "left", marginLeft: "-8px",  position: "relative", top: "35px" }}>Candidates:</h4>
  //       <div className={`block ${stat ? "active-block" : "inactive-block"}`} style={{ width: "220px", height: "40px", display: "flex", justifyContent: "flex-start", alignItems: "center", margin: "40px auto 0", marginLeft: "-10px", flexDirection: "row",  color: "white" }} >
  //         <p style={{ marginRight: "50px" }} >Total: {total}</p>
  //         <p>Hold-on: {holdon}</p>
  //       </div>
  //       <div>
  //     <h6 className={`status-text ${stat ? "active-text" : "inactive-text"}`} style={{ marginBottom: "0px", marginLeft: "-140px", position: "relative", top: "30px" }}>
  //       {stat ? "Active" : "Inactive"}
  //     </h6>
  //     </div>
  //     <button 
  //       value={value} 
  //       onClick={seeVideos} 
  //       style={{
  //         display: 'flex', // Flexbox ile içeriği ortalamak için
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         paddingLeft: '10px',
  //         fontFamily: 'Montserrat',
  //         minWidth: '150px',
  //         height: '40px',
  //         backgroundColor: 'white',
  //         border: '3px solid gray', // Çerçeve
  //         borderRadius: '5px',
  //         cursor: 'pointer'
  //       }}
  //     >
  //       See Videos
  //     </button>



  //     </div>
  //   </div>
  // );

  const Card = ({ stat, title, total, holdon, value }) => (
    <div className={`card ${stat ? "active" : "inactive"}`}>
      
      <button value={value} onClick={handleDetail} className="card-info-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-1"
        >
          <path
            fillRule="evenodd"
            d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
            clipRule="evenodd"
          />
        </svg>
        Detail
      </button>
      
      <button value={value} onClick={handleLinkOpen} className="card-link-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-1"
        >
          <path
            fillRule="evenodd"
            d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z"
            clipRule="evenodd"
          />
        </svg>
        See Link
      </button>
      
      <button value={value} onClick={handleDelete} className="card-delete-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-1"
        >
          <path
            fillRule="evenodd"
            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      <h2 className="card-title">{title}</h2>
      
      <div style={{ position: "relative", top: "-25px" }}> {/* Tüm kısmı yukarı alacak div */}
        <h4 style={{ textAlign: "left", marginLeft: "-8px", position: "relative", top: "35px" }}>
          Candidates:
        </h4>
        
        <div 
          className={`block ${stat ? "active-block" : "inactive-block"}`} 
          style={{ 
            width: "220px", 
            height: "40px", 
            display: "flex", 
            justifyContent: "flex-start", 
            alignItems: "center", 
            margin: "40px auto 0", 
            marginLeft: "-10px", 
            flexDirection: "row", 
            color: "white" 
          }}
        >
          <p style={{ marginRight: "50px" }}>Total: {total}</p>
          <p>Hold-on: {holdon}</p>
        </div>
        <div>
          <h6
            style={{
              color: stat ? '#66be43' : '#f85555', // Active veya Inactive renk
              fontSize: '1.2em', // Yazı boyutu
              marginTop: '5px', // Üst boşluk
              marginBottom: '-20px', 
              marginLeft: '-7px',
              position: 'relative',
              width: '62px', // Genişlik
              top: '30px',
            }}
          >
            {stat ? "Active" : "Inactive"}
          </h6>
        </div>


      </div>
      <button 
  value={value} 
  onClick={seeVideos} 
  style={{   
    color: '#4B5563', // Tailwind'in `text-gray-600` rengi
    transition: 'color 0.2s ease-in-out', // Tailwind'in `transition duration-200`
    marginLeft: '119px', // Butonu sağa kaydırmak için sol boşluk
    marginTop: '-20px', // Konumu yukarı taşır
    cursor: 'pointer',
    backgroundColor: 'transparent', // Arka planı tamamen kaldırır
    border: 'none', // Kutu görünümünü kaldırır
    fontWeight: 'bold' // Yazıyı kalın yapar
  }}
 >
  See Videos <span className="text-sm ">&gt;</span>
</button>


      
    </div>
  );
  
  return (
    <div>
      {/*<AdminDrawer />*/}

      <div /*className="adminDrawerOpen"*/ className="adminpage">
        <QuestionList isModalOpen={listOpen} onClose={handleListClose} />
        <CreateInterview isModalOpen={createOpen} onClose={handleCreateClose} />
        <SeeLink
          isModalOpen={linkOpen}
          onClose={handleLinkClose}
          viewLink={sentlink}
        />
        <button onClick={handleCreateOpen} className="add-button">
           <svg
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             strokeWidth={1.5}
             stroke="currentColor"
             className="size-3"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M12 4.5v15m7.5-7.5h-15"
             />
           </svg>
         </button>
        <div className="grid-container">
          {packages !== null ? (
            packages.map((pack) => (
              <Card
                value={pack._id}
                key={pack._id} // Düzeltildi
                stat={pack.activate}
                title={pack.title_name}
                total={pack?.candidates?.length || "0"}
                holdon={pack?.videos?.length || "0"}
              />
            ))
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}


// import * as React from "react";
// import "../../App.css";
// //import AdminDrawer from "../../components/AdminDrawer";
// import QuestionList from "../../components/QuestionList";
// import { useNavigate } from "react-router-dom";
// import CreateInterview from "../../components/CreateInterview"; // Typo düzeltildi
// import SeeLink from "../../components/SeeLink";
// import useAPI from "../../store/storeAPI";

// export default function AdminHomePage() {
//   const { fetchData } = useAPI();
//   const [sentlink, setLink] = React.useState("");
//   const [listOpen, setListOpen] = React.useState(false);
//   const [createOpen, setCreateOpen] = React.useState(false);
//   const [linkOpen, setLinkOpen] = React.useState(false);
//   const [packages, setPackages] = React.useState([]);

//   const nav = useNavigate(); // useNavigate tanımlamasını yukarı aldık.

//   const handleDetail = (e) => {
//     const link = e.target.value;
//     nav(`/interviewdetail/${link}`);
//   };

//   const seeVideos = (e) => {
//     const link = e.target.value;
//     nav(`/videocollection/${link}`);
//   };

//   const handleDelete = async (e) => {
//     const takenid = e.target.value;
//     const interData = await fetchData(`getinterviewbyid/${takenid}`, "GET");
//     if (interData.candidates.length > 0) {
//       alert("Bu mülakatı silemezsiniz.");
//       return;
//     }
//     await fetchData(`deleteinterview/${takenid}`, "DELETE"); // Silme işlemi asenkron hale getirildi.
//     //setPackages(packages.filter((pack) => pack._id !== takenid)); // Silinen paketi state'den çıkar.
//   };

//   const handleLinkOpen = async (e) => {
//     const link = e.target.value;
//     const interview = await fetchData(`getinterviewbyid/${link}`, "GET");
//     if (interview.activate === false) {
//       alert("Bu mülakatın linki paylaşılamaz");
//       return;
//     }
//     const sendLink = `http://localhost:5173/interviewpage/${link}`;
//     setLink(sendLink);
//     setLinkOpen(true);
//   };

//   const handleLinkClose = () => {
//     setLinkOpen(false);
//   };

//   const handleCreateOpen = () => {
//     setCreateOpen(true);
//   };

//   const handleCreateClose = () => {
//     setCreateOpen(false);
//   };

//   const handleListClose = () => {
//     setListOpen(false);
//   };

//   React.useEffect(() => {
//     const fetchPackages = async () => {
//       const link = "getinterview";
//       const order = "GET";
//       const data = await fetchData(link, order);
//       setPackages(data);
//     };
//     fetchPackages();
//     if (packages === null) {
//       nav(0);
//     }
//   },[]);

//   const Card = ({ stat, title, total, holdon, value }) => (
//     <div className={`card ${stat ? "active" : "inactive"}`}>
//       <button value={value} onClick={handleDetail} className="card-info-button">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 16 16"
//           fill="currentColor"
//           className="size-1"
//         >
//           <path
//             fillRule="evenodd"
//             d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
//             clipRule="evenodd"
//           />
//         </svg>
//         Detail
//       </button>
//       <button
//         value={value}
//         onClick={handleLinkOpen}
//         className="card-link-button"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 16 16"
//           fill="currentColor"
//           className="size-1"
//         >
//           <path
//             fillRule="evenodd"
//             d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z"
//             clipRule="evenodd"
//           />
//           <path
//             fillRule="evenodd"
//             d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z"
//             clipRule="evenodd"
//           />
//         </svg>
//         See Link
//       </button>
//       <button
//         value={value}
//         onClick={handleDelete}
//         className="card-delete-button"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 16 16"
//           fill="currentColor"
//           className="size-1"
//         >
//           <path
//             fillRule="evenodd"
//             d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
//             clipRule="evenodd"
//           />
//         </svg>
//         Delete
//       </button>
//       <h2 className="card-title">{title}</h2>
//       <h4 style={{ textAlign: "left", marginLeft: "22px" }}>Candidates:</h4>
//       <div className={`block ${stat ? "active-block" : "inactive-block"}`}>
//         <p>Total: {total}</p>
//         <p>Hold-on: {holdon}</p>
//       </div>
//       <div>
//       <h6 className={`status-text ${stat ? "active-text" : "inactive-text"}`} style={{ marginBottom: "0px" }}>
//         {stat ? "Active" : "Inactive"}
//       </h6>
//         <button value={value} onClick={seeVideos} className="card-button">
//           See Videos →
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div>
//       {/*<AdminDrawer />*/}
//       <div /*className="adminDrawerOpen"*/ className="adminpage">
//         <QuestionList isModalOpen={listOpen} onClose={handleListClose} />
//         <CreateInterview isModalOpen={createOpen} onClose={handleCreateClose} />
//         <SeeLink
//           isModalOpen={linkOpen}
//           onClose={handleLinkClose}
//           viewLink={sentlink}
//         />
//         <button style={{backgroundColor: "#c0c9c0"}} onClick={handleCreateOpen} className="add-button">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="size-3"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M12 4.5v15m7.5-7.5h-15"
//             />
//           </svg>
//         </button>
//         <div className="grid-container">
//           {packages !== null ? (
//             packages.map((pack) => (
//               <Card
//                 value={pack._id}
//                 key={pack._id} // Düzeltildi
//                 stat={pack.activate}
//                 title={pack.title_name}
//                 total={pack?.candidates?.length || "0"}
//                 holdon={pack?.videos?.length || "0"}
//               />
//             ))
//           ) : (
//             <div />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }