import React,{useRef} from "react";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";

// Theme colors (unchanged)
const themeColors = {
  authentic: { main: "text-secondary", bg: "bg-secondary" },
  caution: { main: "text-warning", bg: "bg-warning" },
  risk: { main: "text-critical", bg: "bg-critical" },
  primary: "text-primary",
};

// Helper for score status
const getScoreStatus = (score) => {
  if (score <= 70 ) {
    return {
      status: "Authentic",
      style: themeColors.authentic,
      message: "This document appears to be authentic with high confidence.",
    };
  } else if (score > 70 && score<=90) {
    return {
      status: "Caution",
      style: themeColors.caution,
      message:
        "Verification results show moderate risk or inconclusive data.",
    };
  } else {
    return {
      status: "High Risk",
      style: themeColors.risk,
      message:
        "This document shows significant signs of manipulation or AI generation.",
    };
  }
};

const getBarColor = (title, score) => {
  if (title === "Metadata Analysis" || title === "Linguistic Patterns") {
    return score <= 50 ? themeColors.authentic.bg : themeColors.risk.bg;
  }
  if (title === "Pixel Inconsistencies") {
    return score < 50 ? themeColors.authentic.bg : themeColors.risk.bg;
  }
  return themeColors.authentic.bg;
};

const VerificationResults = () => {
  const location = useLocation();
  const { verificationResult, uploadedFileName } = location.state || {};
  const reportRef = useRef(null); // Add this ref to wrap the report content

  // New function for clean PDF generation
const generatePDF = () => {
  if (!verificationResult) return;

  const {
    aiScore,
    deepfakeScore,
    fileType,
    fileSize,
    summary,
    detailedExplanation,
    metadataScore,
    linguisticScore,
    pixelInconsistencyScore,
  } = verificationResult;

  const aiPercentage = Math.round(aiScore || 0);
  const deepfakePercentage = Math.round(deepfakeScore || 0);

  const pdfContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h1 style="text-align: center; color: #1173d4;">VerifyAI Report</h1>
      <hr style="margin: 20px 0;"/>
      
      <h2 style="color: #10B981;">File Information</h2>
      <p><strong>File Name:</strong> ${uploadedFileName || "Unknown File"}</p>
      <p><strong>Type:</strong> ${fileType || "-"}</p>
      <p><strong>Size:</strong> ${fileSize || "-"}</p>
      <p><strong>Date Verified:</strong> ${new Date().toLocaleDateString()}</p>

      <h2 style="color: #EF4444; margin-top: 20px;">Overall AI Score</h2>
      <p><strong>AI Detection Score:</strong> ${aiPercentage}%</p>
      <p><strong>Deepfake Score:</strong> ${deepfakeScore}%</p>

      <h2 style="color: #F59E0B; margin-top: 20px;">Technical Analysis Scores</h2>
      <ul>
        <li><strong>Metadata Analysis:</strong> ${Math.round(metadataScore || 0)}%</li>
        <li><strong>Linguistic Patterns:</strong> ${Math.round(linguisticScore || 0)}%</li>
        <li><strong>Pixel Inconsistencies:</strong> ${Math.round(pixelInconsistencyScore || 0)}%</li>
      </ul>

      <h2 style="color: #1173d4; margin-top: 20px;">Summary</h2>
      <p>${summary || "No summary provided."}</p>

      <h2 style="color: #1173d4; margin-top: 20px;">Detailed Explanation</h2>
      <p>${detailedExplanation || "No detailed explanation provided."}</p>

      <hr style="margin: 20px 0;"/>
      <p style="text-align:center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} VerifyAI. All rights reserved.
      </p>
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `${uploadedFileName || "Verification_Report"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(pdfContent).save();
};

  const defaultFilePreview =
    "https://placehold.co/400x200/4F46E5/FFFFFF?text=File+Preview";

  if (!verificationResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light text-text-light">
        <p className="text-xl font-medium">
          No verification data found. Please go back to the
          <a href="/Dash" className="text-primary hover:underline ml-2">
            Dashboard
          </a>
          .
        </p>
      </div>
    );
  }

  const {
    aiScore,
    deepfakeScore,
    imageAnalysis,
    fileSize,
    fileType,
    source,
    summary,
    detailedExplanation,
    metadataScore,
    linguisticScore,
    pixelInconsistencyScore,
    analysisDetails: rawAnalysisDetails,
  } = verificationResult;

  const aiPercentage = Math.round(aiScore || 0);
  const deepfakePercentage = Math.round(deepfakeScore || 0);
  const overallStatus = getScoreStatus(aiPercentage);
  const mainAccentColor = overallStatus.style.main;
  const mainBgColor = overallStatus.style.bg;
  const fileDisplayName = uploadedFileName || "Unknown File";
  const previewImage = imageAnalysis || defaultFilePreview;

  const sourceAnalysisData = [
    { title: "Metadata Analysis", score: Math.round(metadataScore || 0) },
    { title: "Linguistic Patterns", score: Math.round(linguisticScore || 0) },
    { title: "Pixel Inconsistencies", score: Math.round(pixelInconsistencyScore || 0) },
  ];

  return (
    <div  className="flex flex-col min-h-screen bg-[#f8fafc] text-gray-800 font-display" >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          .font-display { font-family: 'Inter', sans-serif; }
          .text-primary { color: #1173d4; }
          .bg-primary { background-color: #1173d4; }
          .text-secondary { color: #10B981; }
          .bg-secondary { background-color: #10B981; }
          .text-warning { color: #F59E0B; }
          .bg-warning { background-color: #F59E0B; }
          .text-critical { color: #EF4444; }
          .bg-critical { background-color: #EF4444; }
        `}
      </style>

      {/* HEADER (Dashboard style) */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-8">
                            {/* Simple Checkmark/Verification Icon */}
                            <svg className="size-full fill-[#1173d4]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93l-4.5-4.5 1.41-1.41L11 15.11l7.07-7.07 1.41 1.41-8.48 8.48z"/>
                            </svg>
                        </div>
            <h1 className="text-2xl font-bold text-primary">VerifyAI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/Dash" className="text-sm font-medium hover:text-primary">
              Dashboard
            </a>
            <a href="/hist" className="text-sm font-medium hover:text-primary">
              History
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold text-sm">
              Upload
            </button>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD61ptKOMRhGNDeAF9UUqR2fZ04QxxmuHeoyNusVdkP2TUtamWxg4T3gJ2Y7dBGDBNks0VRUiD--5EWPCfM3DdFgAYHRIUG3QovoCTrtUqfY-gM6bpUOG_A7fZ3vc4GIFcQRpwfiFTUFgfE9s-JOcYmiFUlE3M0P2L3ly4A0ucjrjTynuogMknO3LVP23ikjg325QxefwB5NrR8lAGg3xqrLAFFoAidRm-ccMeoRCPk6S9XNt2xX78a_KtWK22nYyJ3UJWv35WyT9w"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT (unchanged logic) */}
      <main ref={reportRef} className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-primary">Dashboard</a>
            <span>/</span>
            <span className="font-semibold">{fileDisplayName}</span>
            <span>/</span>
            <span>Results</span>
          </div>

          {/* Page header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-primary">Verification Results</h1>
            <button className="flex items-center gap-2 px-5 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 font-semibold" onClick={generatePDF}>
              <span className="material-symbols-outlined">download</span>
              Download Report
            </button>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="flex flex-col gap-8">
              {/* File info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    description
                  </span>
                  <div>
                    <p className="font-semibold text-lg">{fileDisplayName}</p>
                    <p className="text-sm text-gray-500">
                      {fileType}, {fileSize}, Verified: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-lg border border-gray-200 bg-gray-100"
                  style={{
                    backgroundImage: `url("${previewImage}")`,
                    backgroundSize: imageAnalysis ? "cover" : "contain",
                  }}
                ></div>
              </div>

              {/* AI Score */}
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-semibold mb-4">Overall AI Score</h3>
                <div className="relative w-40 h-40 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className={mainAccentColor}
                      d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${aiPercentage}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${mainAccentColor}`}>
                      {aiPercentage}%
                    </span>
                    <span className={`text-sm ${mainAccentColor}`}>
                      {overallStatus.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {overallStatus.message}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">
                  Detailed Breakdown
                </h3>

                {/* Deepfake score */}
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">
                      Deepfake Score (Risk of AI Manipulation)
                    </h4>
                    <span
                      className={`font-bold text-sm ${
                        deepfakePercentage > 20
                          ? themeColors.risk.main
                          : themeColors.authentic.main
                      }`}
                    >
                      {deepfakePercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                    <div
                      className={`h-3 rounded-full ${
                        deepfakePercentage > 20
                          ? themeColors.risk.bg
                          : themeColors.authentic.bg
                      }`}
                      style={{ width: `${deepfakePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-primary mb-2">Summary</h4>
                  <p className="text-sm italic text-gray-700">
                    {summary || "No concise summary provided."}
                  </p>
                </div>

                {/* Source Analysis */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">
                    Technical Analysis Scores
                  </h4>
                  {sourceAnalysisData.map((item, idx) => {
                    const barColor = getBarColor(item.title, item.score);
                    const accentColor = barColor.replace("bg-", "text-");
                    return (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{item.title}</span>
                          <span className={`text-sm font-semibold ${accentColor}`}>
                            {item.score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className={`${barColor} h-3 rounded-full`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Explanation */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Detailed Explanation
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {detailedExplanation || "No detailed explanation provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER (Dashboard style) */}
      <footer className="bg-white shadow-inner py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          © {new Date().getFullYear()} VerifyAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default VerificationResults;
