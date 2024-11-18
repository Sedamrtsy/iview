import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";

const VideoRecorder = forwardRef(({ handleURL, email }, ref) => {
  const [recording, setRecording] = useState(false); // Kayıt durumu
  const [videoURL, setVideoURL] = useState(null); // Video URL'si
  const [uploading, setUploading] = useState(false); // Yükleme durumu
  const [error, setError] = useState(null); // Hata durumu

  const mediaRecorderRef = useRef(null); // MediaRecorder referansı
  const videoRef = useRef(null); // Video elementine referans
  const recordedChunks = useRef([]); // Kaydedilen video parçalarını tutar

  useEffect(() => {
    // Kullanıcının kamerasına erişim sağla
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Video akışını video elementine bağla
        }

        const mediaRecorder = new MediaRecorder(stream); // MediaRecorder oluştur
        mediaRecorderRef.current = mediaRecorder;

        // MediaRecorder ile veri toplama
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.current.push(event.data); // Parçaları kaydet
          }
        };

        // Kayıt durdurulunca video oluşturma
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setVideoURL(url); // Video URL'sini güncelle
          recordedChunks.current = []; // Parçaları temizle
          uploadVideo(blob); // Videoyu backend'e yükle
        };
      } catch (err) {
        console.error("Kamera erişimi reddedildi:", err);
        setError("Kamera ve mikrofon erişimi reddedildi.");
      }
    };

    getMedia(); // Kamera ve mikrofon erişimini başlat
  }, []);

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecordingAndUpload,
  }));

  // Kayıt başlatma
  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  // Kayıt durdurma ve yükleme
  const stopRecordingAndUpload = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Video yükleme
  const uploadVideo = async (blob) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("video", blob, "recording.webm");
    formData.append("email", email.trim());

    try {
      const response = await axios.post(
        "https://iview.onrender.com/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("response",response.data.url);
      console.log("Video Yüklendi:", response.data.url);
      alert(`Video Yüklendi! URL: ${response.data.url}`);
      handleURL(response.data.url);
      // handleURL(`${response.data.url}`)
      setVideoURL(response.data.url); // URL'yi güncelle
    } catch (error) {
      console.error("Video yükleme hatası:", error);
      setError("Video yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div>
       {/* <h2 style={{ marginTop: "-140px" }}>Video Kaydedici</h2>   */}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "529px", marginBottom: "34px", marginTop:"-390px", marginLeft: "-250px", borderRadius:"10px" }}
      />
      {/* <div style={{ marginBottom: "-280px" }}>
        {recording ? (
          <button onClick={stopRecordingAndUpload}></button>
        ) : (
          <button onClick={startRecording}></button>
        )}
      </div> */}

      {uploading && (
        <p style={{ 
          position: "fixed", 
          top: "10px", 
          right: "10px", 
          color: "white", 
          padding: "10px", 
          borderRadius: "5px", 
          zIndex: 1000 
        }}>
          Video yükleniyor...
        </p>
      )}
      {videoURL && (
        <div >
        </div>
      )}
    </div>
  );
});

export default VideoRecorder;