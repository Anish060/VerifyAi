const { callGeminiAPI } = require("../ai_utils/gemini");
const { runPythonDetection } = require("../ai_utils/python_runner");
const fs = require("fs");
const jwt = require('jsonwebtoken'); // Need jwt to decode the cookie
// Assuming your model function is exported correctly from a file like '../models/userModel.js'
const { addData } = require('../model/user_model'); 

// Helper function to manually parse cookies (as defined in previous steps)
const parseCookies = (req) => {
    const cookies = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            if (parts.length === 2) {
                cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
            }
        });
    }
    return cookies;
};

// Helper to determine the overall status for the DB's 'status' field
const determineStatus = (aiScore, deepfakeScore) => {
    // Use nullish coalescing to treat null scores as 0 for status determination
    const score = aiScore ?? 0;
    const dfScore = deepfakeScore ?? 0;

    if (dfScore > 50) return 'Deepfake';
    if (score < 70) return 'Pending'; // Low score might need human review
    if (score >= 90) return 'Verified';
    return 'Completed'; // Default status if other conditions aren't met
};


exports.handleDetection = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        const ext = req.file.originalname.split(".").pop().toLowerCase();
        
        // --- 1. Get User ID from Cookie (Since no 'auth' middleware is used) ---
        const cookies = parseCookies(req);
        const token = cookies.jwt;
        let userId = null;

        if (token) {
            try {
                // Insecure decode for college project
                const decoded = jwt.decode(token); 
                userId = decoded?.id;
            } catch (e) {
                console.warn("Could not decode JWT for detection record. Proceeding without userId.");
            }
        }
        
        // Fallback for demonstration if cookie fails
        if (!userId) {
            // Assign a guest/default user ID if required by the DB constraint
            // This is critical for the NOT NULL constraint on user_id
            userId = req.body.userId || 1; // Assuming '1' is a Guest User ID
        }

        // --- 2. Run AI/Python Detection ---
        const pyResult = await runPythonDetection(filePath, ext);
        let aiAnalysis = null;

        if (pyResult.text && pyResult.text !== "[Image File]" && !pyResult.text.startsWith("[Unsupported")) {
            try {
                aiAnalysis = await callGeminiAPI(pyResult.text);
            } catch (geminiErr) {
                console.error("Gemini API Error:", geminiErr);
                aiAnalysis = {
                    ai_percentage: 0,
                    human_percentage: 0,
                    analysis_details: "[Gemini API failed or returned poor results]",
                };
            }
        }

    // --- 3. Process and Finalize Scores (Extraction Point) ---
    // Use nullish coalescing (??) to default to 0 for numeric scores if null/undefined, 
    // to prevent the ER_BAD_NULL_ERROR on mandatory score columns.
    const finalAI_Score = aiAnalysis?.ai_percentage ?? 0;
    const finalHuman_Score = aiAnalysis?.human_percentage ?? 0;
    const finalDeepfake_Score = pyResult.deepfake ?? 0; // Use 0 as default non-deepfake score

    // New fields extracted from the updated JSON schema
    const finalSummary = aiAnalysis?.summary ?? null;
    const finalDetailedExplanation = aiAnalysis?.detailed_explanation ?? null;
    const finalMetadataScore = aiAnalysis?.metadata_score ?? 0;
    const finalLinguisticScore = aiAnalysis?.linguistic_score ?? 0;
    const finalPixelInconsistencyScore = aiAnalysis?.pixel_inconsistency_score ?? 0;
    const finalSourceTokens = aiAnalysis?.source ?? null;
    const finalAnalysis=aiAnalysis?.analysis_details??"Nothing";

    const finalStatus = determineStatus(finalAI_Score, finalDeepfake_Score)

    // --- 4. Database Insertion (Integration Point) ---
    try {
        // The userId is guaranteed to be non-null (1) at this point
        if (userId) {
            const recordData = {
                // FIX 1: Change to snake_case 'user_id' to match the database column name,
                // which is what user_model.js is likely expecting.
                user_id: userId, 
                
                // Mapped from File Metadata
                file_name: req.file.originalname, // Change to snake_case for consistency
                upload_date: new Date(),
                file_type: req.file.mimetype, // Change to snake_case
                file_size: req.file.size,     // Change to snake_case
                
                // Mapped from Internal Logic/Analysis
                status: "completed", // Use the determined status
                
                // FIX 2: Ensure all keys here are snake_case to match DB columns
                ai_score: finalAI_Score,
                human_score: finalHuman_Score,
                deepfake_score: finalDeepfake_Score,

                // Updated/New Analysis Fields from LLM (snake_case)
                detailedExplanation:finalDetailedExplanation,
                summary: finalSummary,
                analysis_details: finalAnalysis,
                metadataScore: finalMetadataScore,
                linguisticScore: finalLinguisticScore,
                pixelInconsistencyScore: finalPixelInconsistencyScore,
                
                // Source is used for the list of suspicious tokens
                sourceTokens: finalSourceTokens
            };
            
            // Call the model function to save the record
            await addData(recordData); 
            console.log(`Verification record saved for user ${userId}.`);
        }
    } catch (dbErr) {
        // Log the DB error but proceed to send the result to the client
        console.error("Failed to insert verification record into DB:", dbErr);
    }

    // --- 5. Cleanup and Response ---
    fs.unlinkSync(filePath);

    res.json({
        textExtracted: pyResult.text || null,
        aiScore: finalAI_Score,
        humanScore: finalHuman_Score,
        deepfakeScore: finalDeepfake_Score,
        imageAnalysis: pyResult.image ?? null,
        
        // Updated/New Analysis Fields for Client (camelCase for client response is fine)
        summary: finalSummary,
        detailedExplanation: finalDetailedExplanation,
        metadataScore: finalMetadataScore,
        linguisticScore: finalLinguisticScore,
        pixelInconsistencyScore: finalPixelInconsistencyScore,

        // Source (tokens list)
        source: finalSourceTokens,

        // Include status for client display
        status: finalStatus
    });
        
    } catch (err) {
        console.error("Verify Controller Error:", err);
        // Clean up file on failure
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};
