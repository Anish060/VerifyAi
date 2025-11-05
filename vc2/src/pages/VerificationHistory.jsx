import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// The VerificationHistory component implements the fetching, state management,
// and rendering logic for a full-page dashboard view of file verification results.

const VerificationHistory = () => {
    // State for data fetching
    const [verificationData, setVerificationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
     const navigate = useNavigate();
    const API_URL = "https://verifyai-1.onrender.com/api/user/history";

    // --- Data Fetching Logic ---
    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(API_URL, {
                // Ensure cookies/session info are sent
                withCredentials: true,
            });

            // Access the 'data' property of the response body, defaulting to an empty array
            const records = response.data?.data || [];
            setVerificationData(records);

        } catch (err) {
            console.error("Error fetching verification history:", err);
            // Handle specific HTTP errors
            if (err.response?.status === 401) {
                setError("You must be logged in to view history.");
            } else {
                setError("Failed to load verification history. Please try again.");
            }
            setVerificationData([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect to call fetchHistory on component mount
    useEffect(() => {
        fetchHistory();
    }, []);

    // --- Process record for table display ---
    // This helper extracts relevant fields and calculates display status/colors
    const processRecordForTable = (record) => {
        // Handle both snake_case and camelCase keys for robustness
        const aiScore = record.ai_score ?? record.aiScore ?? 0;
        const deepfakeScore = record.deepfake_score ?? record.deepfakeScore ?? 0;
        const fileName = record.file_name ?? record.fileName ?? "Unknown File";
        const uploadDate = record.upload_date ?? record.uploadDate ?? new Date();
        const status = record.status ?? "Pending";
        const recordId = record.record_id ?? record.recordId ?? record.id ?? crypto.randomUUID();

        let aiScoreColor = "gray";
        let aiScoreText = "Pending";
        let deepfakeScoreColor = "gray";
        let deepfakeScoreText = "Pending";

        // Logic for determining status badges
        
            if (aiScore >= 85) {
                aiScoreColor = "red";
                aiScoreText = `${aiScore}% Suspicious`;
            } else if (aiScore >= 50) {
                aiScoreColor = "yellow";
                aiScoreText = `${aiScore}% Moderate AI`;
            } else {
               
                 aiScoreColor = "green";
                aiScoreText = `${aiScore}% Authentic`;
            }

            if (deepfakeScore > 50) {
                deepfakeScoreColor = "red";
                deepfakeScoreText = `${deepfakeScore}% Deepfake`;
            } else {
                deepfakeScoreColor = "green";
                deepfakeScoreText = `${deepfakeScore}% Clean`;
            }
        

        return {
            id: recordId,
            fileName,
            uploadDate: new Date(uploadDate).toLocaleDateString(),
            aiScore: aiScoreText,
            deepfakeScore: deepfakeScoreText,
            aiScoreColor,
            deepfakeScoreColor,
        };
    };

    // Helper function to render score/status badge based on color
    const renderBadge = (text, color) => {
        const colors = {
            green: "bg-green-100 text-green-800",
            red: "bg-red-100 text-red-800",
            yellow: "bg-yellow-100 text-yellow-800",
            gray: "bg-gray-100 text-gray-800",
        };
        const classNames = colors[color] || colors.gray;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classNames}`}>
                {text}
            </span>
        );
    };

    return (
        // Full page container based on the reference design
        <div className="relative flex h-screen w-full flex-col group/design-root overflow-auto bg-background-light font-display text-[#111418]">
            <div className="layout-container flex h-full grow flex-col">

                {/* Header Section */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] px-4 sm:px-10 py-3 bg-white shadow-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-8">
                            {/* Simple Checkmark/Verification Icon */}
                            <svg className="size-full fill-[#1173d4]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93l-4.5-4.5 1.41-1.41L11 15.11l7.07-7.07 1.41 1.41-8.48 8.48z"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-[#111418]">VerifyAI</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-4">
                        <nav className="hidden sm:flex items-center gap-6">
                            <a className="text-sm font-medium leading-normal text-[#617589] hover:text-primary" href="/Dash">Dashboard</a>
                            <a className="text-sm font-medium leading-normal text-primary font-bold border-b-2 border-primary pb-1" href="/hist">History</a>
                            <a className="text-sm font-medium leading-normal text-[#617589] hover:text-primary" href="#">Upload</a>
                        </nav>
                        <a className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition duration-200" href='/'><span className="truncate">Logout</span></a>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hidden sm:block" data-alt="User profile picture" style={{ backgroundImage: 'url("https://placehold.co/100x100/1173d4/ffffff?text=U")' }}></div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-background-light">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Title and Description */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                            <div className="flex min-w-72 flex-col gap-1">
                                <p className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em]">Verification History</p>
                                <p className="text-[#617589] text-base font-normal leading-normal">View and manage your past verifications.</p>
                            </div>
                        </div>

                        {/* Table Card */}
                        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
                            
                            {/* Loading State */}
                            {loading && (
                                <div className="text-center py-12 text-[#617589] text-lg flex items-center justify-center space-x-2">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1173d4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading verification history...
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="text-center py-12 text-red-600 text-lg font-medium bg-red-50 border border-red-200 rounded-lg">{error}</div>
                            )}
                            
                            {/* Empty State */}
                            {!loading && !error && verificationData.length === 0 && (
                                <div className="text-center py-12 text-[#617589] text-lg">
                                    <p>No verification records found.</p>
                                    <p className="mt-2 text-sm">Upload a file to get started!</p>
                                </div>
                            )}

                            {/* Data Table */}
                            {!loading && !error && verificationData.length > 0 && (
                                <>
                                    <div className="overflow-x-auto shadow-md rounded-lg">
                                        <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6]">
                                            <table className="min-w-full divide-y divide-[#dbe0e6]">
                                                {/* Table Header */}
                                                <thead className="bg-[#f0f2f4]">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-[#617589] uppercase tracking-wider" scope="col">File Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-[#617589] uppercase tracking-wider" scope="col">Upload Date</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-[#617589] uppercase tracking-wider" scope="col">AI Score</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-[#617589] uppercase tracking-wider" scope="col">Deepfake Score</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-[#617589] uppercase tracking-wider" scope="col">Actions</th>
                                                    </tr>
                                                </thead>
                                                {/* Table Body - Using corrected camelCase properties */}
                                                <tbody className="bg-white divide-y divide-[#dbe0e6]">
                                                    {verificationData.map((record) => {
                                                        const row = processRecordForTable(record);
                                                        return (
                                                            <tr key={row.id} className="hover:bg-gray-50 transition duration-150">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111418]">{row.fileName}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617589]">{row.uploadDate}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {renderBadge(row.aiScore, row.aiScoreColor)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {renderBadge(row.deepfakeScore, row.deepfakeScoreColor)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <a className="text-primary hover:text-primary/80 transition duration-150 mr-4" 
                                                                    onClick={() => {
    // Assuming 'record' is your history item from the API
    const verificationResult = {
      aiScore: record.ai_score || 0,
      deepfakeScore: record.deepfake_score || 0,
      imageAnalysis: record.imageAnalysis || {},
      fileSize: record.fileSize || 0,
      fileType: record.fileType || "Unknown",
      source: record.sourceTokens || "Unknown",
      summary: record.summary || "No summary available",
      detailedExplanation: record.detailedExplanation || "No details available",
      metadataScore: record.metadataScore || 0,
      linguisticScore: record.linguisticScore || 0,
      pixelInconsistencyScore: record.pixelInconsistencyScore || 0,
      analysisDetails: record.analysis_Details || {},
    };
                                                                        
    // Use the full record object from API
    navigate("/VR", {
      state: {
        verificationResult, // make sure this is the full object from backend
        uploadedFileName: record.file_name || record.fileName,
      },
    });
  }}
                                                                    >View Details
                                                                    
                                                                    </a>
                                                                   
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination Placeholder */}
                                    <div className="mt-6 flex items-center justify-between">
                                        <p className="text-sm text-[#617589]">Showing 1 to {verificationData.length} of {verificationData.length} results</p>
                                        <div className="flex items-center gap-2">
                                            {/* Pagination buttons would go here */}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Wrapper component to include Tailwind and custom styles
const AppWrapper = () => {
    // Custom styles derived from the reference component's design system
    const styleConfig = `
.bg-background-light { background-color: #f6f7f8; }
.text-primary { color: #1173d4; }
.border-\\[\\#dbe0e6\\] { border-color: #dbe0e6; }
.text-\\[\\#617589\\] { color: #617589; }
.bg-\\[\\#f0f2f4\\] { background-color: #f0f2f4; }
.text-\\[\\#111418\\] { color: #111418; }
.font-display { font-family: 'Inter', sans-serif; }
.bg-primary { background-color: #1173d4; }
`;
    return (
        <>
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Load Inter font from Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{ __html: styleConfig }} />
            <VerificationHistory />
        </>
    );
};

export default AppWrapper;
