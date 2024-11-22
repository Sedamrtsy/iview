import * as React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/admin/LoginPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import Header from "./components/Header";
import VideoCollection from "./pages/admin/VideoCollection";
import InterviewVideo from "./pages/admin/InterviewVideo";
import PackageList from "./pages/admin/PackageList";
import PackageQuestionList from "./pages/admin/PackageQuestionList";
import InterviewPage from "./pages/user/InterwiewPage";
import InterviewQuestions from "./pages/admin/InterviewQuestions";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Token'ı sessionStorage'dan almak yerine login sayfasında olup olmadığını kontrol ediyoruz.
  //   const storedToken = sessionStorage.getItem("token");
  //   console.log("Stored Token:", storedToken);
  //   if (!storedToken && !location.pathname.startsWith("/interviewpage")) {
  //     navigate("/");
  //   }
  // }, [location.pathname, navigate]);

    // Kullanıcının oturum açıp açmadığını kontrol et
    // Eğer login değilse ve "/interviewpage" dışında bir sayfa açmak isterse, login sayfasına yönlendir
    if (!document.cookie.includes("token") && !location.pathname.startsWith("/interviewpage")) {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {/* Sadece giriş sayfası dışında Header göster */}
      {location.pathname !== "/" && !location.pathname.startsWith("/interviewpage") && <Header />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/adminhomepage" element={<AdminHomePage />} />
        <Route path="/videocollection/:id" element={<VideoCollection />} />
        <Route path="/interviewvideo/:id/:val" element={<InterviewVideo />} />
        <Route path="/packagelist" element={<PackageList />} />
        <Route path="/packagequestions/:id" element={<PackageQuestionList />} />
        <Route path="/interviewdetail/:id" element={<InterviewQuestions />} />
        <Route path="/interviewpage/:id" element={<InterviewPage />} />
      </Routes>
    </>
  );
}

function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default RootApp;
