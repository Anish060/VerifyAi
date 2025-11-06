import sys
import json
import subprocess
import pdfplumber
import docx2txt
from PIL import Image
from transformers import pipeline
import cv2
import numpy as np
import torch
import gc
import google.generativeai as genai
import io

# ----------------------------
# Gemini API Configuration
# ----------------------------
genai.configure(api_key="AIzaSyCNsyTGmTQMEph4CK39AyLYb4qI7XEAQU4")  
# Replace with your key

# Reduce CPU threads to avoid Render crash
torch.set_num_threads(1)

# -------- Model Cache (load once) --------
MODEL_IMAGE = None

# ✅ Use Lightweight models (stable for free tier)
IMAGE_MODEL_NAME = "microsoft/resnet-18"  # small lightweight CNN

# -------- Text Extraction --------
def extract_text_from_pdf(path):
    try:
        with pdfplumber.open(path) as pdf:
            text = ''.join([page.extract_text() or '' for page in pdf.pages])
        return text.strip()
    except Exception as e:
        return f"[PDF extraction error: {str(e)}]"

def extract_text_from_docx(path):
    try:
        return docx2txt.process(path).strip()
    except Exception as e:
        return f"[DOCX extraction error: {str(e)}]"

def extract_text_from_txt(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        return f"[TXT extraction error: {str(e)}]"

# -------- Gemini Text AI Detection --------
def detect_ai_text_probability_gemini(text):
    try:
        result = subprocess.run(
            ["node", "Gemini.js", text[:2000]],
            capture_output=True,
            text=True
        )
        output = result.stdout.strip()
        if not output:
            return "[Gemini API error: no output]"
        return json.loads(output)
    except Exception as e:
        return f"[Gemini API error: {str(e)}]"

# -------- Image Classification (General type detection) --------
def classify_image(image_path):
    global MODEL_IMAGE
    try:
        if MODEL_IMAGE is None:
            MODEL_IMAGE = pipeline("image-classification", model=IMAGE_MODEL_NAME)
        img = Image.open(image_path).convert("RGB")
        result = MODEL_IMAGE(img)[0]
        return f"{result['label']} ({result['score'] * 100:.2f}%)"
    except Exception as e:
        return f"[Image classification error: {str(e)}]"

# -------- Gemini Deepfake Detection (Image) --------
def detect_deepfake_image(path):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")

        with open(path, "rb") as f:
            img_bytes = f.read()

        prompt = """
You are an advanced deepfake forensic AI. Analyze whether this image is real or a deepfake.

Return ONLY a valid JSON in this exact format:
{
  "label": "real" | "fake" | "uncertain",
  "confidence": (number between 0 and 100)
}
"""

        response = model.generate_content([
            {"role": "user", "parts": [prompt, {"mime_type": "image/jpeg", "data": img_bytes}]}
        ])

        text = response.text.strip()
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        try:
            data = json.loads(text)
        except:
            return 50  # fallback if Gemini returns non-JSON

        confidence = float(data.get("confidence", 50))
        label = data.get("label", "uncertain").lower()

        if label == "fake":
            return round(confidence, 2)
        elif label == "real":
            return round(100 - confidence, 2)
        else:
            return 50
    except Exception as e:
        return f"[Gemini Deepfake Detection Error: {str(e)}]"

# -------- Gemini Deepfake Detection (Video) --------
def detect_deepfake_video(path):
    try:
        cap = cv2.VideoCapture(path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        mid = total // 2
        cap.set(cv2.CAP_PROP_POS_FRAMES, mid)
        ret, frame = cap.read()
        if not ret:
            return 50

        frame_path = path + "_frame.jpg"
        cv2.imwrite(frame_path, frame)
        return detect_deepfake_image(frame_path)
    except Exception as e:
        return f"[Video Deepfake Detection Error: {str(e)}]"

# -------- Main --------
def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python python_runner.py <filepath> <ext>"}))
        return

    path, ext = sys.argv[1], sys.argv[2].lower()
    result = {"text": None, "ai_score": None, "image": None, "deepfake": None}

    try:
        if ext == "pdf":
            text = extract_text_from_pdf(path)
            result["text"] = text
            result["ai_score"] = detect_ai_text_probability_gemini(text)

        elif ext == "docx":
            text = extract_text_from_docx(path)
            result["text"] = text
            result["ai_score"] = detect_ai_text_probability_gemini(text)

        elif ext == "txt":
            text = extract_text_from_txt(path)
            result["text"] = text
            result["ai_score"] = detect_ai_text_probability_gemini(text)

        elif ext in ["jpg", "jpeg", "png"]:
            result["text"] = "[Image File]"
            result["image"] = classify_image(path)
            result["deepfake"] = detect_deepfake_image(path)

        elif ext in ["mp4", "mov", "avi", "mkv"]:
            result["text"] = "[Video File]"
            result["deepfake"] = detect_deepfake_video(path)

        else:
            result["text"] = "[Unsupported file type]"

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

    gc.collect()

if __name__ == "__main__":
    main()
