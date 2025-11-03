import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://verifyai-1.onrender.com/api/detect";
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    message: "",
    percentage: 0,
    state: "idle",
    fileName: "",
  });

  const fileInputRef = useRef(null);

  const ChooseFile = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({
        message: `File selected: ${file.name}`,
        percentage: 0,
        state: "selected",
        fileName: file.name,
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploadStatus({
      message: "Uploading and Verifying...",
      percentage: 5,
      state: "uploading",
      fileName: selectedFile.name,
    });

    try {
      const response = await axios.post(API_URL, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true, // ✅ send cookies (JWT)
  onUploadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / e.total);
    setUploadStatus((prev) => ({
      ...prev,
      percentage: percent > 5 ? percent : 5,
    }));
  },
});


      const data = response.data;
      setUploadStatus({
        message: `Verification Complete!`,
        percentage: 100,
        state: "complete",
        fileName: selectedFile.name,
      });
      navigate("/VR", {
        state: {
          verificationResult: data,
          uploadedFileName: data.fileName || data.name || selectedFile.name,
        },
      });
      setSelectedFile(null);
      fileInputRef.current.value = null;
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Upload failed.";
      setUploadStatus({
        message: `Error: ${errMsg}`,
        percentage: 100,
        state: "error",
        fileName: selectedFile.name,
      });
    }
  };

  const isProgressVisible = uploadStatus.state !== "idle";
  const isUploading = uploadStatus.state === "uploading";
  const isError = uploadStatus.state === "error";
  const isComplete = uploadStatus.state === "complete";

  const statusColor = isError
    ? "text-red-500"
    : isComplete
    ? "text-green-600"
    : "text-[#1173d4]";
  const progressBarColor = isError
    ? "bg-red-500"
    : isComplete
    ? "bg-green-600"
    : "bg-[#1173d4]";

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f6f7f8] font-display text-[#111418]">
      {/* Hidden Input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#dbe0e6] px-8 py-4 bg-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-4 text-[#1173d4]">
          <div className="size-8">
            <svg className="size-full fill-[#1173d4]" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93l-4.5-4.5 1.41-1.41L11 15.11l7.07-7.07 1.41 1.41-8.48 8.48z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold">VerifyAI</h2>
        </div>

        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-6">
            <a href="/Dash" className="text-[#1173d4] font-bold border-b-2 border-[#1173d4] pb-1">
              Dashboard
            </a>
            <a href="/hist" className="text-[#617589] hover:text-[#1173d4]">
              History
            </a>
            <a href="#" className="text-[#617589] hover:text-[#1173d4]">
              Upload
            </a>
          </nav>
          <button className="bg-[#1173d4] hover:bg-[#0e5eb3] text-white font-bold px-4 py-2 rounded-lg transition" onClick={()=>{navigate("/")}}>
            Logout
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
            style={{
              backgroundImage: 'url("https://placehold.co/100x100/1173d4/ffffff?text=U")',
            }}
          ></div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col flex-1 items-center justify-center px-8 py-12">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-extrabold text-[#1173d4] mb-4">
            Verify the Authenticity of Your Files
          </h1>
          <p className="text-[#617589] text-lg mb-12">
            Upload your text, document, image, or video to verify its authenticity.
          </p>

          <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dbe0e6] px-10 py-14 bg-white w-full max-w-3xl">
            <p className="text-lg font-bold text-[#111418]">
              {selectedFile ? `Ready to Verify: ${selectedFile.name}` : "Drag and drop your files here"}
            </p>
            <p className="text-sm text-[#617589]">
              Supported file types: TXT, DOCX, PDF, JPG, PNG, MP4, MOV
            </p>

            <div className="flex gap-4">
              <button
                onClick={ChooseFile}
                className="mt-6 px-6 py-2 bg-[#1173d4] hover:bg-[#0e5eb3] text-white font-bold rounded-lg transition"
                disabled={isUploading}
              >
                Select Files
              </button>
              {selectedFile && (
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className={`mt-6 px-6 py-2 font-bold rounded-lg transition ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isUploading ? "Verifying..." : "Submit for Verification"}
                </button>
              )}
            </div>
          </div>

          {isProgressVisible && (
            <div className="mt-10 w-full max-w-3xl flex flex-col gap-2 p-4 rounded-lg bg-white shadow-md">
              <div className="flex justify-between">
                <span className={`font-semibold ${statusColor}`}>
                  {uploadStatus.fileName}
                </span>
                <span className={`text-sm ${statusColor}`}>
                  {uploadStatus.percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 ${progressBarColor} rounded-full transition-all duration-500`}
                  style={{ width: `${uploadStatus.percentage}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${statusColor}`}>{uploadStatus.message}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 text-center border-t border-[#dbe0e6] bg-white">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <a className="text-[#617589] text-sm hover:text-[#1173d4]" href="#">Terms</a>
          <a className="text-[#617589] text-sm hover:text-[#1173d4]" href="#">Privacy</a>
          <a className="text-[#617589] text-sm hover:text-[#1173d4]" href="#">Contact</a>
        </div>
        <p className="text-[#617589] text-sm">© 2025 VerifyAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
