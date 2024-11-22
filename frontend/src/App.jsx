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
  const [token, setToken] = React.useState(null);


  React.useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    console.log("Stored Token:", storedToken);
    if (!storedToken && !location.pathname.startsWith("/interviewpage")) {
      navigate("/");
    } else {
      setToken(storedToken);
    }
  }, [location.pathname, navigate]);
  

  return (
    <>
      {/* Sadece giriş sayfası dışında Header göster */}
      {location.pathname !== "/" && !location.pathname.startsWith("/interviewpage") && <Header />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/adminhomepage" element={token ? <AdminHomePage /> : <LoginPage />} />
        <Route path="/videocollection/:id" element={token ? <VideoCollection /> : <LoginPage />} />
        <Route path="/interviewvideo/:id/:val" element={token ? <InterviewVideo /> : <LoginPage />} />
        <Route path="/packagelist" element={token ? <PackageList /> : <LoginPage />} />
        <Route path="/packagequestions/:id" element={token ? <PackageQuestionList /> : <LoginPage />} />
        <Route path="/interviewdetail/:id" element={token ? <InterviewQuestions /> : <LoginPage />} />
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
